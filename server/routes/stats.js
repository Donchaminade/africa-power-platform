const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/stats - Récupérer les statistiques globales du dashboard
router.get('/', async (req, res) => {
  try {
    // Exécuter toutes les requêtes de comptage en parallèle pour plus d'efficacité
    const [
      [registrations],
      [speakers],
      [sponsors],
      [subscribers]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM registrations'),
      pool.query('SELECT COUNT(*) as count FROM speakers'),
      pool.query('SELECT COUNT(*) as count FROM sponsors'),
      pool.query('SELECT COUNT(*) as count FROM newsletter_subscribers')
    ]);

    const stats = {
      registrations: registrations[0].count,
      speakers: speakers[0].count,
      sponsors: sponsors[0].count,
      newsletterSubscribers: subscribers[0].count
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats/registrations-by-day - Données pour le graphique d'inscriptions
router.get('/registrations-by-day', async (req, res) => {
  try {
    const query = `
      SELECT 
        CAST(registration_date AS DATE) as date, 
        COUNT(id) as count 
      FROM registrations 
      WHERE registration_date >= CURDATE() - INTERVAL 30 DAY 
      GROUP BY CAST(registration_date AS DATE)
      ORDER BY date ASC;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de graphique :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats/registrations-by-type - Données pour le diagramme circulaire des types de pass
router.get('/registrations-by-type', async (req, res) => {
  try {
    const query = `
      SELECT 
        pass_type as label, 
        COUNT(id) as value 
      FROM registrations 
      GROUP BY pass_type;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions par type :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats/speakers-by-category - Données pour le diagramme en barres des catégories de speakers
router.get('/speakers-by-category', async (req, res) => {
  try {
    const query = `
      SELECT 
        category_fr as label, 
        COUNT(id) as value 
      FROM speakers 
      GROUP BY category_fr;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des speakers par catégorie :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
