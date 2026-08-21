import * as vscode from 'vscode';
import { MAIPulseSidebarProvider } from './sidebarProvider';
import { MAIPulseWebviewPanel } from './webviewPanel';
import {
  DESTINATION_KEY,
  DestinationId,
  getDestination,
  parseDestination,
  toggleDestinationId
} from './destinations';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('mAI Pulse extension est désormais active !');

  let provider: MAIPulseSidebarProvider;

  const applyDestination = (id: DestinationId) => {
    const current = parseDestination(context.globalState.get(DESTINATION_KEY));
    if (current === id) {
      return;
    }
    const dest = getDestination(id);
    void context.globalState.update(DESTINATION_KEY, id);
    provider.applyDestination(dest);
    MAIPulseWebviewPanel.applyDestination(dest);
    updateStatusBar(id);
  };

  provider = new MAIPulseSidebarProvider(context.extensionUri, context, applyDestination);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      MAIPulseSidebarProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  // Status Bar Item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'maiPulse.toggleDestination';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  updateStatusBar(parseDestination(context.globalState.get(DESTINATION_KEY)));

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.openWebview', () => {
      MAIPulseWebviewPanel.createOrShow(context.extensionUri, context, applyDestination);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.refresh', () => {
      provider.refresh();
      vscode.window.showInformationMessage('mAI Pulse a été rafraîchi.');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.clearSession', () => {
      context.globalState.update('mai_session_token', undefined);
      provider.refresh();
      vscode.window.showInformationMessage('Cookies et session mAI Pulse réinitialisés.');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.openGithub', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://github.com/mDevsLabs/Pulse'));
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.checkStatus', () => {
      vscode.env.openExternal(vscode.Uri.parse('https://mai-officiel.instatus.com'));
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.toggleDestination', () => {
      const current = parseDestination(context.globalState.get(DESTINATION_KEY));
      const next = toggleDestinationId(current);
      applyDestination(next);
      const dest = getDestination(next);
      vscode.window.showInformationMessage(`mAI Pulse : bascule vers ${dest.label}.`);
    })
  );
}

function updateStatusBar(id: DestinationId) {
  if (!statusBarItem) {
    return;
  }
  const dest = getDestination(id);
  statusBarItem.text = `$(pulse) ${dest.label}`;
  statusBarItem.tooltip = `mAI Pulse — ${dest.label} (${dest.url}). Cliquer pour basculer.`;
}

export function deactivate() {}
