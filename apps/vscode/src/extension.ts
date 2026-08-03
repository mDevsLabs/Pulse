import * as vscode from 'vscode';
import { MAIPulseSidebarProvider } from './sidebarProvider';
import { MAIPulseWebviewPanel } from './webviewPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('mAI Pulse extension est désormais active !');

  const provider = new MAIPulseSidebarProvider(context.extensionUri);

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
}

export function deactivate() {}
