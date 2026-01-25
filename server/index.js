require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 4000;

// ======= Middleware =======
// Active CORS pour autoriser les requêtes depuis le frontend
app.use(cors());
// Permet au serveur de comprendre les requêtes JSON
app.use(express.json());

// ======= Routes =======
// Route de test pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.send('<h1>Backend Africa Power Platform</h1><p>Le serveur est en marche.</p>');
});

// Route pour vérifier la connexion à la base de données
app.get('/api/healthcheck', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ success: true, message: 'Connexion à la base de données réussie.', data: rows[0].solution });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    res.status(500).json({ success: false, message: 'Impossible de se connecter à la base de données.', error: error.message });
  }
});

// Importer les routes
const speakersRouter = require('./routes/speakers');
const programRouter = require('./routes/program');
const sponsorsRouter = require('./routes/sponsors');
const faqRouter = require('./routes/faq');
const testimonialsRouter = require('./routes/testimonials');
const teamRouter = require('./routes/team');
const registrationsRouter = require('./routes/registrations');
const usersRouter = require('./routes/users');
const settingsRouter = require('./routes/settings');
const statsRouter = require('./routes/stats');
const newsletterRouter = require('./routes/newsletter');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');
const galleryRouter = require('./routes/gallery');

// Utiliser les routes
app.use('/api/speakers', speakersRouter);
app.use('/api/program', programRouter);
app.use('/api/sponsors', sponsorsRouter);
app.use('/api/faq', faqRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/team', teamRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/upload', uploadRouter);
app.use('/api', authRouter); // Using /api prefix for /login
app.use('/api/gallery', galleryRouter);
app.use('/api/ticket', require('./routes/ticket'));


// ======= Démarrage du serveur =======
app.listen(PORT, () => {
  console.log(`
  ************************************************
  *                                              *
  *    🚀 Serveur backend démarré sur le port ${PORT}    *
  *                                              *
  ************************************************
  `);
  console.log(`URL du serveur: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/healthcheck`);
});
