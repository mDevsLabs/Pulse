import * as vscode from 'vscode';

export class MAIPulseSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'maiPulse.sidebarView';
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

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

        .mai-iframe {
            width: 100%;
            height: 100%;
            border: none;
            flex: 1;
        }

        .loader {
            position: absolute;
            top: 0;
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
            width: 32px;
            height: 32px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--vscode-progressBar-background, #00d2ff);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loader-text {
            font-size: 13px;
            color: var(--vscode-descriptionForeground, #888888);
        }

        .fallback-btn {
            margin-top: 8px;
            padding: 6px 14px;
            background-color: var(--vscode-button-background, #007acc);
            color: var(--vscode-button-foreground, #ffffff);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }

        .fallback-btn:hover {
            background-color: var(--vscode-button-hoverBackground, #0062a3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="loader" class="loader">
            <div class="spinner"></div>
            <div class="loader-text">Chargement de mAI Pulse...</div>
            <button class="fallback-btn" onclick="openExternal()">Ouvrir dans le navigateur</button>
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

        function openExternal() {
            vscode.postMessage({
                type: 'openExternal',
                url: '${embedUrl}'
            });
        }

        // Safety timeout to hide loader if iframe event doesn't trigger
        setTimeout(() => {
            hideLoader();
        }, 5000);
    </script>
</body>
</html>`;
  }
}
