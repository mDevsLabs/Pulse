# mAI Pulse - Plugin JetBrains IDEs

Ce plugin intègre l'application web **mAI Pulse** ([https://mai-officiel.vercel.app](https://mai-officiel.vercel.app)) directement dans une fenêtre d'outil (*Tool Window*) au sein des IDEs de la suite JetBrains (IntelliJ IDEA, WebStorm, PyCharm, GoLand, CLion, PHPStorm, Rider, etc.).

## 🚀 Fonctionnalités
- Intégration via le navigateur Chromium embarqué **JCEF** (*JetBrains Chromium Embedded Framework*)
- Fenêtre latérale "mAI Pulse" avec le nouveau logo puzzle multicolore
- **Gestion des Cookies & de la Session** : Conservation automatique de la session avec bouton de réinitialisation des cookies
- **Moniteur de Statut** : Lien direct vers [https://mai-officiel.instatus.com](https://mai-officiel.instatus.com)
- **Lien GitHub** : Accès au dépôt [https://github.com/mDevsLabs/Pulse](https://github.com/mDevsLabs/Pulse)
- Bouton de rafraîchissement rapide

## 🛠️ Construction du Plugin

### Prérequis
- Java JDK 11 ou supérieur

### Commandes de compilation

```bash
# Se placer dans le dossier jetbrains
cd apps/jetbrains

# Lancer l'IDE de test avec le plugin installé
./gradlew runIde

# Compiler et empaqueter le fichier du plugin (.zip)
./gradlew buildPlugin
```

Le fichier `.zip` généré se trouvera dans `build/distributions/mai-pulse-jetbrains-1.0.0.zip`.

## 📦 Installation dans l'IDE JetBrains
1. Ouvrez votre IDE JetBrains (ex: WebStorm, IntelliJ IDEA).
2. Rendez-vous dans **Settings / Preferences** > **Plugins**.
3. Cliquez sur l'icône de roue dentée ⚙️ > **Install Plugin from Disk...**.
4. Sélectionnez le fichier `.zip` généré.
