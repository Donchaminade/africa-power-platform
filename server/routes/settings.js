const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper function to convert array of key-value settings to a single object
const settingsArrayToObject = (settingsArray) => {
    const settingsObject = {};
    settingsArray.forEach(setting => {
        settingsObject[setting.setting_key] = setting.setting_value;
    });
    return settingsObject;
};

// GET /api/settings - Récupérer tous les paramètres
router.get('/', async (req, res) => {
    try {
        const [settings] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
        res.json(settingsArrayToObject(settings));
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des paramètres.', error: error.message });
    }
});

// PUT /api/settings - Mettre à jour plusieurs paramètres
router.put('/', async (req, res) => {
    const updatedSettings = req.body; // Expects an object like { setting_key: new_value, ... }

    if (!updatedSettings || Object.keys(updatedSettings).length === 0) {
        return res.status(400).json({ message: 'Aucun paramètre à mettre à jour fourni.' });
    }

    try {
        const updatePromises = Object.keys(updatedSettings).map(async (key) => {
            const value = updatedSettings[key];
            await pool.query(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
                [key, value]
            );
        });

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Paramètres mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des paramètres :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des paramètres.', error: error.message });
    }
});

module.exports = router;