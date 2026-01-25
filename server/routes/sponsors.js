const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/sponsors - Récupérer tous les sponsors
router.get('/', async (req, res) => {
  try {
    const [sponsors] = await pool.query('SELECT * FROM sponsors ORDER BY tier ASC, display_order ASC, name ASC');
    res.json(sponsors);
  } catch (error) {
    console.error('Erreur lors de la récupération des sponsors :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/sponsors - Ajouter un nouveau sponsor
router.post('/', async (req, res) => {
  try {
    const { name, logo_url, website_url, tier, display_order } = req.body;
    const newSponsor = { name, logo_url, website_url, tier, display_order };
    
    const [result] = await pool.query('INSERT INTO sponsors SET ?', newSponsor);
    
    res.status(201).json({ id: result.insertId, ...newSponsor });
  } catch (error) {
    console.error(`Erreur lors de l'ajout du sponsor :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/sponsors/:id - Mettre à jour un sponsor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, logo_url, website_url, tier, display_order, is_active } = req.body;
    const updatedSponsor = { name, logo_url, website_url, tier, display_order, is_active };

    const [result] = await pool.query('UPDATE sponsors SET ? WHERE id = ?', [updatedSponsor, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sponsor non trouvé' });
    }
    res.json({ id: Number(id), ...updatedSponsor });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du sponsor ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/sponsors/:id - Supprimer un sponsor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM sponsors WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sponsor non trouvé' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression du sponsor ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
