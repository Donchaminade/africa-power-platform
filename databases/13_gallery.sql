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
