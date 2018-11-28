"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theia = require("@theia/plugin");
var lebab_transform_1 = require("./lebab-transform");
function start(context) {
    var transform = new lebab_transform_1.default();
    context.subscriptions.push(theia.workspace.onDidSaveTextDocument(function (e) {
        console.info(e);
        transform.onSave(e);
    }));
}
exports.start = start;
function stop() {
}
exports.stop = stop;
//# sourceMappingURL=lebab-plugin-backend.js.map