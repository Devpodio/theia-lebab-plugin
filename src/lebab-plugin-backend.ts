import * as theia from '@devpodio/plugin';
import lebab = require('lebab');

export function start(context: theia.PluginContext) {
    const lebabFormatCommand = {
        id: 'lebab-format',
        label: 'Format Document via Lebab'
    };
    const documentSelector: theia.DocumentSelector = { scheme: 'file', language: 'typescript' };
    const documentFormattingProvider = { provideDocumentFormattingEdits: provideFormatting };
    context.subscriptions.push(
        theia.languages.registerDocumentFormattingEditProvider(documentSelector, documentFormattingProvider)
    );
    context.subscriptions.push(
        theia.commands.registerCommand(lebabFormatCommand, () => {
            theia.commands.executeCommand('editor.action.formatDocument');
        })
    )
}
async function provideFormatting(document: theia.TextDocument) {
    const preferences = theia.workspace.getConfiguration('lebab');
    const result: theia.TextEdit[] = [];
    const content = document.getText();
    const workspaceFolders = theia.workspace.workspaceFolders;
    if (!preferences.get('enabled')) {
        return result;
    }
    const transforms = preferences.get('transforms');
    if (workspaceFolders && workspaceFolders[0]) {
        const { code, warning } = lebab.transform(content, transforms);
        if (warning && preferences.get('showWarnings')) {
            theia.window.showWarningMessage(JSON.stringify(warning, null, 2));
        }
        if (!code) {
            return result;
        }
        const positionStart = new theia.Position(0, 0);
        const positionEnd = new theia.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        const range = new theia.Range(positionStart, positionEnd);
        result.push(new theia.TextEdit(range, code));
        return result;
    }
}
export function stop() {

}
