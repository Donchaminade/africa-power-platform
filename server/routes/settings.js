const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/settings - Récupérer toutes les configurations
router.get('/', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    // Transformer le tableau en objet clé-valeur pour un accès plus simple côté client
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    console.error('Erreur lors de la récupération des configurations :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/settings - Mettre à jour plusieurs configurations
router.put('/', async (req, res) => {
  try {
    const settingsToUpdate = req.body;
    const promises = [];

    // Créer une promesse de mise à jour pour chaque clé
    for (const key in settingsToUpdate) {
      if (Object.hasOwnProperty.call(settingsToUpdate, key)) {
        const value = settingsToUpdate[key];
        const promise = pool.query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
        promises.push(promise);
      }
    }

    // Exécuter toutes les promesses en parallèle
    await Promise.all(promises);

    res.json({ message: 'Configurations mises à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des configurations :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
