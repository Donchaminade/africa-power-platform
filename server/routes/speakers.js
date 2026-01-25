const express = require('express');
const router = express.Router();
const pool = require('../db'); // Pool de connexions MySQL

// GET /api/speakers - Récupérer tous les speakers
router.get('/', async (req, res) => {
  try {
    const [speakers] = await pool.query('SELECT * FROM speakers ORDER BY display_order ASC, name ASC');
    res.json(speakers);
  } catch (error) {
    console.error('Erreur lors de la récupération des speakers :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/speakers - Ajouter un nouveau speaker
router.post('/', async (req, res) => {
  try {
    const { name, title_fr, title_en, category_fr, category_en, image_url, twitter_url, linkedin_url } = req.body;
    const newSpeaker = { name, title_fr, title_en, category_fr, category_en, image_url, twitter_url, linkedin_url };
    
    const [result] = await pool.query('INSERT INTO speakers SET ?', newSpeaker);
    
    res.status(201).json({ id: result.insertId, ...newSpeaker });
  } catch (error) {
    console.error(`Erreur lors de l'ajout du speaker :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/speakers/:id - Mettre à jour un speaker
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, title_fr, title_en, category_fr, category_en, image_url, twitter_url, linkedin_url, is_active, display_order } = req.body;
    const updatedSpeaker = { name, title_fr, title_en, category_fr, category_en, image_url, twitter_url, linkedin_url, is_active, display_order };

    const [result] = await pool.query('UPDATE speakers SET ? WHERE id = ?', [updatedSpeaker, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Speaker non trouvé' });
    }
    res.json({ id: Number(id), ...updatedSpeaker });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du speaker ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/speakers/:id - Supprimer un speaker
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM speakers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Speaker non trouvé' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression du speaker ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;
