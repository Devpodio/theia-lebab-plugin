import * as theia from '@devpodio/plugin';
import * as fs from 'fs-extra';
const lebab = require('lebab');

export function start(context: theia.PluginContext) {
    const lebabFormatCommand = {
        id: 'lebab-format',
        label: 'Format Document via Lebab'
    };
    const lebabConfigCommand = {
        id: 'lebab-config',
        label: 'Creat or Open a .lebabrc.json configuration file on your workspace root directory'
    }
    theia.commands.registerCommand(lebabFormatCommand, (...args: any[]) => {
        theia.commands.executeCommand('editor.action.formatDocument');
    });
    theia.commands.registerCommand(lebabConfigCommand, (...args: any[]) => {
        const workspaces = theia.workspace.workspaceFolders;
        let ws;
        if (workspaces && workspaces[0]) {
            ws = workspaces[0].uri.path.toString();
        } else {
            console.log('Workspace not found, Lebab formatting disabled');
            theia.window.showErrorMessage('Workspace not found, Lebab formatting disabled');
        }
        const configPath = ws + '/.lebabrc.json';
        const uri = theia.Uri.parse('untitled:' + configPath);
        theia.workspace.openTextDocument(uri).then(doc => {
            if (doc) {
                theia.window.showTextDocument(doc);
            }
        });
    });
    const documentSelector = { language: 'javascript' };
    const documentFormattingProvider = {
        provideDocumentFormattingEdits: async (document: theia.TextDocument, options: theia.FormattingOptions) => {
            console.log('---> formatting the document');
            const result: theia.TextEdit[] = [];
            const content = document.getText();
            const workspaces = theia.workspace.workspaceFolders;
            try {
                let ws;
                if (workspaces && workspaces[0]) {
                    ws = workspaces[0].uri.path.toString();
                } else {
                    console.log('Workspace not found, Lebab formatting disabled');
                    return result;
                }
                const configPath = ws + '/.lebabrc.json';
                const uri = await fs.pathExists(configPath);
                if (!uri) {
                    return result;
                }
                const configRc = await fs.readJson(configPath) || {};
                if (!configRc.enabled) {
                    return result;
                }
                let transformed;
                try {
                    if (!configRc.transforms) {
                        return result;
                    }
                    transformed = lebab.transform(content, configRc.transforms);
                } catch (e) {
                    if (configRc.showErrors) {
                        theia.window.showErrorMessage(e.message);
                    }
                    return result;
                }
                const { code, warning } = transformed;
                if (warning && configRc.showWarnings) {
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

            } catch (e) {
                console.log('Lebab extension error occured', e.message);
                return result;
            }
        }
    };

    context.subscriptions.push(
        theia.languages.registerDocumentFormattingEditProvider(documentSelector, documentFormattingProvider)
    );
};

export function stop() {

}

