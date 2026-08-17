# 🌟 mAI Pulse - Monorepo

Bienvenue dans le dépôt mono-repo officiel de **mAI Pulse**. Ce projet regroupe les applications et extensions permettant d'intégrer l'interface [https://mai-officiel.vercel.app](https://mai-officiel.vercel.app) dans différents environnements (Web, VS Code, IDEs JetBrains).

---

## 🔗 Liens Officiels & Endpoints
* **Site Web / Embed** : [https://mai-officiel.vercel.app](https://mai-officiel.vercel.app)
* **Statut des Services** : [https://mai-officiel.instatus.com](https://mai-officiel.instatus.com)
* **API System** : [https://mai.val.run](https://mai.val.run)
* **Dépôt GitHub** : [https://github.com/mDevsLabs/Pulse](https://github.com/mDevsLabs/Pulse)

---

## 📁 Architecture du Mono-Repo

```
Pulse/
├── apps/
│   ├── web/        # Application Web React + Vite (Logo WWW Boussole Globe)
│   ├── vscode/     # Extension Visual Studio Code (.vsix) (Logo Play / 'm' Néon)
│   └── jetbrains/  # Plugin JetBrains IDEs (Logo Pièce de Puzzle Multicolore)
├── package.json    # Configuration racine (Workspaces npm / pnpm)
├── pnpm-workspace.yaml
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📦 Projets & Extensions

### 1. 🌐 Web (`apps/web`)
* **Logo** : `web.jpg` (Boussole Globe WWW multicolore)
* **Fonctionnalités** :
  * Intégration iframe réactive et fluide.
  * **Cookies & Auth Manager** : Fenêtre modale permettant de configurer/sauvegarder le jeton de session `mAI_session` et les cookies personnalisés.
  * **Statut en temps réel** : Test de latence dynamique vers `https://mai.val.run` et badge de statut lié à `https://mai-officiel.instatus.com`.
  * Commandes de rafraîchissement, mode plein écran, et lien GitHub `mDevsLabs/Pulse`.

### 2. 🧩 VS Code Extension (`apps/vscode`)
* **Logo** : `vscode.png` (Logo 'm' / Play néon)
* **Fonctionnalités** :
  * **Activity Bar** : Vue latérale intégrée avec icône dédiée.
  * **Main Editor Panel** : Commande `mAI Pulse: Ouvrir dans un onglet principal` pour utiliser l'interface en grand écran.
  * **Status Bar Item** : Indicateur dans la barre d'état de VS Code.
  * **Gestion de Session** : Rétention d'état du webview et commande `mAI Pulse: Effacer les cookies & la session`.
  * **Package VSIX** : `mai-pulse-1.0.0.vsix` prêt pour déploiement.

### 3. ⚡ JetBrains Plugin (`apps/jetbrains`)
* **Logo** : `jetbrains.png` (Pièce de puzzle dégradé néon)
* **Fonctionnalités** :
  * Fenêtre d'outil latérale (*Tool Window*) réductible.
  * Rendu Chromium via **JCEF** (*JetBrains Chromium Embedded Framework*).
  * **Gestionnaire de Cookies** : Effacement et réinitialisation de session via `CefCookieManager`.
  * Boutons de contrôle dans la barre d'outils pour le statut, GitHub, cookies et rafraîchissement.

---

## 🚀 Prise en main rapide & Build

### Prérequis
* **Node.js** >= 18
* **npm** >= 9 (ou pnpm / yarn)
* **Java JDK** >= 11 (pour le plugin JetBrains)

### Installation des dépendances

```bash
npm install
```

### Commandes de compilation

| Commande | Description |
| :--- | :--- |
| `npm run build` | Compile l'application Web et l'extension VS Code |
| `npm run build:web` | Compile l'application Web (`apps/web`) |
| `npm run build:vscode` | Compile et empaquète l'extension VS Code (`apps/vscode/mai-pulse-1.0.0.vsix`) |
| `npm run build:jetbrains` | Génère le fichier `.zip` du plugin JetBrains (`apps/jetbrains`) |
| `npm run dev:web` | Lance le serveur de développement web local |

---

## 📜 Licence
Ce projet est distribué sous la licence [MIT](LICENSE).
