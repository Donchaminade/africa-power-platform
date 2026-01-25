-- databases/04_registrations.sql
-- Table pour stocker les inscriptions des participants

CREATE TABLE IF NOT EXISTS `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `company` VARCHAR(255) NULL,
  `job_title` VARCHAR(255) NULL,
  `country` VARCHAR(100) NOT NULL,
  `pass_type` ENUM('conference', 'full', 'bootcamp_applicant') NOT NULL,
  `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `has_attended` BOOLEAN NOT NULL DEFAULT FALSE,
  `confirmation_token` VARCHAR(255) NULL,
  `is_confirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  INDEX `idx_email` (`email`),
  INDEX `idx_pass_type` (`pass_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
