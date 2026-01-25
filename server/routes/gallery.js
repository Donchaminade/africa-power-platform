const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/gallery - Récupérer toutes les images de la galerie
router.get('/', async (req, res) => {
  try {
    const [images] = await pool.query('SELECT * FROM gallery ORDER BY display_order ASC, image_date DESC');
    res.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/gallery - Ajouter une nouvelle image
router.post('/', async (req, res) => {
  try {
    const { title, description, image_url, image_date, display_order } = req.body;
    const newImage = { title, description, image_url, image_date, display_order };
    
    const [result] = await pool.query('INSERT INTO gallery SET ?', newImage);
    
    res.status(201).json({ id: result.insertId, ...newImage });
  } catch (error) {
    console.error(`Erreur lors de l'ajout de l'image :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/gallery/:id - Mettre à jour une image
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, image_url, image_date, display_order, is_active } = req.body;
    const updatedImage = { title, description, image_url, image_date, display_order, is_active };

    const [result] = await pool.query('UPDATE gallery SET ? WHERE id = ?', [updatedImage, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }
    res.json({ id: Number(id), ...updatedImage });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'image ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/gallery/:id - Supprimer une image
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM gallery WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'image ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
