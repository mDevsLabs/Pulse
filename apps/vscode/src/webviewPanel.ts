import * as vscode from 'vscode';
import {
  DESTINATION_KEY,
  Destination,
  DestinationId,
  getDestination,
  getSwitcherCss,
  getSwitcherMarkup,
  getSwitcherScript,
  parseDestination
} from './destinations';

export class MAIPulseWebviewPanel {
  public static currentPanel: MAIPulseWebviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _context: vscode.ExtensionContext;
  private readonly _onDestinationChange: (id: DestinationId) => void;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext,
    onDestinationChange: (id: DestinationId) => void
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MAIPulseWebviewPanel.currentPanel) {
      MAIPulseWebviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'maiPulseTab',
      'mAI Pulse',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );

    MAIPulseWebviewPanel.currentPanel = new MAIPulseWebviewPanel(
      panel,
      extensionUri,
      context,
      onDestinationChange
    );
  }

  public static applyDestination(dest: Destination) {
    MAIPulseWebviewPanel.currentPanel?._applyDestination(dest);
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext,
    onDestinationChange: (id: DestinationId) => void
  ) {
    this._panel = panel;
    this._context = context;
    this._onDestinationChange = onDestinationChange;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'openExternal':
            vscode.env.openExternal(vscode.Uri.parse(message.url));
            return;
          case 'setDestination':
            this._onDestinationChange(parseDestination(message.destination));
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    MAIPulseWebviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _applyDestination(dest: Destination) {
    this._panel.title = `mAI Pulse — ${dest.label}`;
    this._panel.webview.postMessage({
      type: 'setDestination',
      destination: dest.id,
      url: dest.url,
      label: dest.label
    });
  }

  private _update() {
    const destination = getDestination(parseDestination(this._context.globalState.get(DESTINATION_KEY)));
    this._panel.title = `mAI Pulse — ${destination.label}`;
    this._panel.webview.html = this._getHtmlForWebview(destination);
  }

  private _getHtmlForWebview(destination: Destination): string {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mAI Pulse</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: var(--vscode-editor-background, #090a0f);
            color: var(--vscode-editor-foreground, #cccccc);
            font-family: var(--vscode-font-family, system-ui, sans-serif);
        }
        .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }
        .top-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            background: var(--vscode-sideBar-background, #11131f);
            border-bottom: 1px solid var(--vscode-sideBar-border, rgba(255,255,255,0.1));
        }
${getSwitcherCss()}
        .loader {
            position: absolute;
            top: 36px;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--vscode-editor-background, #090a0f);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: opacity 0.3s ease;
        }
        .loader-text {
            font-size: 12px;
            color: var(--vscode-descriptionForeground, #888888);
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
            flex: 1;
        }
        .frame-wrap {
            position: relative;
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top-toolbar">
${getSwitcherMarkup(destination.id)}
        </div>
        <div class="frame-wrap">
            <div id="loader" class="loader">
                <div class="loader-text">Chargement de ${destination.label}...</div>
            </div>
            <iframe
                id="maiIframe"
                src="${destination.url}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                onload="hideLoader()"
            ></iframe>
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();

        function hideLoader() {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }
${getSwitcherScript()}
    </script>
</body>
</html>`;
  }
}
