# Sampler Web Audio — Projet Final

## Description

Ce projet est un **sampler 4×4 avec affichage de waveform**, réalisé en JavaScript en utilisant la **Web Audio API**.  
Il permet de :

- Sélectionner des presets de sons depuis une API locale.
- Jouer des samples via des pads interactifs.
- Visualiser la **waveform** et ajuster des trims.
- Contrôler la lecture via le bouton **Play**.

L’interface et le code sont organisés pour être modulaires et faciles à maintenir.

---

## Prérequis

Avant d’exécuter le projet, assurez-vous de disposer de :

- **Windows 7** comme système d’exploitation.
- **Node.js** (version >= 12) pour exécuter le serveur et les scripts JavaScript.
- **Visual Studio Code** ou tout éditeur de code pour lancer et éditer le projet.
- **Live Server** (extension VS Code) pour servir l’interface HTML.

---

## Installation

1. **Cloner ou télécharger le projet**

   Placez le projet sur votre machine, par exemple :

D:\TP WEB\Web-Api-Using-with-js-for-sounds-in-website\


2. **Installer les dépendances Node.js**

Depuis le terminal, naviguer dans le dossier du serveur :

cd "D:\TP WEB\Web-Api-Using-with-js-for-sounds-in-website\Seance2\ExampleRESTEndpointCorrige"

npm i


3. **Lancer le serveur des API**
Lancer le serveur des API

Toujours dans le dossier du serveur :

npm start

Le serveur sera disponible sur : http://localhost:3000.

Lancer l’interface :

- Ouvrir le dossier example4 contenant index.html.
- Démarrer Live Server pour ouvrir l’interface dans le navigateur.
- Assurez-vous que le serveur des API est déjà en cours d’exécution.

Utilisation :

- Sélectionner un preset depuis le menu déroulant.
- Cliquer sur Charger tout pour charger tous les sons du preset.
- Cliquer sur un pad pour sélectionner un son.
- La waveform du son sélectionné s’affiche automatiquement dans le canvas.
- Cliquer sur Play pour écouter le son.
- Déplacer les trimbars pour ajuster la lecture du son si nécessaire.

4. **Sructure du projet**

example4/
├─ index.html                  # Interface principale du sampler
├─ css/
│  └─ styles.css               # Styles CSS
├─ js/
│  ├─ main.js                  # Script principal
│  ├─ SamplerEngine.js         # Gestion des sons et lecture
│  ├─ SamplerGUI.js            # Interface des pads
│  ├─ waveformdrawer.js        # Dessin des waveforms
│  ├─ trimbarsdrawer.js        # Gestion des trimbars
│  └─ soundutils.js            # Fonctions utilitaires pour le son


**Dépendances**

Node.js pour le serveur local.
Web Audio API (native dans les navigateurs modernes).
Live Server (VS Code) pour servir l’inter

