-- =========================================================================================
-- Script d'initialisation complet pour la base de données Africa Power Platform
-- Base de données cible : MySQL
-- Encodage : utf8mb4
-- =========================================================================================

-- Préambule pour assurer la compatibilité et le bon encodage
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- =========================================================================================
-- Table 1: speakers
-- Description: Stocke les informations sur les intervenants (speakers).
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `speakers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `title_fr` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `category_fr` VARCHAR(100) NOT NULL,
  `category_en` VARCHAR(100) NOT NULL,
  `image_url` VARCHAR(2048) NOT NULL,
  `twitter_url` VARCHAR(2048) NULL,
  `linkedin_url` VARCHAR(2048) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active_display_order` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `speakers`
INSERT INTO `speakers` (`name`, `title_fr`, `title_en`, `category_fr`, `category_en`, `image_url`) VALUES
('Adama Traoré', 'MVP, Expert Power BI', 'MVP, Power BI Expert', 'Data & Analytics', 'Data & Analytics', 'https://picsum.photos/400/500?random=10'),
('Fatou Diop', 'CEO, SahelInnov', 'CEO, SahelInnov', 'Entrepreneuriat', 'Entrepreneurship', 'https://picsum.photos/400/500?random=11'),
('David Okoro', 'Consultant Dynamics 365', 'Dynamics 365 Consultant', 'Business Apps', 'Business Apps', 'https://picsum.photos/400/500?random=12'),
('Aisha Bello', 'Fondatrice, Tech4Her', 'Founder, Tech4Her', 'Impact Social', 'Social Impact', 'https://picsum.photos/400/500?random=13');

-- =========================================================================================
-- Table 2: program_items
-- Description: Stocke les éléments du programme de l'événement.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `program_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `day` INT NOT NULL COMMENT 'Jour de l''événement (ex: 1 ou 2)',
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `title_fr` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `description_fr` TEXT,
  `description_en` TEXT,
  `icon_class` VARCHAR(100) COMMENT 'Classe Font Awesome (ex: fas fa-bullhorn)',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_day_start_time` (`day`, `start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `program_items`
INSERT INTO `program_items` (`day`, `start_time`, `end_time`, `title_fr`, `title_en`, `description_fr`, `description_en`, `icon_class`) VALUES
(1, '11:00:00', '12:00:00', 'Keynote d''Ouverture', 'Opening Keynote', 'Vision et opportunités de la Power Platform en Afrique.', 'Vision and opportunities for the Power Platform in Africa.', 'fas fa-bullhorn'),
(1, '12:00:00', '13:30:00', 'Panel: Transformation Digitale', 'Panel: Digital Transformation', 'Cas d''usages concrets dans les services publics et l''agriculture.', 'Concrete use cases in public services and agriculture.', 'fas fa-users'),
(1, '13:30:00', '14:30:00', 'Pause Déjeuner & Networking', 'Lunch Break & Networking', 'Échanges avec les speakers et participants.', 'Discussions with speakers and attendees.', 'fas fa-coffee'),
(1, '14:30:00', '17:00:00', 'Sessions Techniques', 'Technical Sessions', 'Ateliers sur Power Apps, Power BI, et Copilot Studio.', 'Workshops on Power Apps, Power BI, and Copilot Studio.', 'fas fa-code'),
(2, '10:00:00', '13:00:00', 'Bootcamp: Idéation & Design', 'Bootcamp: Ideation & Design', 'Concevoir une solution low-code pour un défi local.', 'Designing a low-code solution for a local challenge.', 'fas fa-lightbulb'),
(2, '13:00:00', '14:00:00', 'Pause & Mentorat', 'Break & Mentoring', 'Déjeuner et sessions de coaching avec des experts.', 'Lunch and coaching sessions with experts.', 'fas fa-handshake'),
(2, '14:00:00', '16:30:00', 'Bootcamp: Développement', 'Bootcamp: Development', 'Co-création et prototypage des solutions.', 'Co-creation and prototyping of solutions.', 'fas fa-cogs'),
(2, '16:30:00', '17:00:00', 'Présentation & Clôture', 'Presentation & Closing', 'Démonstration des projets et remise des prix.', 'Project demonstrations and awards ceremony.', 'fas fa-trophy');

-- =========================================================================================
-- Table 3: sponsors
-- Description: Stocke les informations sur les sponsors/partenaires.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `sponsors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(2048) NOT NULL COMMENT 'URL du logo en format SVG ou PNG transparent de préférence',
  `website_url` VARCHAR(2048) NULL,
  `tier` ENUM('platinum', 'gold', 'silver', 'community') NOT NULL DEFAULT 'community',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active_tier_order` (`is_active`, `tier`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `sponsors`
INSERT INTO `sponsors` (`name`, `logo_url`, `website_url`, `tier`, `display_order`) VALUES
('Microsoft', 'https://logo.clearbit.com/microsoft.com', 'https://microsoft.com', 'platinum', 1),
('MTN', 'https://logo.clearbit.com/mtn.com', 'https://mtn.com', 'gold', 2),
('Orange', 'https://logo.clearbit.com/orange.com', 'https://orange.com', 'gold', 3),
('Cofina', 'https://logo.clearbit.com/groupcofina.com', 'https://groupcofina.com', 'silver', 4),
('Moov Africa', 'https://logo.clearbit.com/moov.africa', 'https://moov.africa', 'silver', 5),
('ISOCEL', 'https://logo.clearbit.com/isoceltelecom.com', 'https://isoceltelecom.com', 'community', 6);

-- =========================================================================================
-- Table 4: registrations
-- Description: Stocke les inscriptions des participants.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `company` VARCHAR(255) NULL,
  `job_title` VARCHAR(255) NULL,
  `country` VARCHAR(100) NOT NULL,
  `pass_type` ENUM('conference', 'full', 'bootcamp_applicant') NOT NULL,
  `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `has_attended` BOOLEAN NOT NULL DEFAULT FALSE,
  `confirmation_token` VARCHAR(255) NULL,
  `is_confirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX `idx_email` (`email`),
  INDEX `idx_pass_type` (`pass_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================================
-- Table 5: newsletter_subscribers
-- Description: Stocke les abonnés à la newsletter.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `unsubscribe_token` VARCHAR(255) NULL,
  INDEX `idx_email_active` (`email`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================================
-- Table 6: faq
-- Description: Stocke les questions fréquemment posées (FAQ).
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `faq` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question_fr` TEXT NOT NULL,
  `question_en` TEXT NOT NULL,
  `answer_fr` TEXT NOT NULL,
  `answer_en` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Général',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active_category_order` (`is_active`, `category`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `faq`
INSERT INTO `faq` (`question_fr`, `question_en`, `answer_fr`, `answer_en`, `category`, `display_order`) VALUES
('L''événement est-il vraiment gratuit ?', 'Is the event really free?', 'Oui, l''accès à la conférence et la candidature au bootcamp sont entièrement gratuits. L''inscription est cependant obligatoire pour réserver votre place.', 'Yes, access to the conference and application to the bootcamp are completely free. However, registration is mandatory to reserve your spot.', 'Inscription', 1),
('Qui peut participer au bootcamp ?', 'Who can participate in the bootcamp?', 'Le bootcamp est ouvert aux développeurs, designers, chefs de projet et étudiants passionnés par la technologie et désireux de résoudre des défis concrets. Les places sont limitées et la sélection se fait sur candidature.', 'The bootcamp is open to developers, designers, project managers, and students passionate about technology and eager to solve real-world challenges. Seats are limited and selection is by application.', 'Bootcamp', 2),
('Y aura-t-il des opportunités de networking ?', 'Will there be networking opportunities?', 'Absolument. Des pauses café, le déjeuner et des sessions dédiées sont prévues pour favoriser les échanges entre les participants, les speakers et les partenaires.', 'Absolutely. Coffee breaks, lunch, and dedicated sessions are planned to encourage networking among attendees, speakers, and partners.', 'Général', 3);

-- =========================================================================================
-- Table 7: testimonials
-- Description: Stocke les témoignages.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(255) NOT NULL,
  `author_title_fr` VARCHAR(255) NOT NULL,
  `author_title_en` VARCHAR(255) NOT NULL,
  `author_image_url` VARCHAR(2048) NULL,
  `quote_fr` TEXT NOT NULL,
  `quote_en` TEXT NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active_order` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `testimonials`
INSERT INTO `testimonials` (`author_name`, `author_title_fr`, `author_title_en`, `author_image_url`, `quote_fr`, `quote_en`) VALUES
('Jean-Luc Kouassi', 'Co-fondateur, APP', 'Co-founder, APP', 'https://picsum.photos/100/100?random=1', 'Notre vision est de créer un pont entre les talents africains et les opportunités offertes par la Power Platform. Cet événement est le catalyseur de cette ambition.', 'Our vision is to create a bridge between African talent and the opportunities offered by the Power Platform. This event is the catalyst for that ambition.'),
('Mariam Keita', 'Directrice Partenariats', 'Partnerships Director', 'https://picsum.photos/100/100?random=2', 'Nous sommes fiers de réunir un écosystème aussi vibrant. C''est une chance unique pour les entreprises de découvrir des innovations et de rencontrer les leaders de demain.', 'We are proud to bring together such a vibrant ecosystem. It is a unique chance for companies to discover innovations and meet the leaders of tomorrow.');

-- =========================================================================================
-- Table 8: team_members
-- Description: Stocke les membres de l'équipe d'organisation.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role_fr` VARCHAR(255) NOT NULL,
  `role_en` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(2048) NOT NULL,
  `linkedin_url` VARCHAR(2048) NULL,
  `twitter_url` VARCHAR(2048) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active_order` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `team_members`
INSERT INTO `team_members` (`name`, `role_fr`, `role_en`, `image_url`) VALUES
('Samuel Adebayo', 'Coordinateur Général', 'General Coordinator', 'https://picsum.photos/400/400?random=20'),
('Ngozi Okonjo', 'Responsable Programme', 'Program Lead', 'https://picsum.photos/400/400?random=21'),
('Kwame Appiah', 'Responsable Partenariats', 'Partnerships Lead', 'https://picsum.photos/400/400?random=22');

-- =========================================================================================
-- Table 9: site_settings
-- Description: Stocke les configurations globales du site (clé-valeur).
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé unique pour la configuration (ex: social_linkedin_url)',
  `setting_value` TEXT,
  `setting_group` VARCHAR(50) DEFAULT 'general' COMMENT 'Groupe pour organiser les paramètres (ex: social, contact)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `site_settings`
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('contact_email', 'contact@africapowerplatform.org', 'contact'),
('contact_phone', '+229 68 38 01 12', 'contact'),
('contact_address', 'Cotonou, Bénin', 'contact'),
('social_linkedin_url', '#', 'social'),
('social_facebook_url', '#', 'social'),
('social_twitter_url', '#', 'social'),
('event_location_google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.111833544525!2d2.404550615349471!3d6.379200995386005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10249df1b9e54865%3A0x6b3589b389f1d24a!2sPalais%20des%20Congr%C3%A8s%20de%20Cotonou!5e0!3m2!1sfr!2sfr!4v1672522600000', 'event'),
('seo_meta_title_fr', 'Africa Power Platform 2026', 'seo'),
('seo_meta_title_en', 'Africa Power Platform 2026', 'seo'),
('seo_meta_description_fr', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l''Ouest. Un événement pour éduquer, connecter et impacter l''écosystème tech panafricain.', 'seo'),
('seo_meta_description_en', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'seo'),
('seo_meta_keywords_fr', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Bénin, Sommet Tech, Innovation', 'seo'),
('seo_meta_keywords_en', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Benin, Tech Summit, Innovation', 'seo');

-- =========================================================================================
-- Table 10: content_blocks
-- Description: Stocke les blocs de contenu textuel du site.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `content_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `block_key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé unique pour le bloc de contenu (ex: hero_description)',
  `content_fr` TEXT,
  `content_en` TEXT,
  `page_section` VARCHAR(50) COMMENT 'Section de la page où le contenu apparaît (ex: hero, about)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `content_blocks`
INSERT INTO `content_blocks` (`block_key`, `content_fr`, `content_en`, `page_section`) VALUES
('hero_date', '20-21 Juin 2026 • Cotonou, Bénin', 'June 20-21, 2026 • Cotonou, Benin', 'hero'),
('hero_title', 'Africa Power Platform', 'Africa Power Platform', 'hero'),
('hero_subtitle', 'Tech • Innovation • Leadership', 'Tech • Innovation • Leadership', 'hero'),
('hero_description', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l''Ouest. Un événement pour éduquer, connecter et impacter l''écosystème tech panafricain.', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'hero'),
('about_p1', 'Africa Power Platform est une initiative structurante, pensée comme un rendez-vous annuel itinérant porté par les communautés Microsoft Power Platform locales à travers l''Afrique.', 'Africa Power Platform is a structuring initiative, designed as a traveling annual meeting supported by local Microsoft Power Platform communities across Africa.', 'about'),
('about_p2', 'Notre mission est de renforcer les communautés, favoriser le partage de compétences et faire émerger des solutions technologiques adaptées aux enjeux africains, en combinant une <strong>conférence d''envergure</strong> et un <strong>bootcamp pratique</strong>.', 'Our mission is to strengthen communities, promote skill sharing, and foster the emergence of technological solutions adapted to African challenges, combining a <strong>large-scale conference</strong> and a <strong>practical bootcamp</strong>.', 'about'),
('location_description', 'L''événement se tiendra au prestigieux Palais des Congrès de Cotonou, un lieu central et moderne, parfait pour accueillir les innovateurs de toute l''Afrique.', 'The event will be held at the prestigious Cotonou Convention Center, a central and modern venue perfect for welcoming innovators from all over Africa.', 'location'),
('sponsors_description', 'Les leaders de l''industrie et les organisations visionnaires qui rendent cet événement possible.', 'The industry leaders and visionary organizations that make this event possible.', 'sponsors'),
('contact_description', 'Inscrivez-vous à notre newsletter pour recevoir les actualités et ne rien manquer de l''événement.', 'Sign up for our newsletter to receive updates and not miss anything about the event.', 'contact'),
('footer_tagline', 'Éduquer, connecter et impacter l''écosystème technologique panafricain.', 'Educate, connect, and impact the Pan-African technology ecosystem.', 'footer');

-- =========================================================================================
-- Table 11: media_assets
-- Description: Gère les ressources multimédias (images, vidéos).
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `asset_key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé unique pour la ressource (ex: about_video)',
  `asset_url` VARCHAR(2048) NOT NULL,
  `alt_text_fr` VARCHAR(255),
  `alt_text_en` VARCHAR(255),
  `media_type` ENUM('video', 'image') NOT NULL DEFAULT 'image',
  `page_section` VARCHAR(50) COMMENT 'Section où la ressource est utilisée',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `media_assets`
INSERT INTO `media_assets` (`asset_key`, `asset_url`, `alt_text_fr`, `alt_text_en`, `media_type`, `page_section`) VALUES
('about_video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Vidéo de présentation de l''événement', 'Event presentation video', 'video', 'about'),
('hero_background_image', 'https://picsum.photos/1600/900?grayscale&blur=2', 'Arrière-plan de la section hero', 'Hero section background', 'image', 'hero'),
('og_image', 'https://picsum.photos/seed/app2026/1200/630', 'Image pour le partage sur les réseaux sociaux', 'Image for social media sharing', 'image', 'seo');

-- =========================================================================================
-- Table 12: users
-- Description: Gère les utilisateurs de l'interface d'administration.
-- =========================================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager') NOT NULL DEFAULT 'manager',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email_active` (`email`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple pour la table `users`
-- NOTE: Remplacez '...' par de vrais hashs de mot de passe en production.
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
('Admin User', 'admin@app.com', '$2y$10$your_password_hash_here', 'admin'),
('Manager User', 'manager@app.com', '$2y$10$your_password_hash_here', 'manager');

-- =========================================================================================
SET foreign_key_checks = 1;
-- Fin du script
-- =========================================================================================
-- databases/13_gallery.sql
-- Table pour stocker les images de la galerie des événements passés

CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(2048) NOT NULL,
  `image_date` DATE NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_gallery_is_active_order` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de quelques images d'exemple
INSERT INTO `gallery` (`title`, `description`, `image_url`, `image_date`) VALUES
('Keynote d''ouverture', 'Session plénière avec les leaders de la tech.', 'https://picsum.photos/seed/event1/800/600', '2023-06-20'),
('Atelier Power Apps', 'Les participants créent leur première application.', 'https://picsum.photos/seed/event2/800/600', '2023-06-20'),
('Session de Networking', 'Échanges et discussions entre les participants.', 'https://picsum.photos/seed/event3/800/600', '2023-06-21'),
('Remise des prix du Bootcamp', 'L''équipe gagnante reçoit son prix.', 'https://picsum.photos/seed/event4/800/600', '2023-06-21');

