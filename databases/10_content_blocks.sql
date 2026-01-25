-- databases/10_content_blocks.sql
-- Table pour stocker les blocs de contenu textuel du site

CREATE TABLE IF NOT EXISTS `content_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `block_key` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Clé unique pour le bloc de contenu (ex: hero_description)',
  `content_fr` TEXT,
  `content_en` TEXT,
  `page_section` VARCHAR(50) COMMENT 'Section de la page où le contenu apparaît (ex: hero, about)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des contenus textuels du site
INSERT INTO `content_blocks` (`block_key`, `content_fr`, `content_en`, `page_section`) VALUES
('hero_date', '20-21 Juin 2026 • Cotonou, Bénin', 'June 20-21, 2026 • Cotonou, Benin', 'hero'),
('hero_title', 'Africa Power Platform', 'Africa Power Platform', 'hero'),
('hero_subtitle', 'Tech • Innovation • Leadership', 'Tech • Innovation • Leadership', 'hero'),
('hero_description', 'Rejoignez le premier sommet dédié à Microsoft Power Platform en Afrique de l''Ouest. Un événement pour éduquer, connecter et impacter l''écosystème tech panafricain.', 'Join the premier summit dedicated to Microsoft Power Platform in West Africa. An event to educate, connect, and impact the Pan-African tech ecosystem.', 'hero'),
('about_p1', 'Africa Power Platform est une initiative structurante, pensée comme un rendez-vous annuel itinérant porté par les communautés Microsoft Power Platform locales à travers l''Afrique.', 'Africa Power Platform is a structuring initiative, designed as a traveling annual meeting supported by local Microsoft Power Platform communities across Africa.', 'about'),
('about_p2', 'Notre mission est de renforcer les communautés, favoriser le partage de compétences et faire émerger des solutions technologiques adaptées aux enjeux africains, en combinant une <strong>conférence d''envergure</strong> et un <strong>bootcamp pratique</strong>.', 'Our mission is to strengthen communities, promote skill sharing, and foster the emergence of technological solutions adapted to African challenges, combining a <strong>large-scale conference</strong> and a <strong>practical bootcamp</strong>.', 'about'),
('location_description', 'L''événement se tiendra au prestigieux Palais des Congrès de Cotonou, un lieu central et moderne, parfait pour accueillir les innovateurs de toute l''Afrique.', 'The event will be held at the prestigious Cotonou Convention Center, a central and modern venue perfect for welcoming innovators from all over Africa.', 'location'),
('sponsors_description', 'Les leaders de l''industrie et les organisations visionnaires qui rendent cet événement possible.', 'The industry leaders and visionary organizations that make this event possible.', 'sponsors'),
('contact_description', 'Inscrivez-vous à notre newsletter pour recevoir les actualités et ne rien manquer de l''événement.', 'Sign up for our newsletter to receive updates and not miss anything about the event.', 'contact'),
('footer_tagline', 'Éduquer, connecter et impacter l''écosystème technologique panafricain.', 'Educate, connect, and impact the Pan-African technology ecosystem.', 'footer');
