const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/passes - Récupérer tous les types de passes
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    let query = 'SELECT * FROM pass_types';
    if (all !== 'true') {
        query += ' WHERE is_active = TRUE';
    }
    query += ' ORDER BY display_order ASC';

    const [passes] = await pool.query(query);
    
    // Convertir les chaînes JSON en objets
    const formattedPasses = passes.map(pass => ({
      ...pass,
      features_fr: JSON.parse(pass.features_fr || '[]'),
      features_en: JSON.parse(pass.features_en || '[]'),
    }));

    res.json(formattedPasses);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de passes :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/passes - Créer un nouveau type de pass
router.post('/', async (req, res) => {
    const { name_fr, name_en, description_fr, description_en, price_fr, price_en, features_fr, features_en, is_active, display_order, tag_fr, tag_en } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO pass_types (name_fr, name_en, description_fr, description_en, price_fr, price_en, features_fr, features_en, is_active, display_order, tag_fr, tag_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name_fr, name_en, description_fr, description_en, price_fr, price_en, JSON.stringify(features_fr), JSON.stringify(features_en), is_active, display_order, tag_fr, tag_en]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Erreur lors de la création du type de pass :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /api/passes/:id - Mettre à jour un type de pass
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name_fr, name_en, description_fr, description_en, price_fr, price_en, features_fr, features_en, is_active, display_order, tag_fr, tag_en } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE pass_types SET name_fr = ?, name_en = ?, description_fr = ?, description_en = ?, price_fr = ?, price_en = ?, features_fr = ?, features_en = ?, is_active = ?, display_order = ?, tag_fr = ?, tag_en = ? WHERE id = ?',
            [name_fr, name_en, description_fr, description_en, price_fr, price_en, JSON.stringify(features_fr), JSON.stringify(features_en), is_active, display_order, tag_fr, tag_en, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pass type not found' });
        }
        res.json({ id, ...req.body });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du type de pass :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /api/passes/:id - Supprimer un type de pass
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM pass_types WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pass type not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression du type de pass :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
