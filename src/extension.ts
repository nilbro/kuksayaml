

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { window, commands, ExtensionContext } from 'vscode';
import { appGenerator } from './appGenerator';
import { appConfigGenerator } from './appConfigGenerator';
import { appPublisher } from './appPublisher';
//import { quickOpen } from './quickOpen';


export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand('Kuksa', async () => {
		
		//var projectList = [];
		
		const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
			//showQuickPick,
			//showInputBox,
			appConfigGenerator,
			appGenerator,
			appPublisher
			//quickOpen,
		};
		const quickPick = window.createQuickPick();
		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection((selection: { label: string | number; }[]) => {
			if (selection[0]) {
				//window.showErrorMessage(selection[0].label.toString());
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));
}
