const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/faq - Récupérer toutes les FAQs
router.get('/', async (req, res) => {
  try {
    const [faqs] = await pool.query('SELECT * FROM faq ORDER BY display_order ASC, category ASC');
    res.json(faqs);
  } catch (error) {
    console.error('Erreur lors de la récupération des FAQs :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/faq - Ajouter une nouvelle FAQ
router.post('/', async (req, res) => {
  try {
    const { question_fr, question_en, answer_fr, answer_en, category, display_order } = req.body;
    const newFaq = { question_fr, question_en, answer_fr, answer_en, category, display_order };
    
    const [result] = await pool.query('INSERT INTO faq SET ?', newFaq);
    
    res.status(201).json({ id: result.insertId, ...newFaq });
  } catch (error) {
    console.error(`Erreur lors de l'ajout de la FAQ :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/faq/:id - Mettre à jour une FAQ
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { question_fr, question_en, answer_fr, answer_en, category, display_order, is_active } = req.body;
    const updatedFaq = { question_fr, question_en, answer_fr, answer_en, category, display_order, is_active };

    const [result] = await pool.query('UPDATE faq SET ? WHERE id = ?', [updatedFaq, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ non trouvée' });
    }
    res.json({ id: Number(id), ...updatedFaq });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la FAQ ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/faq/:id - Supprimer une FAQ
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM faq WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'FAQ non trouvée' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression de la FAQ ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
