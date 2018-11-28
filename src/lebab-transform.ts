
import * as theia from '@theia/plugin';
import * as Beautify from 'js-beautify';
const lebab = require('lebab');

const beautify = Beautify.js;


class Transform {
    constructor() { }
    showMesage(msg: string) {
        theia.window.showInformationMessage(msg);
    }
    getConfig() {
        const config = theia.workspace.getConfiguration('lebab');

        return config;
    }
    onSave(e: any) {
        if (!theia.window.activeTextEditor) {
            return null;
        }
        const { document } = e;
        const docType = ['javascript'];
        const globalOpts = this.getConfig();
        const onSave = globalOpts.onSave;
        if (!onSave) {
            return;
        }
        if (docType.indexOf(document.languageId) < 0) {
            return;
        }
        const start = new theia.Position(0, 0);
        const end = new theia.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        const range = new theia.Range(start, end);
        const content = document.getText(range);
        let { code, warnings } = lebab.transform(content, globalOpts.transforms);
        if (warnings && globalOpts.showWarnings) {
            this.showMesage(warnings);
        }
        if (code) {
            if (globalOpts.beautify) {
                code = beautify(code, globalOpts.beautify_opts);
            }
            const edit = theia.TextEdit.replace(range, code);
            e.waitUntil(Promise.resolve([edit]));
        }
    }
}
export default Transform;