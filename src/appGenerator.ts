/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, Disposable, CancellationToken, QuickInputButton, QuickInput, ExtensionContext, QuickInputButtons, Uri, OpenDialogOptions } from 'vscode';

/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 * 
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function appGenerator(context: ExtensionContext) {



	const architectureList: QuickPickItem[] = ['amd64', 'arm64', 'arm32v6']
	.map(label => ({ label }));


	interface State {
		title: string;
		step: number;
		totalSteps: number;
		architecture: string;
		tag: string;
		dockerpath: string;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => pickArchitecture(input,state));
		return state as State;
	}

	const title = 'Generate App';

	async function pickArchitecture(input: MultiStepInput, state: Partial<State>) {
		const pickArch = await input.showQuickPick({
			title,
			step: 1,
			totalSteps: 3,
			placeholder: 'Select Architecture',
			items: architectureList,
			//activeItem: typeof state.architecture !== 'string' ? state.architecture : undefined,
			shouldResume: shouldResume
		});
		state.architecture = pickArch.label;
		return (input: MultiStepInput) => inputTag(input, state);
	}



	async function inputTag(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.architecture === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.tag = await input.showInputBox({
			title,
			step: 2 ,
			totalSteps: 3,
			value: state.tag || '',
			prompt: 'Provide a tag (optional)',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		//return (input: MultiStepInput) => generateImage(state);
		return (input: MultiStepInput) => selectDockerImage(state);
	}

	async function selectDockerImage(state: Partial<State>){
		window.showInformationMessage("Select Dockerfile");
        const options: OpenDialogOptions = {
            canSelectMany: false,
            canSelectFiles: true,
            canSelectFolders: false,
            openLabel: 'Select',
            filters: {
               'All files': ['*']
           }
       };
       
      await  window.showOpenDialog(options).then(fileUri => {
           if (fileUri && fileUri[0]) {
               state.dockerpath = fileUri[0].fsPath;
               //console.log(state.configFilePath);
           }
       });

       return (input: MultiStepInput)=>generateImage(state); 
		
	}

	async function generateImage(state: Partial<State>){
		window.showInformationMessage("Building Image");
		const arch = state.architecture;
		const tag = state.tag;
		
		//const shell = require('shelljs');
		//const projectName = shell.exec('basename "`pwd`"');
		//shell.cd('$HOME'+'/'+projectName+'/'+'docker');
		window.createTerminal('kuksaTerminal').sendText('cd docker;sh build.sh '+arch+' '+tag);
		//window.createTerminal(*'kuksaTerminal').sendText('cd docker');
		//shell.cd('$HOME'+'/'+projectName+'/'+'docker');
		//shell.sed('-i','kuksa',projectName,projectName + '/' + 'docker'+'/'+'build.sh');
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
//	window.showInformationMessage(`Creating Application Service '${state.name}'`);
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