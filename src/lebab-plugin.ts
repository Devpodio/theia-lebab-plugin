
import {
  languages,
  PluginContext,
  workspace,
  DocumentFilter,
  DocumentSelector,
  Disposable,
} from '@theia/plugin';
import LebabProvider from './lebab-edit-provider';
import { setupErrorHandler, registerDisposables, LebabDocumentSelector } from './errorHandler';

interface Selectors {
  languageSelector: DocumentSelector;
}
let formatterHandler: undefined | Disposable;


function disposeHandlers() {
  if (formatterHandler) {
    formatterHandler.dispose();
  }
  formatterHandler = undefined;
}

function selectors(): Selectors {
  const languageSelector = [LebabDocumentSelector];
  if (workspace.workspaceFolders === undefined) {
    return {
      languageSelector: languageSelector
    };
  }
  const fileLanguageSelector: DocumentFilter[] = languageSelector;
  return { languageSelector: fileLanguageSelector }
}

export function start(context: PluginContext) {
  const editProvider = new LebabProvider();
  function registerFormatter() {
    disposeHandlers();
    const { languageSelector } = selectors();
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