
# Structure de la Base de Données - Africa Power Platform

Ce dossier contient les scripts SQL nécessaires pour initialiser la base de données MySQL de l'application Africa Power Platform. L'architecture est conçue pour rendre **l'intégralité du contenu du site web dynamique et administrable**.

## Comment utiliser

Pour créer votre base de données, exécutez les fichiers `.sql` dans l'ordre numérique dans votre client MySQL ou via un outil comme phpMyAdmin.

```bash
# Exécutez toutes les commandes
mysql -u [votre_user] -p [nom_db] < 01_speakers.sql
mysql -u [votre_user] -p [nom_db] < 02_program_items.sql
mysql -u [votre_user] -p [nom_db] < 03_sponsors.sql
mysql -u [votre_user] -p [nom_db] < 04_registrations.sql
mysql -u [votre_user] -p [nom_db] < 05_newsletter_subscribers.sql
mysql -u [votre_user] -p [nom_db] < 06_faq.sql
mysql -u [votre_user] -p [nom_db] < 07_testimonials.sql
mysql -u [votre_user] -p [nom_db] < 08_team_members.sql
mysql -u [votre_user] -p [nom_db] < 09_site_settings.sql
mysql -u [votre_user] -p [nom_db] < 10_content_blocks.sql
mysql -u [votre_user] -p [nom_db] < 11_media_assets.sql
mysql -u [votre_user] -p [nom_db] < 12_users.sql
```

## Description des Tables

### Contenu Principal
- **`01_speakers`**: Gère les fiches des intervenants.
- **`02_program_items`**: Contient le détail de l'agenda de l'événement.
- **`03_sponsors`**: Gère la liste des partenaires et sponsors.
- **`06_faq`**: Gère la section "Foire Aux Questions".
- **`07_testimonials`**: Affiche des témoignages.
- **`08_team_members`**: Présente les membres de l'équipe d'organisation.

### Contenu & Configuration du Site
- **`09_site_settings`**: Table clé-valeur pour les configurations globales (liens réseaux sociaux, email, téléphone, paramètres SEO, etc.). C'est le panneau de configuration du site.
- **`10_content_blocks`**: Gère tous les blocs de texte du site (paragraphes, titres, descriptions). Chaque texte affiché sur le site peut être modifié depuis cette table.
- **`11_media_assets`**: Gère les ressources multimédias comme la vidéo de présentation ou les images de fond.

### Données Utilisateurs
- **`04_registrations`**: Enregistre les inscriptions des participants à l'événement.
- **`05_newsletter_subscribers`**: Stocke les e-mails des abonnés à la newsletter.

### Gestion des Accès
- **`12_users`**: Gère les comptes utilisateurs (administrateurs, gestionnaires) pour l'accès au panneau d'administration.
