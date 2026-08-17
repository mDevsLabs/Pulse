import * as vscode from 'vscode';

export class MAIPulseSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'maiPulse.sidebarView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(data => {
      switch (data.type) {
        case 'openExternal': {
          vscode.env.openExternal(vscode.Uri.parse(data.url));
          break;
        }
        case 'refresh': {
          this.refresh();
          break;
        }
        case 'saveSession': {
          this._context.globalState.update('mai_session_token', data.token);
          vscode.window.showInformationMessage('Session mAI Pulse sauvegardée.');
          break;
        }
        case 'clearSession': {
          this._context.globalState.update('mai_session_token', undefined);
          vscode.window.showInformationMessage('Session mAI Pulse réinitialisée.');
          this.refresh();
          break;
        }
      }
    });
  }

  public refresh() {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const embedUrl = "https://mai-officiel.vercel.app";
    const statusUrl = "https://mai-officiel.instatus.com";
    const githubUrl = "https://github.com/mDevsLabs/Pulse";
    const savedToken = this._context.globalState.get<string>('mai_session_token') || '';

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
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .top-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 8px;
            background: var(--vscode-sideBar-background, #11131f);
            border-bottom: 1px solid var(--vscode-sideBar-border, rgba(255,255,255,0.1));
            font-size: 11px;
        }

        .toolbar-group {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .tb-btn {
            background: transparent;
            border: 1px solid var(--vscode-button-border, rgba(255,255,255,0.15));
            color: var(--vscode-foreground, #cccccc);
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .tb-btn:hover {
            background: var(--vscode-button-hoverBackground, rgba(255,255,255,0.1));
        }

        .status-link {
            color: #10b981;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #10b981;
        }

        .mai-iframe {
            width: 100%;
            height: 100%;
            border: none;
            flex: 1;
        }

        .loader {
            position: absolute;
            top: 30px;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--vscode-editor-background, #090a0f);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            z-index: 10;
            transition: opacity 0.3s ease;
        }

        .spinner {
            width: 28px;
            height: 28px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--vscode-progressBar-background, #00d2ff);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loader-text {
            font-size: 12px;
            color: var(--vscode-descriptionForeground, #888888);
        }

        .fallback-btn {
            margin-top: 8px;
            padding: 4px 10px;
            background-color: var(--vscode-button-background, #007acc);
            color: var(--vscode-button-foreground, #ffffff);
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top-toolbar">
            <div class="toolbar-group">
                <a href="${statusUrl}" onclick="openExternal('${statusUrl}'); return false;" class="status-link" title="Statut du service">
                    <span class="status-dot"></span>
                    <span>En ligne</span>
                </a>
            </div>
            <div class="toolbar-group">
                <button class="tb-btn" onclick="openExternal('${githubUrl}')" title="Dépôt GitHub mDevsLabs/Pulse">GitHub</button>
                <button class="tb-btn" onclick="clearSession()" title="Réinitialiser la session">Cookies</button>
            </div>
        </div>

        <div id="loader" class="loader">
            <div class="spinner"></div>
            <div class="loader-text">Chargement de mAI Pulse...</div>
            <button class="fallback-btn" onclick="openExternal('${embedUrl}')">Ouvrir dans le navigateur</button>
        </div>

        <iframe 
            id="maiIframe"
            src="${embedUrl}" 
            class="mai-iframe" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
            onload="hideLoader()"
        ></iframe>
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

        function openExternal(url) {
            vscode.postMessage({
                type: 'openExternal',
                url: url
            });
        }

        function clearSession() {
            vscode.postMessage({
                type: 'clearSession'
            });
        }

        setTimeout(() => {
            hideLoader();
        }, 4000);
    </script>
</body>
</html>`;
  }
}
