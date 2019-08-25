import { ExtensionContext, Uri, window, workspace } from 'vscode';

export async function kuksaTreeGenerator(context: ExtensionContext) {
    window.showInformationMessage("Generating Project Tree");
    const projectName = await window.showInputBox({
        placeHolder: 'Enter Project Name'
    });
    //exports.projectName = projectName;
    var shell = require('shelljs');
    shell.mkdir('-p',projectName + '/' + 'docker');
    //shell.touch(projectName + '/' + 'docker'+'/'+'build.sh');
    shell.mkdir('-p',projectName + '/' + 'include');
    shell.mkdir('-p',projectName + '/' + 'src');
    shell.touch(projectName + '/' +'kuksa.yaml');
    shell.cp(context.asAbsolutePath("build.sh"),projectName + '/' + 'docker'+'/'+'build.sh');
    shell.sed('-i','kuksa',projectName,projectName + '/' + 'docker'+'/'+'build.sh');
}
