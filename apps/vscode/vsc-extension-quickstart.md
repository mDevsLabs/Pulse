# Bienvenue dans l'extension VS Code mAI Pulse

## Structure du projet

* `src/extension.ts` : Point d'entrée de l'extension.
* `src/sidebarProvider.ts` : Provider Webview pour la barre latérale VS Code.
* `src/webviewPanel.ts` : Provider Webview pour l'affichage plein écran dans un onglet éditeur.
* `media/` : Logos et icônes pour l'extension.

## Tester l'extension localement

1. Ouvrez ce dossier `apps/vscode` dans VS Code.
2. Appuyez sur `F5` pour lancer une nouvelle fenêtre VS Code (Extension Development Host).
3. Cliquez sur l'icône mAI Pulse dans la barre d'activité à gauche.

## Empaqueter l'extension (.vsix)

```bash
npm run build
npm run package
```
