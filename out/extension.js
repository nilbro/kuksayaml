"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const dockerBuild_1 = require("./dockerBuild");
const kuksaYaml_1 = require("./kuksaYaml");
//import { quickOpen } from './quickOpen';
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('Kuksa', () => __awaiter(this, void 0, void 0, function* () {
        const options = {
            //showQuickPick,
            //showInputBox,
            kuksaYaml: kuksaYaml_1.kuksaYaml,
            dockerBuild: dockerBuild_1.dockerBuild
            //quickOpen,
        };
        const quickPick = vscode_1.window.createQuickPick();
        quickPick.items = Object.keys(options).map(label => ({ label }));
        quickPick.onDidChangeSelection((selection) => {
            if (selection[0]) {
                options[selection[0].label](context)
                    .catch(console.error);
            }
        });
        quickPick.onDidHide(() => quickPick.dispose());
        quickPick.show();
    })));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map