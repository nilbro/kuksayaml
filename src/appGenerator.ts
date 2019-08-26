/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, Disposable, CancellationToken, QuickInputButton, QuickInput, ExtensionContext, QuickInputButtons, Uri, OpenDialogOptions } from 'vscode';
import { MultiStepInput } from "./mutiStepInput";
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
