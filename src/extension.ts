

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { window, commands, ExtensionContext } from 'vscode';
import { appGenerator } from './appGenerator';
import { appConfigGenerator } from './appConfigGenerator';
//import { quickOpen } from './quickOpen';


export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand('Kuksa', async () => {
		var shell = require('shelljs');
		const projectName = await window.showInputBox({
			placeHolder: 'Enter Project Name'
		});
		shell.mkdir('-p',projectName + '/' + 'docker');
		shell.mkdir('-p',projectName + '/' + 'include');
		shell.mkdir('-p',projectName + '/' + 'src');
		const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
			//showQuickPick,
			//showInputBox,
			appConfigGenerator,
			appGenerator
			//quickOpen,
		};
		const quickPick = window.createQuickPick();
		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection((selection: { label: string | number; }[]) => {
			if (selection[0]) {
				options[selection[0].label](context)
					.catch(console.error);
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	}));
}
