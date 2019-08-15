import { window, ExtensionContext } from 'vscode';

export async function appGenerator(context: ExtensionContext) {
	//let i = 0;
	var extensionModule = require('./extension');
	const projectList = extensionModule.projectList;

	const result = await window.showQuickPick(projectList, {
		placeHolder: 'Choose Architecture',
		//onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
    });
    const execLocation = context.asAbsolutePath("build.sh");
	window.showInformationMessage(`Got: ${result}`);
}