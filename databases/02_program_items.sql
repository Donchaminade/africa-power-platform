-- databases/02_program_items.sql
-- Table pour stocker les éléments du programme de l'événement

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

-- Insertion de données d'exemple
INSERT INTO `program_items` (`day`, `start_time`, `end_time`, `title_fr`, `title_en`, `description_fr`, `description_en`, `icon_class`) VALUES
(1, '11:00:00', '12:00:00', 'Keynote d''Ouverture', 'Opening Keynote', 'Vision et opportunités de la Power Platform en Afrique.', 'Vision and opportunities for the Power Platform in Africa.', 'fas fa-bullhorn'),
(1, '12:00:00', '13:30:00', 'Panel: Transformation Digitale', 'Panel: Digital Transformation', 'Cas d''usages concrets dans les services publics et l''agriculture.', 'Concrete use cases in public services and agriculture.', 'fas fa-users'),
(1, '13:30:00', '14:30:00', 'Pause Déjeuner & Networking', 'Lunch Break & Networking', 'Échanges avec les speakers et participants.', 'Discussions with speakers and attendees.', 'fas fa-coffee'),
(1, '14:30:00', '17:00:00', 'Sessions Techniques', 'Technical Sessions', 'Ateliers sur Power Apps, Power BI, et Copilot Studio.', 'Workshops on Power Apps, Power BI, and Copilot Studio.', 'fas fa-code'),
(2, '10:00:00', '13:00:00', 'Bootcamp: Idéation & Design', 'Bootcamp: Ideation & Design', 'Concevoir une solution low-code pour un défi local.', 'Designing a low-code solution for a local challenge.', 'fas fa-lightbulb'),
(2, '13:00:00', '14:00:00', 'Pause & Mentorat', 'Break & Mentoring', 'Déjeuner et sessions de coaching avec des experts.', 'Lunch and coaching sessions with experts.', 'fas fa-handshake'),
(2, '14:00:00', '16:30:00', 'Bootcamp: Développement', 'Bootcamp: Development', 'Co-création et prototypage des solutions.', 'Co-creation and prototyping of solutions.', 'fas fa-cogs'),
(2, '16:30:00', '17:00:00', 'Présentation & Clôture', 'Presentation & Closing', 'Démonstration des projets et remise des prix.', 'Project demonstrations and awards ceremony.', 'fas fa-trophy');
