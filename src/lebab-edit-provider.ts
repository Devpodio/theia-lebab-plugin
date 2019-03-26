import {
  DocumentFormattingEditProvider,
  Range,
  TextDocument,
  TextEdit,
  workspace,
  Uri
} from '@theia/plugin';
import { LebabConfig } from './types.d';
import { safeExecution, addToOutput, LebabDocumentSelector } from './errorHandler';

import lebab = require('lebab');
import jsbeautify = require('js-beautify');

function getConfig(uri: Uri): LebabConfig {
  return workspace.getConfiguration('lebab', uri) as any;
}
function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  return new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

function format(text: string, { fileName, languageId, uri }: TextDocument): Promise<string> {
  const lebabConfig: LebabConfig = getConfig(uri);
  const beautifier = jsbeautify.js;
  if (!lebabConfig.format.enable || languageId !== LebabDocumentSelector.language) {
    return Promise.resolve(text);
  }
  return safeExecution(
    () => {
      const { code, warning } = lebab.transform(text, lebabConfig.options.transforms);
      if (lebabConfig.format.showWarnings && warning) {
        addToOutput(warning);
      }
      return beautifier(code, lebabConfig.options.beautify);
    }, text, fileName, lebabConfig.format.showErrors);
}

class LebabProvider implements DocumentFormattingEditProvider {
  constructor() { }
  provideDocumentFormattingEdits(
    document: TextDocument
  ): Promise<TextEdit[]> {
    return this._provideEdits(document);
  }
  private _provideEdits(document: TextDocument): Promise<TextEdit[]> {

    return format(document.getText(), document).then((code: string) => [
      TextEdit.replace(fullDocumentRange(document), code)
    ]);
  }
}
export default LebabProvider;