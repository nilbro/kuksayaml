import { ExtensionContext, window, OpenDialogOptions } from "vscode";

export async function appPublisher(context: ExtensionContext) {
        window.showInformationMessage("Publishing App");
		const options: OpenDialogOptions = {
			canSelectMany: false,
			openLabel: 'Open',
			filters: {
			   'Text files': ['txt'],
			   'All files': ['*']
		   }
	   };
	   
	   window.showOpenDialog(options).then(fileUri => {
		   if (fileUri && fileUri[0]) {
			   console.log('Selected file: ' + fileUri[0].fsPath);
		   }
	   });
}