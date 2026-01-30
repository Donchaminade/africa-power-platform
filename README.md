# Africa Power Platform

## Présentation du Projet

L'Africa Power Platform est une initiative structurante visant à créer un écosystème technologique dynamique en Afrique. Ce projet comprend un site web événementiel pour une conférence annuelle, un panneau d'administration robuste pour gérer le contenu et les inscriptions, ainsi qu'une application mobile compagnon. L'objectif est d'éduquer, connecter et impacter la communauté tech panafricaine autour de technologies comme Microsoft Power Platform.

## Fonctionnalités Clés

### Site Web Frontend
*   **Présentation de l'événement :** Sections dédiées à "À Propos", "Speakers", "Programme", "Sponsors", "FAQ", "Équipe", "Lieu", "Galerie", "Témoignages".
*   **Inscription :** Formulaire d'inscription pour les participants avec différents types de pass.
*   **Multilingue :** Support du Français et de l'Anglais.
*   **Statistiques dynamiques :** Affichage de compteurs pour les speakers, participants, jours, ateliers, configurables via l'administration.
*   **Animations et UI/UX soigné :** Utilisation de composants modernes et animations pour une expérience utilisateur engageante.
*   **Lecteur vidéo :** Intégration d'une vidéo de présentation de l'événement.
*   **Chatbot interactif :** Un assistant virtuel pour répondre aux questions des utilisateurs.

### Panneau d'Administration (Admin Panel)
*   **Gestion des paramètres du site :** Configuration de toutes les informations clés de l'événement (dates, lieu, numéros d'édition, URL de la vidéo, statistiques, etc.).
*   **Gestion du contenu :** CRUD complet pour les speakers, le programme, les sponsors, la FAQ, les témoignages, les membres de l'équipe, la galerie, les blocs de contenu et les actifs médias.
*   **Gestion des utilisateurs :** Comptes administrateurs et managers avec différents niveaux d'accès.
*   **Gestion des inscriptions et du check-in :** Suivi des participants, export CSV/PDF, et système de check-in.
*   **Gestion de la newsletter et des partenariats :** Suivi des abonnés et des demandes.
*   **Gestion des types de pass :** Création et configuration des différents pass d'accès.
*   **Tableau de bord :** Vue d'ensemble des statistiques clés de l'événement (inscriptions, speakers, etc.) avec des graphiques.

### Application Mobile (Flutter)
*   **Fonctionnalités à définir** (basé sur la structure, l'application mobile est en cours de développement, mais une structure de projet Flutter est en place).

## Technologies Utilisées

### Frontend (Web & Admin Panel)
*   **React :** Bibliothèque JavaScript pour la construction des interfaces utilisateur.
*   **Vite :** Outil de build rapide pour le développement frontend.
*   **TypeScript :** Pour un code plus robuste et maintenable.
*   **Axios :** Client HTTP pour les appels API.
*   **Tailwind CSS :** Framework CSS pour un stylisme rapide et réactif.
*   **Swiper.js :** Pour les carrousels (ex: logos des sponsors).
*   **React Chart.js 2 :** Pour les visualisations de données dans le tableau de bord.
*   **Font Awesome :** Bibliothèque d'icônes.

### Backend (API REST)
*   **Node.js :** Environnement d'exécution JavaScript côté serveur.
*   **Express.js :** Framework web pour Node.js pour construire l'API REST.
*   **MySQL :** Système de gestion de base de données relationnelle.
*   **Axios :** Utilisé côté serveur pour des requêtes HTTP (si nécessaire).
*   **Autres modules Node.js** (à compléter selon l'implémentation spécifique du backend, ex: `bcrypt` pour le hachage des mots de passe, `jsonwebtoken` pour l'authentification, `multer` pour les uploads de fichiers, etc.).

### Base de Données
*   **MySQL :** Le schéma et les données initiales sont définis par les scripts SQL dans le dossier `databases/`.

### Application Mobile
*   **Flutter :** Framework UI pour construire des applications mobiles natives à partir d'une seule base de code.
*   **Dart :** Langage de programmation utilisé par Flutter.

## Structure du Projet

```
africa-power-platform/
├── admin/                     # Panneau d'administration (React/Vite)
│   ├── components/            # Composants React spécifiques à l'admin
│   ├── index.html             # Point d'entrée de l'application de connexion admin
│   ├── dashboard.html         # Point d'entrée de l'application du tableau de bord admin
│   └── ...
├── components/                # Composants React réutilisables pour le frontend
├── contexts/                  # Contextes React (langue, thème, paramètres)
├── databases/                 # Scripts SQL pour la base de données
│   ├── 01_speakers.sql
│   ├── 09_site_settings.sql
│   └── ...
├── layouts/                   # Layouts React principaux
├── locales/                   # Fichiers de traduction
├── mobile_app/                # Code source de l'application mobile (Flutter)
│   ├── android/
│   ├── ios/
│   ├── lib/
│   └── ...
├── pages/                     # Pages React principales du site web
├── public/                    # Fichiers statiques (images, assets)
├── server/                    # Backend Node.js/Express
│   ├── routes/                # Définition des routes API
│   ├── db.js                  # Connexion à la base de données
│   ├── index.js               # Point d'entrée du serveur
│   └── ...
├── utils/                     # Utilitaires et configurations partagées
├── .gitignore
├── package.json               # Dépendances Node.js/Frontend
├── README.md                  # Ce fichier
├── tsconfig.json              # Configuration TypeScript
├── vite.config.ts             # Configuration Vite
└── ...
```

## Installation et Lancement

### Prérequis
*   Node.js (v18 ou supérieur recommandé)
*   npm (normalement installé avec Node.js)
*   MySQL Server (v8.0 ou supérieur recommandé)
*   Flutter SDK (pour l'application mobile)
*   Un éditeur de code (VS Code recommandé)

### 1. Configuration du Backend (API)

1.  **Naviguez** vers le dossier `server/` :
    ```bash
    cd server
    ```
2.  **Installez les dépendances** :
    ```bash
    npm install
    ```
3.  **Configurez la base de données MySQL** :
    *   Créez une base de données MySQL (ex: `africa_power_platform`).
    *   **Créez un fichier `.env`** dans le dossier `server/` (vous pouvez copier `server/.env.example`) et configurez vos identifiants de base de données :
        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_mysql_password
        DB_DATABASE=africa_power_platform
        API_PORT=4000
        # Ajoutez d'autres variables d'environnement si nécessaires (JWT_SECRET, etc.)
        ```
4.  **Initialisez le schéma de la base de données** :
    *   Depuis la racine du projet, exécutez les scripts SQL dans le dossier `databases/` dans l'ordre. Remplacez `[votre_user]` et `[votre_mdp]` par vos identifiants MySQL.
    ```bash
    mysql -u [votre_user] -p[votre_mdp] africa_power_platform < databases/01_speakers.sql
    mysql -u [votre_user] -p[votre_mdp] africa_power_platform < databases/02_program_items.sql
    # ... et ainsi de suite pour tous les fichiers .sql (03_sponsors.sql, 04_registrations.sql, etc.)
    # N'oubliez pas databases/09_site_settings.sql qui contient les paramètres globaux.
    ```
    *   Assurez-vous d'insérer les utilisateurs admin/manager (`databases/12_users.sql`) pour accéder au panneau d'administration.
5.  **Lancez le serveur backend** :
    ```bash
    npm start
    ```
    Le serveur devrait démarrer sur `http://localhost:4000` (ou le `API_PORT` configuré).

### 2. Lancement du Frontend (Site Web)

1.  **Naviguez** vers la racine du projet (si vous êtes dans `server/`, faites `cd ..`) :
    ```bash
    cd ..
    ```
2.  **Installez les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancez l'application frontend** :
    ```bash
    npm run dev
    ```
    L'application devrait être disponible sur `http://localhost:5173` (ou le port indiqué par Vite).

### 3. Lancement du Panneau d'Administration

Le panneau d'administration est inclus dans la même base de code frontend mais est servi via `admin/dashboard.html`.

1.  Assurez-vous que le **Frontend est lancé** (`npm run dev` depuis la racine du projet).
2.  Accédez à l'URL suivante dans votre navigateur : `http://localhost:5173/admin/index.html` pour la page de connexion, ou `http://localhost:5173/admin/dashboard.html` après connexion.

### 4. Lancement de l'Application Mobile (Flutter)

1.  **Naviguez** vers le dossier `mobile_app/` :
    ```bash
    cd mobile_app
    ```
2.  **Obtenez les dépendances Flutter** :
    ```bash
    flutter pub get
    ```
3.  **Lancez l'application** (sur un émulateur ou un appareil connecté) :
    ```bash
    flutter run
    ```

## Utilisation

### Site Web Public
*   Accédez à `http://localhost:5173`.
*   Explorez les différentes sections (Accueil, Speakers, Programme, etc.).
*   Utilisez le formulaire d'inscription et la messagerie instantanée.

### Panneau d'Administration
*   Accédez à `http://localhost:5173/admin/index.html`.
*   Connectez-vous avec les identifiants de test (par défaut dans `databases/12_users.sql` : `admin@app.com` / `password`, à remplacer par un hash sécurisé en production).
*   Utilisez le menu latéral pour naviguer entre les gestionnaires de contenu et de paramètres.
*   Modifiez les paramètres du site (dont les statistiques) via le gestionnaire de paramètres.

## Base de Données

Le schéma de la base de données est conçu pour rendre le contenu dynamique.
Les scripts SQL dans `databases/` définissent les tables pour :
*   `speakers` : Intervenants de l'événement.
*   `program_items` : Agenda détaillé.
*   `sponsors` : Partenaires.
*   `registrations` : Inscriptions des participants.
*   `newsletter_subscribers` : Abonnés.
*   `faq` : Questions fréquentes.
*   `testimonials` : Témoignages.
*   `team_members` : Membres de l'équipe.
*   **`site_settings` : Paramètres globaux du site (clé-valeur).**
*   `content_blocks` : Blocs de texte éditable.
*   `media_assets` : Ressources médias.
*   `users` : Utilisateurs de l'admin.
*   `gallery` : Images de la galerie.
*   `pass_types` : Types de pass d'inscription.
*   `partnership_requests` : Demandes de partenariat.
*   `contact_messages` : Messages du formulaire de contact.

## API Endpoints (Aperçu)

Le backend expose une API RESTful accessible via `http://localhost/africa-power-platform/api/`.
Quelques endpoints clés :
*   `/api/settings` : GET/PUT pour les paramètres globaux du site.
*   `/api/speakers` : CRUD pour les intervenants.
*   `/api/program` : CRUD pour le programme.
*   `/api/sponsors` : CRUD pour les sponsors.
*   `/api/registrations` : CRUD pour les inscriptions, avec gestion du check-in, export PDF/CSV.
*   `/api/auth/login` : Authentification des utilisateurs de l'administration.
*   `/api/chatbot` : Endpoint pour l'assistant virtuel.
*   ... (autres endpoints correspondant aux gestionnaires du panneau d'administration)

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez :
1.  Faire un fork du dépôt.
2.  Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-nouvelle-fonctionnalite`).
3.  Commiter vos changements (`git commit -m 'feat: ajoute ma nouvelle fonctionnalité'`).
4.  Pusher vers votre fork (`git push origin feature/ma-nouvelle-fonctionnalite`).
5.  Ouvrir une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.