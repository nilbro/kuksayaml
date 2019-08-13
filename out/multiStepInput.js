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
/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
function multiStepInput(context) {
    return __awaiter(this, void 0, void 0, function* () {
        //	const yamlType: QuickPickItem[] = ['Deployment','Service']
        //		.map(label => ({ label }));
        function collectInputs() {
            return __awaiter(this, void 0, void 0, function* () {
                const state = {};
                yield MultiStepInput.run(input => inputImage(input, state));
                return state;
            });
        }
        const title = 'YAML Generator';
        //var fs = require('fs');
        function inputImage(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                vscode_1.window.showInformationMessage('Starting with Docker Configuration');
                //yamlGenerator();
                yield input.showInputBox({
                    title,
                    step: 1,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Choose Docker Image',
                    validate: validateNameIsUnique,
                    //write: writeToExternal,
                    shouldResume: shouldResume
                });
                //writeToExternal(input.);
                return (input) => inputImageName(input, state);
            });
        }
        function inputImageName(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                yield input.showInputBox({
                    title,
                    step: 1,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Enter Name of Application',
                    validate: validateNameIsUnique,
                    //write: writeToExternal,
                    shouldResume: shouldResume
                });
                //writeToExternal(input.);
                return (input) => inputVersion(input, state);
            });
        }
        function inputVersion(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Version',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                return (input) => inputOwner(input, state);
            });
        }
        function inputOwner(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Owner',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                return (input) => inputDescription(input, state);
            });
        }
        function inputDescription(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Give a short description',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                vscode_1.window.showInformationMessage('Docker configuration complete');
                return (input) => inputCategory(input, state);
            });
        }
        function inputCategory(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                vscode_1.window.showInformationMessage('Starting AppStore Configuration');
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Appstore Category',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                //window.showInformationMessage('Appstore Configuration Complete');
                return (input) => inputAuthorization(input, state);
            });
        }
        function inputAuthorization(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Authorization Code',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                vscode_1.window.showInformationMessage('Appstore Configuration Complete');
                return (input) => inputTarget(input, state);
            });
        }
        function inputTarget(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                vscode_1.window.showInformationMessage('Starting with Hawkbit Configuration');
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Appstore Target',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                return (input) => inputUsername(input, state);
            });
        }
        function inputUsername(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                //window.showInformationMessage('Starting with Appstore Configuration');
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Username',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                return (input) => inputPassword(input, state);
            });
        }
        function inputPassword(input, state) {
            return __awaiter(this, void 0, void 0, function* () {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                //window.showInformationMessage('Starting with Appstore Configuration');
                state.name = yield input.showInputBox({
                    title,
                    step: 3,
                    totalSteps: 5,
                    value: state.name || '',
                    prompt: 'Input Password',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                vscode_1.window.showInformationMessage('Hawkbit Configuration Complete');
                yamlGenerator();
                //return (input: MultiStepInput) => inputReplicaNumber(input, state);
            });
        }
        function yamlGenerator() {
            return __awaiter(this, void 0, void 0, function* () {
                // window.showInformationMessage('Creating YAML file');
                const execLocation = context.asAbsolutePath("yamlgen.py");
                const cp = require('child_process');
                const { PythonShell } = require('python-shell');
                PythonShell.run(execLocation, null, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res[0]); // 1
                });
                //let command: string = 'python /home/bro/Documents/nilbro/Appstacle/vscode-extension-samples/quickinput-sample/src/yamlgen.py';
                //let command: string = "require('path').resolve(require('path').dirname(require.main.filename)";
                /*cp.exec('python ' + execLocation, (err: any, stdout: any, stderr: any) => {
                    window.showInformationMessage('Creating YAML file');
                    console.log(stdout);
                });*/
                // const fs =require('fs');
                //const vscodeExecutablePath = await downloadAndUnzipVSCode('1.34.0');
                //console.log(path.resolve(vscodeExecutablePath);
                //fs.readFile(require('path').resolve(require('path').dirname(require.main.filename), 'yamlgen.py'));
            });
        }
        /*	async function chooseYamlType(input: MultiStepInput, state: Partial<State>) {
                await input.showQuickPick({
                    title,
                    step: 2,
                    totalSteps: 5,
                    placeholder: 'Which type of Pod controller mechanism whould you like to use?',
                    items: yamlType,
                    activeItem: typeof state.resourceGroup !== 'string' ? state.resourceGroup : undefined,
                    //buttons: [createResourceGroupButton],
                    shouldResume: shouldResume
                });/*
                if (pick instanceof MyButton) {
                    return (input: MultiStepInput) => inputResourceGroupName(input, state);
                }
                state.resourceGroup = pick;
                return (input: MultiStepInput) => inputVersion(input, state);
            }
        
        
        /*
            async function inputReplicaNumber(input: MultiStepInput, state: Partial<State>) {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = await input.showInputBox({
                    title,
                    step: 4,
                    totalSteps: 5 ,
                    value: state.name || '',
                    //write: writeToExternal,
                    prompt: 'Input number of replicas',
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                return (input: MultiStepInput) => inputImage(input, state);
            }
        
        
            async function inputImage(input: MultiStepInput, state: Partial<State>) {
                //const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                // TODO: Remember current value when navigating back.
                state.name = await input.showInputBox({
                    title,
                    step: 5,
                    totalSteps: 5 ,
                    value: state.name || '',
                    prompt: 'Input image',
                    //write: writeToExternal,
                    validate: validateNameIsUnique,
                    shouldResume: shouldResume
                });
                //return (input: MultiStepInput) => pickRuntime(input, state);
            }
        /*
            async function pickRuntime(input: MultiStepInput, state: Partial<State>) {
                const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
                const runtimes = await getAvailableRuntimes(state.resourceGroup!, undefined );
                // TODO: Remember currently active item when navigating back.
                state.runtime = await input.showQuickPick({
                    title,
                    step: 5 + additionalSteps,
                    totalSteps: 5 + additionalSteps,
                    placeholder: 'Pick a runtime',
                    items: runtimes,
                    activeItem: state.runtime,
                    shouldResume: shouldResume
                });
            }*/
        function shouldResume() {
            // Could show a notification with the option to resume.
            return new Promise((resolve, reject) => {
            });
        }
        function validateNameIsUnique(name) {
            return __awaiter(this, void 0, void 0, function* () {
                // ...validate...
                yield new Promise(resolve => setTimeout(resolve, 1000));
                return name === 'vscode' ? 'Name not unique' : undefined;
            });
        }
        /*
            function writeToExternal(name: string) {
                // ...write...
                var fs = require('fs');
                fs.writeFile("temp.txt", name, (err: any) => {
                    if (err) { console.log(err); }
                    console.log("Successfully Written to File.");
                  });
                return;
            }*/
        /*
            async function getAvailableRuntimes(resourceGroup: QuickPickItem | string, token?: CancellationToken): Promise<QuickPickItem[]> {
                // ...retrieve...
                await new Promise(resolve => setTimeout(resolve, 1000));
                return ['Node 8.9', 'Node 6.11', 'Node 4.5']
                    .map(label => ({ label }));
            }
        */
        const state = yield collectInputs();
        //window.showInformationMessage(`Creating YAML File'${state.name}.yaml'`);
    });
}
exports.multiStepInput = multiStepInput;
// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------
class InputFlowAction {
    constructor() { }
}
InputFlowAction.back = new InputFlowAction();
InputFlowAction.cancel = new InputFlowAction();
InputFlowAction.resume = new InputFlowAction();
class MultiStepInput {
    constructor() {
        this.steps = [];
    }
    static run(start) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = new MultiStepInput();
            return input.stepThrough(start);
        });
    }
    stepThrough(start) {
        return __awaiter(this, void 0, void 0, function* () {
            let step = start;
            while (step) {
                this.steps.push(step);
                if (this.current) {
                    this.current.enabled = false;
                    this.current.busy = true;
                }
                try {
                    step = yield step(this);
                }
                catch (err) {
                    if (err === InputFlowAction.back) {
                        this.steps.pop();
                        step = this.steps.pop();
                    }
                    else if (err === InputFlowAction.resume) {
                        step = this.steps.pop();
                    }
                    else if (err === InputFlowAction.cancel) {
                        step = undefined;
                    }
                    else {
                        throw err;
                    }
                }
            }
            if (this.current) {
                this.current.dispose();
            }
        });
    }
    showQuickPick({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }) {
        return __awaiter(this, void 0, void 0, function* () {
            const disposables = [];
            try {
                return yield new Promise((resolve, reject) => {
                    const input = vscode_1.window.createQuickPick();
                    input.title = title;
                    input.step = step;
                    input.totalSteps = totalSteps;
                    input.placeholder = placeholder;
                    input.items = items;
                    if (activeItem) {
                        input.activeItems = [activeItem];
                    }
                    input.buttons = [
                        ...(this.steps.length > 1 ? [vscode_1.QuickInputButtons.Back] : []),
                        ...(buttons || [])
                    ];
                    disposables.push(input.onDidTriggerButton(item => {
                        if (item === vscode_1.QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        }
                        else {
                            resolve(item);
                        }
                    }), input.onDidChangeSelection(items => resolve(items[0])), input.onDidHide(() => {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            reject(shouldResume && (yield shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
                        }))()
                            .catch(reject);
                    }));
                    if (this.current) {
                        this.current.dispose();
                    }
                    this.current = input;
                    this.current.show();
                });
            }
            finally {
                disposables.forEach(d => d.dispose());
            }
        });
    }
    showInputBox({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }) {
        return __awaiter(this, void 0, void 0, function* () {
            const disposables = [];
            try {
                return yield new Promise((resolve, reject) => {
                    const input = vscode_1.window.createInputBox();
                    input.title = title;
                    input.step = step;
                    input.totalSteps = totalSteps;
                    input.value = value || '';
                    input.prompt = prompt;
                    input.buttons = [
                        ...(this.steps.length > 1 ? [vscode_1.QuickInputButtons.Back] : []),
                        ...(buttons || [])
                    ];
                    //let writing = write('');
                    let validating = validate('');
                    disposables.push(input.onDidTriggerButton(item => {
                        if (item === vscode_1.QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        }
                        else {
                            resolve(item);
                        }
                    }), input.onDidAccept(() => __awaiter(this, void 0, void 0, function* () {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        if (!(yield validate(value))) {
                            var fs = require('fs');
                            var os = require('os');
                            fs.appendFile("temp.txt", value + os.EOL, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log("Successfully Written to File.");
                            });
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    })), input.onDidChangeValue((text) => __awaiter(this, void 0, void 0, function* () {
                        const current = validate(text);
                        validating = current;
                        const validationMessage = yield current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    })), input.onDidHide(() => {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            reject(shouldResume && (yield shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
                        }))()
                            .catch(reject);
                    }));
                    if (this.current) {
                        this.current.dispose();
                    }
                    this.current = input;
                    this.current.show();
                });
            }
            finally {
                disposables.forEach(d => d.dispose());
            }
        });
    }
}
//# sourceMappingURL=multiStepInput.js.map