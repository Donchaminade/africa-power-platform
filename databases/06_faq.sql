-- databases/06_faq.sql
-- Table pour stocker les questions fréquemment posées (FAQ)

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

-- Insertion de données d'exemple
INSERT INTO `faq` (`question_fr`, `question_en`, `answer_fr`, `answer_en`, `category`, `display_order`) VALUES
('L''événement est-il vraiment gratuit ?', 'Is the event really free?', 'Oui, l''accès à la conférence et la candidature au bootcamp sont entièrement gratuits. L''inscription est cependant obligatoire pour réserver votre place.', 'Yes, access to the conference and application to the bootcamp are completely free. However, registration is mandatory to reserve your spot.', 'Inscription', 1),
('Qui peut participer au bootcamp ?', 'Who can participate in the bootcamp?', 'Le bootcamp est ouvert aux développeurs, designers, chefs de projet et étudiants passionnés par la technologie et désireux de résoudre des défis concrets. Les places sont limitées et la sélection se fait sur candidature.', 'The bootcamp is open to developers, designers, project managers, and students passionate about technology and eager to solve real-world challenges. Seats are limited and selection is by application.', 'Bootcamp', 2),
('Y aura-t-il des opportunités de networking ?', 'Will there be networking opportunities?', 'Absolument. Des pauses café, le déjeuner et des sessions dédiées sont prévues pour favoriser les échanges entre les participants, les speakers et les partenaires.', 'Absolutely. Coffee breaks, lunch, and dedicated sessions are planned to encourage networking among attendees, speakers, and partners.', 'Général', 3);
