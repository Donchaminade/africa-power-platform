const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/team - Récupérer tous les membres de l'équipe
router.get('/', async (req, res) => {
  try {
    const [members] = await pool.query('SELECT * FROM team_members ORDER BY display_order ASC, name ASC');
    res.json(members);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'équipe :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/team - Ajouter un nouveau membre
router.post('/', async (req, res) => {
  try {
    const { name, role_fr, role_en, image_url, linkedin_url, twitter_url, display_order } = req.body;
    const newMember = { name, role_fr, role_en, image_url, linkedin_url, twitter_url, display_order };
    
    const [result] = await pool.query('INSERT INTO team_members SET ?', newMember);
    
    res.status(201).json({ id: result.insertId, ...newMember });
  } catch (error) {
    console.error(`Erreur lors de l\'ajout du membre :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/team/:id - Mettre à jour un membre
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, role_fr, role_en, image_url, linkedin_url, twitter_url, display_order, is_active } = req.body;
    const updatedMember = { name, role_fr, role_en, image_url, linkedin_url, twitter_url, display_order, is_active };

    const [result] = await pool.query('UPDATE team_members SET ? WHERE id = ?', [updatedMember, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.json({ id: Number(id), ...updatedMember });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du membre ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/team/:id - Supprimer un membre
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM team_members WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Erreur lors de la suppression du membre ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
