/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, Disposable, QuickInputButton, QuickInput, ExtensionContext, QuickInputButtons } from 'vscode';



/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 * 
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function appConfigGenerator(context: ExtensionContext) {

//	const yamlType: QuickPickItem[] = ['Deployment','Service']
//		.map(label => ({ label }));


		interface State {
			title: string;
			step: number;
			totalSteps: number;
			resourceGroup: QuickPickItem | string;
			name: string;
			runtime: QuickPickItem;
		}
	
		async function collectInputs() {
			const state = {} as Partial<State>;
			await MultiStepInput.run(input => inputImage(input, state));
			return state as State;
		}

	const title = 'App Configuration Generator';

	//var fs = require('fs');

	

	async function inputImage(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		window.showInformationMessage('Starting with Docker Configuration');
		//yamlGenerator();
		await input.showInputBox({
			title,
			step: 1 ,
			totalSteps: 5 ,
			value: state.name || '',
			prompt: 'Choose Docker Image',
			validate: validateNameIsUnique,
			//write: writeToExternal,
			shouldResume: shouldResume
		});
		//writeToExternal(input.);
		return (input: MultiStepInput) => inputImageName(input, state);
	}

	async function inputImageName(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		await input.showInputBox({
			title,
			step: 1 ,
			totalSteps: 5 ,
			value: state.name || '',
			prompt: 'Enter Name of Application',
			validate: validateNameIsUnique,
			//write: writeToExternal,
			shouldResume: shouldResume
		});
		//writeToExternal(input.);
		return (input: MultiStepInput) => inputVersion(input, state);
	}

	async function inputVersion(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Version',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputOwner(input, state);
	}

	async function inputOwner(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Owner',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputDescription(input, state);
	}

	async function inputDescription(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Give a short description',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		window.showInformationMessage('Docker configuration complete');
		return (input: MultiStepInput) => inputCategory(input, state);
	}
	
	async function inputCategory(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		window.showInformationMessage('Starting AppStore Configuration');
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Appstore Category',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		//window.showInformationMessage('Appstore Configuration Complete');
		return (input: MultiStepInput) => inputAuthorization(input, state);
	}

	async function inputAuthorization(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Authorization Code',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		window.showInformationMessage('Appstore Configuration Complete');
		return (input: MultiStepInput) => inputTarget(input, state);
	}

	async function inputTarget(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		window.showInformationMessage('Starting with Hawkbit Configuration');
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Appstore Target',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputUsername(input, state);
	}

	async function inputUsername(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		//window.showInformationMessage('Starting with Appstore Configuration');
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Username',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputPassword(input, state);
	}

	async function inputPassword(input: MultiStepInput, state: Partial<State>) {
		//const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		//window.showInformationMessage('Starting with Appstore Configuration');
		state.name = await input.showInputBox({
			title,
			step: 3 ,
			totalSteps: 5,
			value: state.name || '',
			prompt: 'Input Password',
			//write: writeToExternal,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		window.showInformationMessage('Hawkbit Configuration Complete');
		yamlGenerator();
		//return (input: MultiStepInput) => inputReplicaNumber(input, state);
	}

	
	async function yamlGenerator(){	

		var extensionModule = require('./extension');
		const projectName = extensionModule.projectName;
        const execLocation = context.asAbsolutePath("yamlgen.py");
		const {PythonShell} = require('python-shell');
		let options = {
			args:[projectName]
		};
		PythonShell.run(execLocation, options, function (err: any, res: any[]) {
			
  			if (err) { throw err; }
  			console.log(res[0]);  // 1
		});
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
	//write: (value: string) => Promise<undefined>;
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

	

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt,  validate, buttons, shouldResume }: P) {
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
				//let writing = write('');
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
							var fs = require('fs');
							var os = require('os');
							fs.appendFile("temp.txt", value+os.EOL, (err: any) => {
								if (err) { 
									console.log(err); 
								}
									console.log("Successfully Written to File.");
		  						});
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
