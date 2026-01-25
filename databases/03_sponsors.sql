-- databases/03_sponsors.sql
-- Table pour stocker les informations sur les sponsors/partenaires

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

-- Insertion de données d'exemple
INSERT INTO `sponsors` (`name`, `logo_url`, `website_url`, `tier`, `display_order`) VALUES
('Microsoft', 'https://logo.clearbit.com/microsoft.com', 'https://microsoft.com', 'platinum', 1),
('MTN', 'https://logo.clearbit.com/mtn.com', 'https://mtn.com', 'gold', 2),
('Orange', 'https://logo.clearbit.com/orange.com', 'https://orange.com', 'gold', 3),
('Cofina', 'https://logo.clearbit.com/groupcofina.com', 'https://groupcofina.com', 'silver', 4),
('Moov Africa', 'https://logo.clearbit.com/moov.africa', 'https://moov.africa', 'silver', 5),
('ISOCEL', 'https://logo.clearbit.com/isoceltelecom.com', 'https://isoceltelecom.com', 'community', 6);
