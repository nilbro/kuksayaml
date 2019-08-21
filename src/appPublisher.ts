import { ExtensionContext, window, OpenDialogOptions, QuickPickItem, QuickInputButton, QuickInput, Disposable, QuickInputButtons } from "vscode";

export async function appPublisher(context: ExtensionContext) {

    const publishOptions: QuickPickItem[] = ['Create New Application', 'Update Existing Application'].map(label => ({ label }));

    interface State {
		title: string;
		step: number;
		totalSteps: number;
        publishOption: string;
        configFilePath: string;
    }
    
    async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => publishCreateUpdate(input,state));
		return state as State;
    }
    
    const title = 'App Publisher';

	async function publishCreateUpdate(input: MultiStepInput, state: Partial<State>) {
		const pick = await input.showQuickPick({
			title,
			step: 1,
			totalSteps: 1,
			placeholder: 'Choose',
			items: publishOptions,
			//activeItem: typeof state.architecture !== 'string' ? state.architecture : undefined,
			shouldResume: shouldResume
		});
        state.publishOption = pick.label;
        window.showInformationMessage(state.publishOption);
		return (input: MultiStepInput)=>selectConfigFile(state);
    }
    
    async function selectConfigFile(state: Partial<State>){
        window.showInformationMessage("Select Configuration(.yaml) File ");
        const options: OpenDialogOptions = {
            canSelectMany: false,
            canSelectFiles: true,
            canSelectFolders: false,
            openLabel: 'Open',
            filters: {
               'YAML files': ['yaml'],
               'All files': ['*']
           }
       };
       
      await  window.showOpenDialog(options).then(fileUri => {
           if (fileUri && fileUri[0]) {
               state.configFilePath = fileUri[0].fsPath;
               console.log(state.configFilePath);
           }
       });

       return (input: MultiStepInput)=>publishApp(state); 

    }
    async function publishApp(state: Partial<State>){
        
        if (state.publishOption === 'Create New Application') {
			
			const execLocation = context.asAbsolutePath("kuksa-publisher.py");
			window.createTerminal('Kuksa Terminal').sendText('python3 ' + execLocation + ' ' + state.configFilePath+' -n');
       // const {PythonShell} = require('python-shell');
         //   let options = {
           //     args:[state.configFilePath,'-n']
			//};
			//PythonShell.runString('echo "Hello"');
		//await PythonShell.runString(execLocation + ' ' + state.configFilePath+' -n');
       
        } 

        else if (state.publishOption === 'Update Existing Application') {
			const execLocation = context.asAbsolutePath("kuksa-publisher.py");
        const {PythonShell} = require('python-shell');
            let options = {
                args:[state.configFilePath,'-r']
            };

        PythonShell.run(execLocation, options, function (err: any, res: any[]) {
            console.log(res[0]);  // 1
        }); 

        }

        else {
            window.showErrorMessage("No such option exists");
        }

		
    }




    function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
	}

	async function validateNameIsUnique(name: string) {
		// ...validate...
		await new Promise(resolve => setTimeout(resolve, 1000));
		return name === 'vscode' ? 'Name not unique' : undefined;
	}


	const state = await collectInputs();
    }
    
 

    
// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------


class InputFlowAction {
	private constructor() { }
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items: T[];
	activeItem?: T;
	placeholder: string;
	buttons?: QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}


interface InputBoxParameters {
	title: string;
	step: number;
	totalSteps: number;
	value: string;
	prompt: string;
	validate: (value: string) => Promise<string | undefined>;
	buttons?: QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input.stepThrough(start);
	}

	private current?: QuickInput;
	private steps: InputStep[] = [];

	private async stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this.steps.push(step);
			if (this.current) {
				this.current.enabled = false;
				this.current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this.steps.pop();
					step = this.steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this.steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this.current) {
			this.current.dispose();
		}
	}

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;
				if (activeItem) {
					input.activeItems = [activeItem];
				}
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidChangeSelection(items => resolve(items[0])),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createInputBox();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.value = value || '';
				input.prompt = prompt;
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];
				let validating = validate('');
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidAccept(async () => {
						const value = input.value;
						input.enabled = false;
						input.busy = true;
						if (!(await validate(value))) {
							resolve(value);
						}
						input.enabled = true;
						input.busy = false;
					}),
					input.onDidChangeValue(async text => {
						const current = validate(text);
						validating = current;
						const validationMessage = await current;
						if (current === validating) {
							input.validationMessage = validationMessage;
						}
					}),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}
}
