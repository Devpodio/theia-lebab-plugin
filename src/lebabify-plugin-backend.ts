import * as theia from '@theia/plugin';
import lebab = require('lebab');
import jsbeautify = require('js-beautify');

export function start(context: theia.PluginContext) {
    const LebabDocumentSelector = ['javascript', 'html', 'css'];
    LebabDocumentSelector.forEach(selector => registerFormattingProviders(context, selector));

}
export function stop() {

}
function registerFormattingProviders(context: theia.PluginContext, selector: theia.DocumentSelector): void {

    context.subscriptions.push(
        // register a document formatting provider
        theia.languages.registerDocumentFormattingEditProvider(selector, {
            provideDocumentFormattingEdits: (document: theia.TextDocument) => {
                return formatDocument(document);
            }
        })
    );

    context.subscriptions.push(
        // register a document range formatting provider
        theia.languages.registerDocumentRangeFormattingEditProvider(selector, {
            provideDocumentRangeFormattingEdits: (document: theia.TextDocument, range: theia.Range) => {
                return formatDocument(document, range);
            }
        })
    );
}
function formatDocument(document: theia.TextDocument, range?: theia.Range) {
    // if range is not provided then let's create it for the whole document
    try {
        if (!range) {
            const positionStart = new theia.Position(0, 0);
            const positionEnd = new theia.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            range = new theia.Range(positionStart, positionEnd);
        }
        const config = theia.workspace.getConfiguration('lebabify');
        if (!config.get('enable')) return [];
        let content = document.getText(range);

        const workspaceFolders = theia.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders[0] && content) {
            const beautifyOpts = config.get('beautify');
            const beautifyFn = getBeautifyFunction(document.languageId);
            if (document.languageId == 'javascript') {
                const { code, warning } = lebab.transform(content, config.get('transforms'));
                if (warning && config.get('showWarnings')) {
                    theia.window.showWarningMessage(JSON.stringify(warning, null, 2));
                }
                content = code;
            }
            // format the text using js-beautify
            const contentFormatted = beautifyFn(content, beautifyOpts);
            if (!contentFormatted) {
                return [];
            }
            if (content === contentFormatted) {
                return [];
            }
            return [new theia.TextEdit(range, contentFormatted)];
        }
        return [];
    } catch (e) {
        theia.window.showErrorMessage(e.message || e.stack);
        return [];
    }
}
function getBeautifyFunction(languageId: string): Function {
    languageId = languageId == 'javascript' ? 'js' : languageId;
    return jsbeautify[languageId];
}
