-- databases/01_speakers.sql
-- Table pour stocker les informations sur les intervenants (speakers)

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

-- Insertion de données d'exemple
INSERT INTO `speakers` (`name`, `title_fr`, `title_en`, `category_fr`, `category_en`, `image_url`) VALUES
('Adama Traoré', 'MVP, Expert Power BI', 'MVP, Power BI Expert', 'Data & Analytics', 'Data & Analytics', 'https://picsum.photos/400/500?random=10'),
('Fatou Diop', 'CEO, SahelInnov', 'CEO, SahelInnov', 'Entrepreneuriat', 'Entrepreneurship', 'https://picsum.photos/400/500?random=11'),
('David Okoro', 'Consultant Dynamics 365', 'Dynamics 365 Consultant', 'Business Apps', 'Business Apps', 'https://picsum.photos/400/500?random=12'),
('Aisha Bello', 'Fondatrice, Tech4Her', 'Founder, Tech4Her', 'Impact Social', 'Social Impact', 'https://picsum.photos/400/500?random=13');
