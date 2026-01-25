-- databases/05_newsletter_subscribers.sql
-- Table pour stocker les abonnés à la newsletter

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `unsubscribe_token` VARCHAR(255) NULL,
  INDEX `idx_email_active` (`email`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
