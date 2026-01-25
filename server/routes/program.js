const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/program - Récupérer tous les éléments du programme
router.get('/', async (req, res) => {
  try {
    // Ordonné par jour, puis par heure de début
    const [items] = await pool.query('SELECT * FROM program_items ORDER BY day ASC, start_time ASC');
    res.json(items);
  } catch (error) {
    console.error('Erreur lors de la récupération du programme :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/program - Ajouter un nouvel élément au programme
router.post('/', async (req, res) => {
  try {
    const { day, start_time, end_time, title_fr, title_en, description_fr, description_en, icon_class } = req.body;
    const newItem = { day, start_time, end_time, title_fr, title_en, description_fr, description_en, icon_class };
    
    const [result] = await pool.query('INSERT INTO program_items SET ?', newItem);
    
    res.status(201).json({ id: result.insertId, ...newItem });
  } catch (error) {
    console.error(`Erreur lors de l'ajout de l'élément au programme :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/program/:id - Mettre à jour un élément du programme
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { day, start_time, end_time, title_fr, title_en, description_fr, description_en, icon_class, is_active } = req.body;
    const updatedItem = { day, start_time, end_time, title_fr, title_en, description_fr, description_en, icon_class, is_active };

    const [result] = await pool.query('UPDATE program_items SET ? WHERE id = ?', [updatedItem, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Élément du programme non trouvé' });
    }
    res.json({ id: Number(id), ...updatedItem });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'élément ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/program/:id - Supprimer un élément du programme
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM program_items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Élément du programme non trouvé' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'élément ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
