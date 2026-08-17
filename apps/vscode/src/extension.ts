import * as vscode from 'vscode';
import { MAIPulseSidebarProvider } from './sidebarProvider';
import { MAIPulseWebviewPanel } from './webviewPanel';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('mAI Pulse extension est désormais active !');

  const provider = new MAIPulseSidebarProvider(context.extensionUri, context);

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
  statusBarItem.command = 'maiPulse.openWebview';
  statusBarItem.text = '$(pulse) mAI Pulse';
  statusBarItem.tooltip = 'mAI Pulse (mDevsLabs/Pulse) - Cliquer pour ouvrir';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('maiPulse.openWebview', () => {
      MAIPulseWebviewPanel.createOrShow(context.extensionUri);
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
}

export function deactivate() {}
