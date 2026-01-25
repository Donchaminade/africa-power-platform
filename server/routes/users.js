const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// GET /api/users - Récupérer tous les utilisateurs (sans le hash du mot de passe)
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, is_active, created_at FROM users ORDER BY name ASC');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/users - Ajouter un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Le mot de passe est requis.' });
    }

    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = { name, email, password_hash, role };
    
    const [result] = await pool.query('INSERT INTO users SET ?', newUser);
    
    // Retourner l'utilisateur sans le hash
    const { password_hash: _, ...userWithoutHash } = newUser;
    res.status(201).json({ id: result.insertId, ...userWithoutHash });
  } catch (error) {
    // Gérer les erreurs de duplicata d'email
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    console.error(`Erreur lors de l'ajout de l'utilisateur :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, email, password, role, is_active } = req.body;
    
    let password_hash;
    if (password) {
        password_hash = await bcrypt.hash(password, saltRounds);
    }

    // Construire l'objet de mise à jour dynamiquement
    const updatedFields = { name, email, role, is_active };
    if (password_hash) {
        updatedFields.password_hash = password_hash;
    }

    const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [updatedFields, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour avec succès.' });
  } catch (error)
   {
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Vérifier qu'on ne supprime pas le dernier utilisateur
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count <= 1) {
        return res.status(400).json({ error: 'Impossible de supprimer le dernier utilisateur.' });
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${id} :`, error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
