
-- databases/12_users.sql
-- Table pour gérer les utilisateurs de l'interface d'administration

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager') NOT NULL DEFAULT 'manager',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email_active` (`email`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion d'utilisateurs d'exemple
-- Le mot de passe 'password' devrait être remplacé par un vrai hash en production
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
('Admin User', 'admin@app.com', '$2y$10$your_password_hash_here', 'admin'),
('Manager User', 'manager@app.com', '$2y$10$your_password_hash_here', 'manager');
