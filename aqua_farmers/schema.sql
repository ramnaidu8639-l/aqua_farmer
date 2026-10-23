-- =======================================================
-- Database Schema for Aqua Farmers (MySQL 8.0+)
-- =======================================================

CREATE DATABASE IF NOT EXISTS `aqua_farmers_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `aqua_farmers_db`;

-- 1. Users Table (Farmers and Administrators)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `farm_type` VARCHAR(100) NOT NULL,
    `role` ENUM('farmer', 'admin') NOT NULL DEFAULT 'farmer',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_location` (`location`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Species Table
CREATE TABLE IF NOT EXISTS `species` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `category` ENUM('shrimp', 'fish') NOT NULL,
    `scientific_name` VARCHAR(120) NOT NULL,
    `description` TEXT NULL,
    `ideal_salinity` VARCHAR(50) NULL,
    `ideal_temp` VARCHAR(50) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_species_category` (`category`),
    INDEX `idx_species_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Prices Table
CREATE TABLE IF NOT EXISTS `seed_prices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `species_id` INT NOT NULL,
    `supplier_name` VARCHAR(150) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NOT NULL DEFAULT 'per 1,000 seeds',
    `availability` ENUM('In Stock', 'Low Stock', 'Pre-booking Only', 'Sold Out') NOT NULL DEFAULT 'In Stock',
    `contact_number` VARCHAR(30) NOT NULL,
    `contact_email` VARCHAR(120) NULL,
    `notes` TEXT NULL,
    `pcr_certified` BOOLEAN NOT NULL DEFAULT TRUE,
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_seed_species` (`species_id`),
    INDEX `idx_seed_location` (`location`),
    INDEX `idx_seed_price` (`price`),
    INDEX `idx_seed_availability` (`availability`),
    CONSTRAINT `fk_seed_prices_species` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Market Rates Table
CREATE TABLE IF NOT EXISTS `market_rates` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `species_id` INT NOT NULL,
    `market_name` VARCHAR(150) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `min_price` DECIMAL(10, 2) NOT NULL,
    `max_price` DECIMAL(10, 2) NOT NULL,
    `avg_price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NOT NULL DEFAULT 'per kg',
    `count_spec` VARCHAR(80) NOT NULL,
    `trend` ENUM('up', 'down', 'stable') NOT NULL DEFAULT 'stable',
    `change_percent` FLOAT NOT NULL DEFAULT 0.0,
    `recorded_date` DATE NOT NULL,
    `updated_by_admin` VARCHAR(100) NOT NULL DEFAULT 'Admin',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_market_species` (`species_id`),
    INDEX `idx_market_location` (`location`),
    INDEX `idx_market_date` (`recorded_date`),
    CONSTRAINT `fk_market_rates_species` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Disease Advisories Table
CREATE TABLE IF NOT EXISTS `disease_advisories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `disease_name` VARCHAR(150) NOT NULL,
    `affected_species` VARCHAR(200) NOT NULL,
    `species_id` INT NULL,
    `category` ENUM('shrimp', 'fish', 'both') NOT NULL DEFAULT 'shrimp',
    `symptoms` TEXT NOT NULL,
    `seasonal_risk_period` VARCHAR(100) NOT NULL,
    `favorable_conditions` TEXT NOT NULL,
    `prevention_measures` TEXT NOT NULL,
    `recommended_steps` TEXT NOT NULL,
    `risk_level` ENUM('High', 'Moderate', 'Low', 'Seasonal Watch') NOT NULL DEFAULT 'Moderate',
    `is_outbreak` BOOLEAN NOT NULL DEFAULT FALSE,
    `source` VARCHAR(200) NOT NULL,
    `publication_date` DATE NOT NULL,
    `disclaimer` TEXT NOT NULL,
    INDEX `idx_disease_risk` (`risk_level`),
    INDEX `idx_disease_season` (`seasonal_risk_period`),
    INDEX `idx_disease_category` (`category`),
    CONSTRAINT `fk_advisory_species` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Favorite Species Table (Farmer preferences)
CREATE TABLE IF NOT EXISTS `favorite_species` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `species_id` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_user_species` (`user_id`, `species_id`),
    CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fav_species` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Price History Audit Table
CREATE TABLE IF NOT EXISTS `price_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `species_id` INT NOT NULL,
    `species_name` VARCHAR(100) NOT NULL,
    `market_or_supplier` VARCHAR(150) NOT NULL,
    `record_type` ENUM('market_rate', 'seed_price') NOT NULL,
    `previous_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `new_price` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `admin_id` INT NULL,
    `admin_name` VARCHAR(100) NOT NULL,
    `notes` TEXT NULL,
    INDEX `idx_history_species` (`species_id`),
    INDEX `idx_history_time` (`update_time`),
    CONSTRAINT `fk_history_user` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
