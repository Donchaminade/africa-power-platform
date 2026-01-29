-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 28 jan. 2026 à 07:27
-- Version du serveur : 11.8.3-MariaDB-log
-- Version de PHP : 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `u878418868_power_plate`
--

-- --------------------------------------------------------

--
-- Structure de la table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `submitted_at`) VALUES
(1, 'ADJOLOU Dondah Chaminade', 'chaminadeadjolou@gmail.com', 'mon sujet', 'mon message', '2026-01-26 11:16:17');

-- --------------------------------------------------------

--
-- Structure de la table `content_blocks`
--

CREATE TABLE `content_blocks` (
  `id` int(11) NOT NULL,
  `block_key` varchar(100) NOT NULL COMMENT 'Clé unique pour le bloc de contenu (ex: hero_description)',
  `display_name` varchar(255) DEFAULT NULL COMMENT 'Nom affichable pour le bloc de contenu (ex: Description du héros)',
  `content_fr` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `page_section` varchar(50) DEFAULT NULL COMMENT 'Section de la page où le contenu apparaît (ex: hero, about)',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `content_blocks`
--

INSERT INTO `content_blocks` (`id`, `block_key`, `display_name`, `content_fr`, `content_en`, `page_section`, `updated_at`) VALUES
(1, 'hero_date', 'Date de l\'événement (Héros)', '20-21 Juin 2026 • Cotonou, Bénin', 'June 20-21, 2026 • Cotonou, Benin', 'hero', '2026-01-26 10:47:22'),
(2, 'hero_title', 'Titre principal (Héros)', 'Africa Power Platform', 'Africa Power Platform', 'hero', '2026-01-26 10:47:22'),
(3, 'hero_subtitle', 'Sous-titre (Héros)', 'Tech • Innovation • Leadership', 'Tech • Innovation • Leadership', 'hero', '2026-01-26 10:47:22'),
(4, 'hero_description', 'Description du héros', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l\'Ouest. Un événement pour éduquer, connecter et impacter l\'écosystème tech panafricain.', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'hero', '2026-01-26 10:47:22'),
(5, 'about_p1', 'Paragraphe 1 (À Propos)', 'Africa Power Platform est une initiative structurante, pensée comme un rendez-vous annuel itinérant porté par les communautés Microsoft Power Platform locales à travers l\'Afrique.', 'Africa Power Platform is a structuring initiative, designed as a traveling annual meeting supported by local Microsoft Power Platform communities across Africa.', 'about', '2026-01-26 10:47:22'),
(6, 'about_p2', 'Paragraphe 2 (À Propos)', 'Notre mission est de renforcer les communautés, favoriser le partage de compétences et faire émerger des solutions technologiques adaptées aux enjeux africains, en combinant une <strong>conférence d\'envergure</strong> et un <strong>bootcamp pratique</strong>.', 'Our mission is to strengthen communities, promote skill sharing, and foster the emergence of technological solutions adapted to African challenges, combining a <strong>large-scale conference</strong> and a <strong>practical bootcamp</strong>.', 'about', '2026-01-26 10:47:22'),
(7, 'location_description', 'Description du lieu', 'L\'événement se tiendra au prestigieux Palais des Congrès de Cotonou, un lieu central et moderne, parfait pour accueillir les innovateurs de toute l\'Afrique.', 'L\'événement se tiendra au prestigieux Palais des Congrès de Cotonou, un lieu central et moderne, parfait pour accueillir les innovateurs de toute l\'Afrique.', 'location', '2026-01-26 10:47:22'),
(8, 'sponsors_description', 'Description des sponsors', 'Les leaders de l\'industrie et les organisations visionnaires qui rendent cet événement possible.', 'The industry leaders and visionary organizations that make this event possible.', 'sponsors', '2026-01-26 10:47:22'),
(9, 'contact_description', 'Description du formulaire de contact', 'Inscrivez-vous à notre newsletter pour recevoir les actualités et ne rien manquer de l\'événement.', 'Sign up for our newsletter to receive updates and not miss anything about the event.', 'contact', '2026-01-26 10:47:22'),
(10, 'footer_tagline', 'Slogan du pied de page', 'Éduquer, connecter et impacter l\'écosystème technologique panafricain.', 'Educate, connect, and impact the Pan-African technology ecosystem.', 'footer', '2026-01-26 10:47:22');

-- --------------------------------------------------------

--
-- Structure de la table `faq`
--

CREATE TABLE `faq` (
  `id` int(11) NOT NULL,
  `question_fr` text NOT NULL,
  `question_en` text NOT NULL,
  `answer_fr` text NOT NULL,
  `answer_en` text NOT NULL,
  `category` varchar(100) DEFAULT 'Général',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `faq`
--

INSERT INTO `faq` (`id`, `question_fr`, `question_en`, `answer_fr`, `answer_en`, `category`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'L\'événement est-il vraiment gratuit ?', 'Is the event really free?', 'Oui, l\'accès à la conférence et la candidature au bootcamp sont entièrement gratuits. L\'inscription est cependant obligatoire pour réserver votre place.', 'Yes, access to the conference and application to the bootcamp are completely free. However, registration is mandatory to reserve your spot.', 'Inscription', 1, 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(2, 'Qui peut participer au bootcamp ?', 'Who can participate in the bootcamp?', 'Le bootcamp est ouvert aux développeurs, designers, chefs de projet et étudiants passionnés par la technologie et désireux de résoudre des défis concrets. Les places sont limitées et la sélection se fait sur candidature.', 'The bootcamp is open to developers, designers, project managers, and students passionate about technology and eager to solve real-world challenges. Seats are limited and selection is by application.', 'Bootcamp', 1, 2, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(3, 'Y aura-t-il des opportunités de networking ?', 'Will there be networking opportunities?', 'Absolument. Des pauses café, le déjeuner et des sessions dédiées sont prévues pour favoriser les échanges entre les participants, les speakers et les partenaires.', 'Absolutely. Coffee breaks, lunch, and dedicated sessions are planned to encourage networking among attendees, speakers, and partners.', 'Général', 1, 3, '2026-01-25 02:07:35', '2026-01-25 02:07:35');

-- --------------------------------------------------------

--
-- Structure de la table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(2048) NOT NULL,
  `image_date` date DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `description`, `image_url`, `image_date`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Keynote d\'ouverture', 'Session plénière avec les leaders de la tech.', 'https://picsum.photos/seed/event1/800/600', '2023-06-20', 0, 1, '2026-01-25 04:05:28', '2026-01-25 04:05:28'),
(2, 'Atelier Power Apps', 'Les participants créent leur première application.', 'https://picsum.photos/seed/event2/800/600', '2023-06-20', 0, 1, '2026-01-25 04:05:28', '2026-01-25 04:05:28'),
(3, 'Session de Networking', 'Échanges et discussions entre les participants.', 'https://picsum.photos/seed/event3/800/600', '2023-06-21', 0, 1, '2026-01-25 04:05:28', '2026-01-25 04:05:28'),
(4, 'Remise des prix du Bootcamp', 'L\'équipe gagnante reçoit son prix.', 'https://picsum.photos/seed/event4/800/600', '2023-06-21', 0, 1, '2026-01-25 04:05:28', '2026-01-25 04:05:28'),
(5, 'test', 'Erreur lors de la récupération des demandes de partenariat : Error: Unknown column \'created_at\' in \'order clause\'\n    at PromisePool.query (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\mysql2\\lib\\promise\\pool.js:36:22)\n    at C:\\xampp\\htdocs\\africa-power-platform\\server\\routes\\partnership.js:8:39\n    at Layer.handleRequest (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\lib\\route.js:157:13)\n    at Route.dispatch (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\lib\\route.js:117:3)\n    at handle (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\index.js:435:11)\n    at Layer.handleRequest (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\lib\\layer.js:152:17)\n    at C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\index.js:295:15  \n    at processParams (C:\\xampp\\htdocs\\africa-power-platform\\server\\node_modules\\router\\index.js:582:12)', '/uploads/image-1769421931463-39090519.jpeg', '2026-01-06', 1, 1, '2026-01-26 10:05:40', '2026-01-26 10:06:44');

-- --------------------------------------------------------

--
-- Structure de la table `media_assets`
--

CREATE TABLE `media_assets` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL COMMENT 'Nom original du fichier',
  `file_url` varchar(2048) NOT NULL COMMENT 'URL accessible de la ressource',
  `title_fr` varchar(255) DEFAULT NULL COMMENT 'Titre de la ressource en français',
  `title_en` varchar(255) DEFAULT NULL COMMENT 'Titre de la ressource en anglais',
  `alt_text_fr` varchar(255) DEFAULT NULL COMMENT 'Texte alternatif en français',
  `alt_text_en` varchar(255) DEFAULT NULL COMMENT 'Texte alternatif en anglais',
  `description_fr` text DEFAULT NULL COMMENT 'Description en français',
  `description_en` text DEFAULT NULL COMMENT 'Description en anglais',
  `type` enum('image','video','document') NOT NULL DEFAULT 'image' COMMENT 'Type de média',
  `mime_type` varchar(100) DEFAULT NULL COMMENT 'Type MIME du fichier',
  `file_size` int(11) DEFAULT NULL COMMENT 'Taille du fichier en octets',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Indique si l''actif est actif',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Date et heure de l''upload'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `media_assets`
--

INSERT INTO `media_assets` (`id`, `file_name`, `file_url`, `title_fr`, `title_en`, `alt_text_fr`, `alt_text_en`, `description_fr`, `description_en`, `type`, `mime_type`, `file_size`, `is_active`, `uploaded_at`) VALUES
(1, 'media_file-1769434357035.mp4', '/uploads/media_file-1769434357035.mp4', 'test', 'test', 'testt', 'testt', 'Erreur: axios is not defined', 'Erreur: axios is not defined', 'video', 'video/mp4', 4315175, 0, '2026-01-26 13:32:37');

-- --------------------------------------------------------

--
-- Structure de la table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `unsubscribe_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `partnership_requests`
--

CREATE TABLE `partnership_requests` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','contacted','closed') DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `partnership_requests`
--

INSERT INTO `partnership_requests` (`id`, `company_name`, `contact_name`, `email`, `phone`, `message`, `status`, `submitted_at`) VALUES
(1, 'Hyver', 'chaminade', 'chaminadeadjolou@gmail.com', '+22871209082', 'cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation\n(anonymous) @ (index):64\n(anonymous) @ (index):64Understand this warning\ndashboard.tsx:5  GET http://localhost:3000/admin/components/Dashboard.tsx?t=1769419488770 net::ERR_ABORTED 500 (Internal Server Error)Understand this error', 'pending', '2026-01-26 09:33:34');

-- --------------------------------------------------------

--
-- Structure de la table `pass_types`
--

CREATE TABLE `pass_types` (
  `id` int(11) NOT NULL,
  `name_fr` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `description_fr` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `price_fr` varchar(50) NOT NULL,
  `price_en` varchar(50) NOT NULL,
  `features_fr` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_fr`)),
  `features_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_en`)),
  `tag_fr` varchar(100) DEFAULT NULL,
  `tag_en` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pass_types`
--

INSERT INTO `pass_types` (`id`, `name_fr`, `name_en`, `description_fr`, `description_en`, `price_fr`, `price_en`, `features_fr`, `features_en`, `tag_fr`, `tag_en`, `is_active`, `display_order`) VALUES
(1, 'Pass Conférence', 'Conference Pass', 'Accès au Jour 1', 'Access to Day 1', '4000 FCFA', '4000 XOF', '[\"Accès aux keynotes & panels\",\"Sessions de networking\",\"Pause café\"]', '[\"Access to keynotes & panels\",\"Networking sessions\",\"Coffee break\"]', NULL, NULL, 1, 1),
(2, 'Pass Complet', 'Full Pass', 'Conférence + Bootcamp', 'Conference + Bootcamp', 'Gratuit', 'Free', '[\"Tous les avantages Conférence\", \"Participation au bootcamp (Jour 2)\", \"Déjeuner et mentorat\"]', '[\"All Conference benefits\", \"Bootcamp participation (Day 2)\", \"Lunch and mentoring\"]', 'RECOMMANDÉ', 'RECOMMENDED', 1, 2),
(3, 'Pass Bootcamp', 'Bootcamp Pass', 'Accès au Jour 2 (sur sélection)', 'Access to Day 2 (by selection)', 'Gratuit', 'Free', '[\"Ateliers de co-création\", \"Prototypage de solutions\", \"Accès aux mentors\"]', '[\"Co-creation workshops\", \"Solution prototyping\", \"Access to mentors\"]', NULL, NULL, 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `program_items`
--

CREATE TABLE `program_items` (
  `id` int(11) NOT NULL,
  `day` int(11) NOT NULL COMMENT 'Jour de l''événement (ex: 1 ou 2)',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `title_fr` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `description_fr` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon_class` varchar(100) DEFAULT NULL COMMENT 'Classe Font Awesome (ex: fas fa-bullhorn)',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `program_items`
--

INSERT INTO `program_items` (`id`, `day`, `start_time`, `end_time`, `title_fr`, `title_en`, `description_fr`, `description_en`, `icon_class`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, '11:00:00', '12:00:00', 'Keynote d\'Ouverture', 'Opening Keynote', 'Vision et opportunités de la Power Platform en Afrique.', 'Vision and opportunities for the Power Platform in Africa.', 'fas fa-bullhorn', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(2, 1, '12:00:00', '13:30:00', 'Panel: Transformation Digitale', 'Panel: Digital Transformation', 'Cas d\'usages concrets dans les services publics et l\'agriculture.', 'Concrete use cases in public services and agriculture.', 'fas fa-users', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(3, 1, '13:30:00', '14:30:00', 'Pause Déjeuner & Networking', 'Lunch Break & Networking', 'Échanges avec les speakers et participants.', 'Discussions with speakers and attendees.', 'fas fa-coffee', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(4, 1, '14:30:00', '17:00:00', 'Sessions Techniques', 'Technical Sessions', 'Ateliers sur Power Apps, Power BI, et Copilot Studio.', 'Workshops on Power Apps, Power BI, and Copilot Studio.', 'fas fa-code', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(5, 2, '10:00:00', '13:00:00', 'Bootcamp: Idéation & Design', 'Bootcamp: Ideation & Design', 'Concevoir une solution low-code pour un défi local.', 'Designing a low-code solution for a local challenge.', 'fas fa-lightbulb', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(6, 2, '13:00:00', '14:00:00', 'Pause & Mentorat', 'Break & Mentoring', 'Déjeuner et sessions de coaching avec des experts.', 'Lunch and coaching sessions with experts.', 'fas fa-handshake', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(7, 2, '14:00:00', '16:30:00', 'Bootcamp: Développement', 'Bootcamp: Development', 'Co-création et prototypage des solutions.', 'Co-creation and prototyping of solutions.', 'fas fa-cogs', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(8, 2, '16:30:00', '17:00:00', 'Présentation & Clôture', 'Presentation & Closing', 'Démonstration des projets et remise des prix.', 'Project demonstrations and awards ceremony.', 'fas fa-trophy', 1, '2026-01-25 02:07:35', '2026-01-25 02:07:35');

-- --------------------------------------------------------

--
-- Structure de la table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `pass_type` enum('conference','full','bootcamp_applicant') NOT NULL DEFAULT 'conference',
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `has_attended` tinyint(1) NOT NULL DEFAULT 0,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `is_confirmed` tinyint(1) NOT NULL DEFAULT 0,
  `is_checked_in` tinyint(1) DEFAULT 0,
  `check_in_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `registrations`
--

INSERT INTO `registrations` (`id`, `first_name`, `last_name`, `email`, `company`, `job_title`, `country`, `pass_type`, `registration_date`, `has_attended`, `confirmation_token`, `is_confirmed`, `is_checked_in`, `check_in_time`) VALUES
(5, 'stan', 'etchri', 'stan@gmail.com', 'none', 'etudiant', 'togo', 'full', '2026-01-26 21:33:56', 0, NULL, 0, 0, NULL),
(6, 'esso', 'Chaminade', 'aaaa@gmail.com', 'none', 'dev', 'Togo', '', '2026-01-26 21:43:13', 0, NULL, 0, 0, NULL),
(7, 'ADJOLOU etoh', 'Chaminade esse', 'admin@app.com', 'none', NULL, 'Togo', '', '2026-01-26 21:46:37', 0, NULL, 0, 0, NULL),
(8, 'ADJOLOU', 'Chaminade', 'chaminadeadjolou@gmail.com', NULL, NULL, 'Togo', '', '2026-01-26 21:54:52', 0, NULL, 0, 0, NULL),
(10, 'ADJOLOU', 'Chaminade', 'stanis@gmail.com', 'none', NULL, 'Togo', '', '2026-01-26 21:59:44', 0, NULL, 0, 0, NULL),
(11, 'oga', 'lejeune', 'oga@gmail.com', 'rtrd', 'tret', 'tg', '', '2026-01-26 22:02:17', 0, NULL, 0, 0, NULL),
(12, 'jean', 'Marie', 'jean@gmail.com', NULL, NULL, 'Togo', '', '2026-01-26 22:31:27', 0, NULL, 0, 0, NULL),
(13, 'edmond', 'koffi', 'chaf@gmail.com', '', '', 'Togo', '', '2026-01-26 22:44:56', 0, NULL, 0, 0, NULL),
(15, 'Edorh', 'kokou', 'kokou@gmail.com', 'TGO', 'Comm', 'Togo', 'conference', '2026-01-27 10:53:15', 0, NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL COMMENT 'Clé unique pour la configuration (ex: social_linkedin_url)',
  `setting_value` text DEFAULT NULL,
  `setting_group` varchar(50) DEFAULT 'general' COMMENT 'Groupe pour organiser les paramètres (ex: social, contact)',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_group`, `updated_at`) VALUES
(1, 'contact_email', 'contact@africapowerplatform.org', 'contact', '2026-01-26 16:20:48'),
(2, 'contact_phone', '+229 68 38 01 12', 'contact', '2026-01-26 16:20:48'),
(3, 'contact_address', 'Cotonou, Bénin', 'contact', '2026-01-26 16:20:48'),
(4, 'social_linkedin_url', '#', 'social', '2026-01-26 16:20:48'),
(5, 'social_facebook_url', '#', 'social', '2026-01-26 16:20:48'),
(6, 'social_twitter_url', '#', 'social', '2026-01-26 16:20:48'),
(7, 'event_location_google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.111833544525!2d2.404550615349471!3d6.379200995386005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10249df1b9e54865%3A0x6b3589b389f1d24a!2sPalais%20des%20Congr%C3%A8s%20de%20Cotonou!5e0!3m2!1sfr!2sfr!4v1672522600000', 'event', '2026-01-26 16:20:48'),
(8, 'seo_meta_title_fr', 'Africa Power Platform 2026', 'seo', '2026-01-26 16:20:48'),
(9, 'seo_meta_title_en', 'Africa Power Platform 2026', 'seo', '2026-01-26 16:20:48'),
(10, 'seo_meta_description_fr', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l\'Ouest. Un événement pour éduquer, connecter et impacter l\'écosystème tech panafricain.', 'seo', '2026-01-26 16:20:48'),
(11, 'seo_meta_description_en', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'seo', '2026-01-26 16:20:48'),
(12, 'seo_meta_keywords_fr', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Bénin, Sommet Tech, Innovation', 'seo', '2026-01-26 16:20:48'),
(13, 'seo_meta_keywords_en', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Benin, Tech Summit, Innovation', 'seo', '2026-01-26 16:20:48'),
(14, 'event_logo_url', '/assets/images/logo.png', 'event', '2026-01-26 16:20:48'),
(15, 'event_date', '2026-03-15', 'event', '2026-01-26 16:20:48'),
(16, 'event_venue', 'Palais des Congrès de Cotonou', 'event', '2026-01-26 16:20:48'),
(17, 'about_video_url', '/uploads/video-1769444680639.mp4', 'event', '2026-01-26 16:24:44'),
(18, 'registration_start_date', '2026-01-01', 'event', '2026-01-26 16:20:48'),
(19, 'registration_end_date', '2026-06-15', 'event', '2026-01-26 16:20:48'),
(20, 'event_edition_number', '3è', 'event', '2026-01-26 16:31:50'),
(21, 'event_speakers_count', '15', 'stats', '2026-01-26 16:23:44'),
(22, 'event_participants_count', '200', 'stats', '2026-01-26 16:23:44'),
(23, 'event_days_count', '2', 'stats', '2026-01-26 16:20:48'),
(24, 'event_workshops_count', '12', 'stats', '2026-01-26 16:23:44');

-- --------------------------------------------------------

--
-- Structure de la table `speakers`
--

CREATE TABLE `speakers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title_fr` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `category_fr` varchar(100) NOT NULL,
  `category_en` varchar(100) NOT NULL,
  `image_url` varchar(2048) NOT NULL,
  `twitter_url` varchar(2048) DEFAULT NULL,
  `linkedin_url` varchar(2048) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `speakers`
--

INSERT INTO `speakers` (`id`, `name`, `title_fr`, `title_en`, `category_fr`, `category_en`, `image_url`, `twitter_url`, `linkedin_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(5, 'Chaminade Dondah ADJOLOU', 'DEV', 'DEV', 'DEV', 'DEV', 'https://i.pinimg.com/1200x/0d/46/d9/0d46d9fed85c8e01d311e01db052b855.jpg', 'x.com/Donchaminade', 'linkedin.com/in/chaminadeadjolou', 0, 0, '2026-01-25 02:26:37', '2026-01-25 02:30:07');

-- --------------------------------------------------------

--
-- Structure de la table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(2048) NOT NULL COMMENT 'URL du logo en format SVG ou PNG transparent de préférence',
  `website_url` varchar(2048) DEFAULT NULL,
  `tier` enum('platinum','gold','silver','community') NOT NULL DEFAULT 'community',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sponsors`
--

INSERT INTO `sponsors` (`id`, `name`, `logo_url`, `website_url`, `tier`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(4, 'Cofina', '/uploads/image-1769438551187-404792687.jpg', 'https://groupcofina.com', 'silver', 1, 4, '2026-01-25 02:07:35', '2026-01-26 14:42:32'),
(5, 'Moov Africa', '/uploads/image-1769438559495-140567772.png', 'https://moov.africa', 'silver', 1, 5, '2026-01-25 02:07:35', '2026-01-26 14:42:41'),
(7, 'Microsofttg', '/uploads/image-1769438511944-666926193.jpg', 'https://microsoft.com', 'community', 1, 5, '2026-01-26 14:42:08', '2026-01-26 14:42:08');

-- --------------------------------------------------------

--
-- Structure de la table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role_fr` varchar(255) NOT NULL,
  `role_en` varchar(255) NOT NULL,
  `image_url` varchar(2048) NOT NULL,
  `linkedin_url` varchar(2048) DEFAULT NULL,
  `twitter_url` varchar(2048) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role_fr`, `role_en`, `image_url`, `linkedin_url`, `twitter_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Samuel Adebayo', 'Coordinateur Général', 'General Coordinator', '/uploads/image-1769322640351-184888450.jpeg', '', '', 1, 0, '2026-01-25 02:07:35', '2026-01-25 06:30:41'),
(2, 'Ngozi Okonjo', 'Responsable Programme', 'Program Lead', '/uploads/image-1769322625709-533686945.png', '', '', 1, 0, '2026-01-25 02:07:35', '2026-01-25 06:30:27'),
(3, 'Kwame Appiah', 'Responsable Partenariats', 'Partnerships Lead', '/uploads/image-1769322610956-110155532.jpeg', '', '', 1, 0, '2026-01-25 02:07:35', '2026-01-25 06:30:12'),
(4, 'Chaminade Dondah ADJOLOU', 'Coordinateur Général', 'General Coordinator', '/uploads/image-1769322688474-1815874.jpg', '', '', 1, 2, '2026-01-25 06:31:35', '2026-01-25 06:31:35');

-- --------------------------------------------------------

--
-- Structure de la table `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `author_title_fr` varchar(255) NOT NULL,
  `author_title_en` varchar(255) NOT NULL,
  `author_image_url` varchar(2048) DEFAULT NULL,
  `quote_fr` text NOT NULL,
  `quote_en` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `testimonials`
--

INSERT INTO `testimonials` (`id`, `author_name`, `author_title_fr`, `author_title_en`, `author_image_url`, `quote_fr`, `quote_en`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Jean-Luc Kouassi', 'Co-fondateur, APP', 'Co-founder, APP', 'https://picsum.photos/100/100?random=1', 'Notre vision est de créer un pont entre les talents africains et les opportunités offertes par la Power Platform. Cet événement est le catalyseur de cette ambition.', 'Our vision is to create a bridge between African talent and the opportunities offered by the Power Platform. This event is the catalyst for that ambition.', 1, 0, '2026-01-25 02:07:35', '2026-01-25 02:07:35'),
(2, 'Mariam Keita', 'Directrice Partenariats', 'Partnerships Director', 'https://picsum.photos/100/100?random=2', 'Nous sommes fiers de réunir un écosystème aussi vibrant. C\'est une chance unique pour les entreprises de découvrir des innovations et de rencontrer les leaders de demain.', 'We are proud to bring together such a vibrant ecosystem. It is a unique chance for companies to discover innovations and meet the leaders of tomorrow.', 1, 0, '2026-01-25 02:07:35', '2026-01-25 02:07:35');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','manager') NOT NULL DEFAULT 'manager',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@app.com', '$2b$10$Obf9IjqwER/X1GeOwSNsReTdJSGoYXt6jAGxQ3WpQnDUEaO5sI.LG', 'admin', 1, '2026-01-25 02:07:36', '2026-01-27 00:14:50');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `content_blocks`
--
ALTER TABLE `content_blocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `block_key` (`block_key`);

--
-- Index pour la table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active_category_order` (`is_active`,`category`,`display_order`);

--
-- Index pour la table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_gallery_is_active_order` (`is_active`,`display_order`);

--
-- Index pour la table `media_assets`
--
ALTER TABLE `media_assets`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email_active` (`email`,`is_active`);

--
-- Index pour la table `partnership_requests`
--
ALTER TABLE `partnership_requests`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pass_types`
--
ALTER TABLE `pass_types`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `program_items`
--
ALTER TABLE `program_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_day_start_time` (`day`,`start_time`);

--
-- Index pour la table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_pass_type` (`pass_type`);

--
-- Index pour la table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Index pour la table `speakers`
--
ALTER TABLE `speakers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active_display_order` (`is_active`,`display_order`);

--
-- Index pour la table `sponsors`
--
ALTER TABLE `sponsors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active_tier_order` (`is_active`,`tier`,`display_order`);

--
-- Index pour la table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active_order` (`is_active`,`display_order`);

--
-- Index pour la table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active_order` (`is_active`,`display_order`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email_active` (`email`,`is_active`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `content_blocks`
--
ALTER TABLE `content_blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `faq`
--
ALTER TABLE `faq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `media_assets`
--
ALTER TABLE `media_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `partnership_requests`
--
ALTER TABLE `partnership_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `pass_types`
--
ALTER TABLE `pass_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `program_items`
--
ALTER TABLE `program_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT pour la table `speakers`
--
ALTER TABLE `speakers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `sponsors`
--
ALTER TABLE `sponsors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
