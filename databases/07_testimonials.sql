-- databases/07_testimonials.sql
-- Table pour stocker les témoignages

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

-- Insertion de données d'exemple
INSERT INTO `testimonials` (`author_name`, `author_title_fr`, `author_title_en`, `author_image_url`, `quote_fr`, `quote_en`) VALUES
('Jean-Luc Kouassi', 'Co-fondateur, APP', 'Co-founder, APP', 'https://picsum.photos/100/100?random=1', 'Notre vision est de créer un pont entre les talents africains et les opportunités offertes par la Power Platform. Cet événement est le catalyseur de cette ambition.', 'Our vision is to create a bridge between African talent and the opportunities offered by the Power Platform. This event is the catalyst for that ambition.'),
('Mariam Keita', 'Directrice Partenariats', 'Partnerships Director', 'https://picsum.photos/100/100?random=2', 'Nous sommes fiers de réunir un écosystème aussi vibrant. C''est une chance unique pour les entreprises de découvrir des innovations et de rencontrer les leaders de demain.', 'We are proud to bring together such a vibrant ecosystem. It is a unique chance for companies to discover innovations and meet the leaders of tomorrow.');
