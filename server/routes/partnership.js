const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/partnership-requests - Récupérer toutes les demandes de partenariat
router.get('/', async (req, res) => {
    try {
        const [requests] = await pool.query('SELECT * FROM partnership_requests ORDER BY created_at DESC');
        res.json(requests);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes de partenariat :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// POST /api/partnership-requests - Soumettre une nouvelle demande de partenariat
router.post('/', async (req, res) => {
  try {
    const { company_name, contact_name, email, phone, message } = req.body;

    if (!company_name || !contact_name || !email) {
      return res.status(400).json({ message: 'Company name, contact name, and email are required.' });
    }

    const newRequest = { company_name, contact_name, email, phone, message };
    
    await pool.query('INSERT INTO partnership_requests SET ?', newRequest);
    
    res.status(201).json({ message: 'Partnership request submitted successfully.' });
  } catch (error) {
    console.error(`Error submitting partnership request:`, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/partnership-requests/:id - Supprimer une demande de partenariat
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM partnership_requests WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de la demande de partenariat :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
