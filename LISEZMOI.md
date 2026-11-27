# Agenda partagé — guide d'installation

Une app d'agenda autonome (look Google Agenda) que tu héberges toi-même, gratuitement.

- Un seul agenda, partagé avec les personnes que **tu** invites par courriel.
- Chacun se connecte avec Google, ou avec n'importe quelle adresse courriel et un mot de passe, et ajoute ses événements dans sa couleur.
- **Personne ne peut modifier ou effacer les événements des autres, pas même toi.** C'est la base de données qui l'interdit, pas seulement l'écran.
- S'installe comme une vraie app sur iPhone, Android et ordinateur, **sans App Store et sans compte développeur payant**.

Les données sont dans **ta** base Firebase (service gratuit de Google). Rien ne dépend de Claude ni d'un autre service.

---

## Ce qu'il te faut

- Un compte Google.
- Un endroit gratuit pour mettre l'app en ligne : ce guide utilise **GitHub Pages**. Firebase Hosting est expliqué à la fin.

Durée : environ 20 minutes.

---

## Étape 1 : créer le projet Firebase

1. Va sur **https://console.firebase.google.com** et clique sur **Créer un projet** (ou « Ajouter un projet »).
2. Donne-lui un nom, par exemple `agenda-famille`. Tu peux désactiver Google Analytics : l'app n'en a pas besoin.
3. Dans la page du projet, clique sur l'icône **Web `</>`** pour ajouter une application Web. Donne-lui un surnom (ex. « Agenda »). Pas besoin de cocher Firebase Hosting.
4. Firebase affiche un bloc qui commence par `const firebaseConfig = {`. **Garde cette page ouverte** : tu vas copier ces valeurs à l'étape 4.

## Étape 2 : activer les deux méthodes de connexion

1. Dans le menu de gauche : **Authentication** (Authentification), puis **Commencer**.
2. Onglet **Méthode de connexion** (Sign-in method), puis **Google**. Active-le, choisis ton courriel d'assistance, puis **Enregistrer**.
3. Toujours dans **Méthode de connexion** : **Ajouter un fournisseur**, puis **Adresse e-mail/Mot de passe**. Active la première option (pas besoin du « lien par e-mail »), puis **Enregistrer**.

> Pourquoi deux méthodes? Sur iPhone, la connexion Google bloque souvent dans l'app installée sur l'écran d'accueil. La connexion par courriel et mot de passe fonctionne partout. Elle permet aussi d'inviter des gens qui n'ont pas de compte Google (Outlook, Hotmail, Vidéotron…).

## Étape 3 : créer la base de données et coller les règles

1. Dans le menu de gauche : **Firestore Database**, puis **Créer une base de données**.
2. Si on te demande une édition, choisis **Standard**.
3. Emplacement : **northamerica-northeast1 (Montréal)**, ou le plus proche de chez vous.
4. Choisis le **mode production**, puis **Créer**.
5. Va dans l'onglet **Règles**. Efface tout, puis colle le contenu du fichier **`firestore.rules`**.
6. Dans ce que tu viens de coller, remplace `ton.courriel@gmail.com` par **ton adresse Google, en minuscules**.
7. Clique sur **Publier**.

## Étape 4 : remplir `config.js`

Ouvre `config.js` avec un éditeur de texte (Bloc-notes, TextEdit, VS Code…) :

- `ownerEmail` : ta même adresse Google (celle des règles).
- `appName` : le nom affiché, par exemple `"Agenda de la famille"`.
- `firebaseConfig` : remplace les valeurs d'exemple par celles de l'étape 1 (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

> Ces valeurs Firebase ne sont pas secrètes : elles servent seulement à trouver ta base. La sécurité vient des règles de l'étape 3.

## Étape 5 : mettre l'app en ligne avec GitHub Pages

1. Sur **https://github.com**, clique sur **New repository**. Nom : `agenda`. Visibilité : **Public** (obligatoire pour GitHub Pages avec un compte gratuit). Clique sur **Create repository**.
2. Clique sur **uploading an existing file**. Glisse **tous les fichiers du dossier**, y compris le dossier `icons`, puis clique sur **Commit changes**.
3. Va dans **Settings → Pages**. Sous Source, choisis **Deploy from a branch**, puis la branche **main**, dossier **/ (root)**, et clique sur **Save**.
4. Après 1 à 2 minutes, ton adresse apparaît, par exemple `https://tonnom.github.io/agenda/`.
5. **Important :** retourne dans Firebase, puis **Authentication → Paramètres (Settings) → Domaines autorisés → Ajouter un domaine**, et ajoute `tonnom.github.io`, sans `https://` ni `/agenda`.

## Étape 6 : utiliser l'agenda

1. Ouvre ton adresse et connecte-toi avec ton compte Google (celui de `ownerEmail`).
2. Clique sur ton avatar en haut à droite, puis **Membres et invitations**.
3. Ajoute l'adresse courriel de chaque personne. Le bouton ✉ prépare un courriel d'invitation avec le lien.
4. La personne ouvre le lien et se connecte avec **cette même adresse** : avec Google, ou en choisissant **Créer un compte**. Avec un mot de passe, elle reçoit d'abord un courriel de confirmation à cliquer.

**Installer comme une app** (gratuit, aucun App Store) :
- **iPhone / iPad** : dans **Safari**, touche **Partager**, puis **Sur l'écran d'accueil**. Dans l'app installée, connecte-toi avec ton **courriel et ton mot de passe**. Si tu utilisais Google, choisis « Mot de passe oublié? » une première fois pour te créer un mot de passe.
- **Android** : dans Chrome, ouvre le menu **⋮**, puis **Installer l'application** (ou **Ajouter à l'écran d'accueil**).
- **Ordinateur** : dans Chrome ou Edge, clique sur l'icône d'installation dans la barre d'adresse.

---

## Qui peut faire quoi

| | Toi (gestionnaire) | Membre invité | Autre personne |
|---|---|---|---|
| Voir l'agenda | ✔ | ✔ | ✘ |
| Ajouter ses événements | ✔ | ✔ | ✘ |
| Modifier / effacer **ses** événements | ✔ | ✔ | ✘ |
| Modifier / effacer les événements **des autres** | ✘ | ✘ | ✘ |
| Ajouter / retirer des membres, renommer l'agenda | ✔ | ✘ | ✘ |

Retirer un membre lui enlève l'accès, mais ses événements restent dans l'agenda.

## Coûts

Le plan gratuit **Spark** de Firebase n'exige aucune carte de crédit. Il inclut chaque jour 50 000 lectures et 20 000 écritures dans la base, et 1 Go de stockage. C'est largement assez pour une famille ou une équipe. Si une limite est atteinte, l'app l'indique et tout revient le lendemain.

## Ce que l'app ne fait pas (pour rester gratuite et simple)

- Pas d'avis envoyés automatiquement par courriel (il faudrait le plan payant de Firebase).
- Pas de synchronisation automatique avec Google Agenda ou Outlook. Chaque événement a quand même des boutons **Copier dans Google Agenda** et **Copier dans Outlook**.

## Mettre à jour l'app plus tard

Après avoir modifié des fichiers, ouvre `sw.js` et change `agenda-v1` en `agenda-v2` (puis v3, etc.). Sinon, les téléphones qui ont installé l'app pourraient garder l'ancienne version un moment.

## Problèmes fréquents

- **« Ce site n'est pas autorisé dans Firebase »** : ajoute ton domaine (étape 5, point 5).
- **Toi, tu vois « La base de données refuse l'accès »** : ton courriel n'est pas identique dans `config.js` et dans les règles, ou les règles ne sont pas publiées.
- **Quelqu'un voit « Accès en attente »** : son adresse n'est pas exactement celle que tu as ajoutée. Vérifie les fautes et les adresses multiples.
- **« Ton courriel n'est pas encore confirmé »** : il faut cliquer sur le lien du courriel de confirmation (regarde dans les courriels indésirables), puis appuyer sur « J'ai confirmé mon courriel ».
- **« Cette méthode de connexion n'est pas activée »** : refais l'étape 2, point 3.
- **Connexion Google qui ne revient pas à l'app sur iPhone** : c'est une limite d'iOS pour les apps installées depuis Safari. Utilise la connexion par courriel.
- **Rien ne se passe en cliquant sur « Se connecter »** : autorise les fenêtres pop-up pour ce site.
- **La page reste sur « Configuration à terminer »** : `config.js` contient encore les valeurs d'exemple.

## Option : héberger avec Firebase Hosting au lieu de GitHub

Si tu as Node.js : `npm install -g firebase-tools`, puis, dans ce dossier, `firebase login`, `firebase use --add` (choisis ton projet), puis `firebase deploy`. Le fichier `firebase.json` est déjà prêt, et cette commande publie aussi les règles. Ton adresse sera `https://ton-projet.web.app` et le domaine est autorisé automatiquement.

---

### Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html`, `styles.css`, `app.js` | L'app (écran, vues, formulaires) |
| `backend.js` | Connexion (Google ou courriel) et base de données Firebase |
| `config.js` | **À remplir** : ton courriel et la configuration Firebase |
| `firestore.rules` | **À coller dans Firebase** : les règles de sécurité |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation comme app et ouverture sans réseau |
| `firebase.json` | Seulement pour l'option Firebase Hosting |
