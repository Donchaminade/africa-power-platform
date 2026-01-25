const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/testimonials - Récupérer tous les témoignages
router.get('/', async (req, res) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY display_order ASC, author_name ASC');
    res.json(testimonials);
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/testimonials - Ajouter un nouveau témoignage
router.post('/', async (req, res) => {
  try {
    const { author_name, author_title_fr, author_title_en, author_image_url, quote_fr, quote_en, display_order } = req.body;
    const newTestimonial = { author_name, author_title_fr, author_title_en, author_image_url, quote_fr, quote_en, display_order };
    
    const [result] = await pool.query('INSERT INTO testimonials SET ?', newTestimonial);
    
    res.status(201).json({ id: result.insertId, ...newTestimonial });
  } catch (error) {
    console.error(`Erreur lors de l'ajout du témoignage :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/testimonials/:id - Mettre à jour un témoignage
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { author_name, author_title_fr, author_title_en, author_image_url, quote_fr, quote_en, display_order, is_active } = req.body;
    const updatedTestimonial = { author_name, author_title_fr, author_title_en, author_image_url, quote_fr, quote_en, display_order, is_active };

    const [result] = await pool.query('UPDATE testimonials SET ? WHERE id = ?', [updatedTestimonial, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.json({ id: Number(id), ...updatedTestimonial });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du témoignage ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/testimonials/:id - Supprimer un témoignage
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression du témoignage ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
