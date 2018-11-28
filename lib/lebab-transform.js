"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theia = require("@theia/plugin");
var Beautify = require("js-beautify");
var lebab = require('lebab');
var beautify = Beautify.js;
var Transform = /** @class */ (function () {
    function Transform() {
    }
    Transform.prototype.showMesage = function (msg) {
        theia.window.showInformationMessage(msg);
    };
    Transform.prototype.getConfig = function () {
        var config = theia.workspace.getConfiguration('lebab');
        return config;
    };
    Transform.prototype.onSave = function (e) {
        if (!theia.window.activeTextEditor) {
            return null;
        }
        var document = e.document;
        var docType = ['javascript'];
        var globalOpts = this.getConfig();
        var onSave = globalOpts.onSave;
        if (!onSave) {
            return;
        }
        if (docType.indexOf(document.languageId) < 0) {
            return;
        }
        var start = new theia.Position(0, 0);
        var end = new theia.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        var range = new theia.Range(start, end);
        var content = document.getText(range);
        var _a = lebab.transform(content, globalOpts.transforms), code = _a.code, warnings = _a.warnings;
        if (warnings && globalOpts.showWarnings) {
            this.showMesage(warnings);
        }
        if (code) {
            if (globalOpts.beautify) {
                code = beautify(code, globalOpts.beautify_opts);
            }
            var edit = theia.TextEdit.replace(range, code);
            e.waitUntil(Promise.resolve([edit]));
        }
    };
    return Transform;
}());
exports.default = Transform;
//# sourceMappingURL=lebab-transform.js.map