const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/newsletter - Récupérer les abonnés, avec limite
router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let query = 'SELECT * FROM newsletter_subscribers WHERE is_active = TRUE ORDER BY subscribed_at DESC';
    const params = [];

    if (limit && !isNaN(parseInt(limit, 10))) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [subscribers] = await pool.query(query, params);
    res.json(subscribers);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés newsletter :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
