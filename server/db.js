const mysql = require('mysql2/promise');
require('dotenv').config();

// Crée un "pool" de connexions à la base de données.
// Le pool gère plusieurs connexions, ce qui est plus efficace
// que de créer une nouvelle connexion pour chaque requête.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporte le pool pour qu'il puisse être utilisé dans d'autres fichiers (pour les requêtes).
module.exports = pool;
