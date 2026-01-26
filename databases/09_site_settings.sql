-- databases/09_site_settings.sql
-- Table pour les configurations globales du site (clé-valeur)

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé unique pour la configuration (ex: social_linkedin_url)',
  `setting_value` TEXT,
  `setting_group` VARCHAR(50) DEFAULT 'general' COMMENT 'Groupe pour organiser les paramètres (ex: social, contact)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des données de configuration de base
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('contact_email', 'contact@africapowerplatform.org', 'contact'),
('contact_phone', '+229 68 38 01 12', 'contact'),
('contact_address', 'Cotonou, Bénin', 'contact'),
('social_linkedin_url', '#', 'social'),
('social_facebook_url', '#', 'social'),
('social_twitter_url', '#', 'social'),
('event_location_google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.111833544525!2d2.404550615349471!3d6.379200995386005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10249df1b9e54865%3A0x6b3589b389f1d24a!2sPalais%20des%20Congr%C3%A8s%20de%20Cotonou!5e0!3m2!1sfr!2sfr!4v1672522600000', 'event'),
('seo_meta_title_fr', 'Africa Power Platform 2026', 'seo'),
('seo_meta_title_en', 'Africa Power Platform 2026', 'seo'),
('seo_meta_description_fr', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l''Ouest. Un événement pour éduquer, connecter et impacter l''écosystème tech panafricain.', 'seo'),
('seo_meta_description_en', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'seo'),
('seo_meta_keywords_fr', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Bénin, Sommet Tech, Innovation', 'seo'),
('seo_meta_keywords_en', 'Africa Power Platform, Microsoft Power Platform, Cotonou, Benin, Tech Summit, Innovation', 'seo'),
('event_logo_url', '/assets/images/logo.png', 'event'),
('event_date', '2026-03-15', 'event'),
('event_venue', 'Palais des Congrès de Cotonou', 'event'),
('about_video_url', 'https://www.youtube.com/embed/your_video_id', 'event'),
('registration_start_date', '2026-01-01', 'event'),
('registration_end_date', '2026-06-15', 'event'),
('event_edition_number', '1ère', 'event'),
('event_speakers_count', '25', 'stats'), -- Nouveau
('event_participants_count', '500', 'stats'), -- Nouveau
('event_days_count', '2', 'stats'), -- Nouveau
('event_workshops_count', '10', 'stats') -- Nouveau
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    setting_group = VALUES(setting_group);