CREATE TABLE IF NOT EXISTS pass_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_fr VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_fr TEXT,
    description_en TEXT,
    price_fr VARCHAR(50) NOT NULL,
    price_en VARCHAR(50) NOT NULL,
    features_fr JSON,
    features_en JSON,
    tag_fr VARCHAR(100),
    tag_en VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0
);
