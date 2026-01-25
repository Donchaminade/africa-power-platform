-- databases/08_team_members.sql
-- Table pour stocker les membres de l'équipe d'organisation

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

-- Insertion de données d'exemple
INSERT INTO `team_members` (`name`, `role_fr`, `role_en`, `image_url`) VALUES
('Samuel Adebayo', 'Coordinateur Général', 'General Coordinator', 'https://picsum.photos/400/400?random=20'),
('Ngozi Okonjo', 'Responsable Programme', 'Program Lead', 'https://picsum.photos/400/400?random=21'),
('Kwame Appiah', 'Responsable Partenariats', 'Partnerships Lead', 'https://picsum.photos/400/400?random=22');
