-- databases/11_media_assets.sql
-- Table pour gérer les ressources multimédias (images, vidéos)

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

-- Insertion des médias du site
INSERT INTO `media_assets` (`asset_key`, `asset_url`, `alt_text_fr`, `alt_text_en`, `media_type`, `page_section`) VALUES
('about_video', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Vidéo de présentation de l''événement', 'Event presentation video', 'video', 'about'),
('hero_background_image', 'https://picsum.photos/1600/900?grayscale&blur=2', 'Arrière-plan de la section hero', 'Hero section background', 'image', 'hero'),
('og_image', 'https://picsum.photos/seed/app2026/1200/630', 'Image pour le partage sur les réseaux sociaux', 'Image for social media sharing', 'image', 'seo');
