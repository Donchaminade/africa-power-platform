-- databases/11_media_assets.sql
-- Table pour gérer les ressources multimédias (images, vidéos, documents)

CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL COMMENT 'Nom original du fichier',
  `file_url` VARCHAR(2048) NOT NULL COMMENT 'URL accessible de la ressource',
  `title_fr` VARCHAR(255) COMMENT 'Titre de la ressource en français',
  `title_en` VARCHAR(255) COMMENT 'Titre de la ressource en anglais',
  `alt_text_fr` VARCHAR(255) COMMENT 'Texte alternatif en français',
  `alt_text_en` VARCHAR(255) COMMENT 'Texte alternatif en anglais',
  `description_fr` TEXT COMMENT 'Description en français',
  `description_en` TEXT COMMENT 'Description en anglais',
  `type` ENUM('image', 'video', 'document') NOT NULL DEFAULT 'image' COMMENT 'Type de média',
  `mime_type` VARCHAR(100) COMMENT 'Type MIME du fichier',
  `file_size` INT COMMENT 'Taille du fichier en octets',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Indique si l''actif est actif',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date et heure de l''upload'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Suppression des insertions initiales car les actifs seront gérés via l'interface d'administration.