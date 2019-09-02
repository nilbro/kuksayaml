"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const appGenerator_1 = require("./appGenerator");
const appConfigGenerator_1 = require("./appConfigGenerator");
const appPublisher_1 = require("./appPublisher");
const kuksaTreeGenerator_1 = require("./kuksaTreeGenerator");
const yamlGeneratorForm_1 = require("./yamlGeneratorForm");
//import { quickOpen } from './quickOpen';
function activate(context) {
    /*
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
    */
    context.subscriptions.push(vscode_1.commands.registerCommand('kuksa.createTree', _ => {
        kuksaTreeGenerator_1.kuksaTreeGenerator(context)
            .catch(console.error);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('kuksa.createYaml', _ => {
        appConfigGenerator_1.appConfigGenerator(context)
            .catch(console.error);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('kuksa.generateDockerFile', _ => {
        appGenerator_1.appGenerator(context)
            .catch(console.error);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('kuksa.createYamlForm', _ => {
        yamlGeneratorForm_1.yamlGeneratorForm(context);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('kuksa.publishApp', _ => {
        appPublisher_1.appPublisher(context)
            .catch(console.error);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map