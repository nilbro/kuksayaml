import { window, ExtensionContext } from 'vscode';

export async function appGenerator(context: ExtensionContext) {
	//let i = 0;
	const result = await window.showQuickPick(['amd64', 'arm32v6'], {
		placeHolder: 'Choose Architecture',
		//onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
    });
    const execLocation = context.asAbsolutePath("build.sh");
	window.showInformationMessage(`Got: ${result}`);
}