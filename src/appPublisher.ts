import { ExtensionContext, window, OpenDialogOptions, QuickPickItem, QuickInputButton, QuickInput, Disposable, QuickInputButtons } from "vscode";
import { MultiStepInput } from "./mutiStepInput";

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

        } 

        else if (state.publishOption === 'Update Existing Application') {
			const execLocation = context.asAbsolutePath("kuksa-publisher.py");
			window.createTerminal('Kuksa Terminal').sendText('python3 ' + execLocation + ' ' + state.configFilePath+' -r');
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
    
 
