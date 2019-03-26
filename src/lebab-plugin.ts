
import {
  languages,
  PluginContext,
  workspace,
  DocumentSelector,
  Disposable,
} from '@theia/plugin';
import LebabProvider from './lebab-edit-provider';
import { setupErrorHandler, registerDisposables, LebabDocumentSelector } from './errorHandler';

let formatterHandler: undefined | Disposable;

function disposeHandlers() {
  if (formatterHandler) {
    formatterHandler.dispose();
  }
  formatterHandler = undefined;
}

function selectors(): DocumentSelector | undefined {
  const languageSelector = LebabDocumentSelector;
  if (workspace.workspaceFolders === undefined) {
    return undefined;
  }
  return languageSelector
}

export function start(context: PluginContext) {
  const editProvider = new LebabProvider();
  function registerFormatter() {
    disposeHandlers();
    const languageSelector = selectors();
    if (!languageSelector) {
      return;
    }

    formatterHandler = languages.registerDocumentFormattingEditProvider(
      languageSelector,
      editProvider
    );
  }
  registerFormatter();
  context.subscriptions.push(
    workspace.onDidChangeWorkspaceFolders(registerFormatter),
    {
      dispose: disposeHandlers,
    },
    setupErrorHandler(),
    ...registerDisposables()
  );
}
export function stop() {

}