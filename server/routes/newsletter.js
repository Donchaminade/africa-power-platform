const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/newsletter - Récupérer les abonnés, avec limite
router.get('/', async (req, res) => {
  try {
    const { limit, all } = req.query; // 'all' flag to get all subscribers for admin
    let query = 'SELECT * FROM newsletter_subscribers';
    const params = [];

    if (all !== 'true') {
        query += ' WHERE is_active = TRUE';
    }

    query += ' ORDER BY subscribed_at DESC';

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

// POST /api/newsletter - Ajouter un nouvel abonné
router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE is_active = TRUE',
            [email]
        );
        res.status(201).json({ id: result.insertId, email });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'An error occurred while subscribing' });
    }
});

// DELETE /api/newsletter/:id - Supprimer un abonné
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Subscriber not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({ error: 'An error occurred while deleting the subscriber' });
    }
});


module.exports = router;
