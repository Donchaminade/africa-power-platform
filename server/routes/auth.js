const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// POST /api/login - Authentifier un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Trouver l'utilisateur par email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Comparer le mot de passe fourni avec le hash stocké
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // Le mot de passe correspond. Renvoyer les informations de l'utilisateur (sans le hash)
      res.json({
        name: user.name,
        role: user.role,
      });
    } else {
      // Le mot de passe ne correspond pas
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
});

module.exports = router;
