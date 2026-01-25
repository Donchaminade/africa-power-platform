const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/checkin/:id - Enregistrer le check-in d'un participant
router.post('/checkin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si l'inscription existe et n'a pas déjà été check-in
        const [registrations] = await pool.query('SELECT id, is_checked_in, first_name, last_name FROM registrations WHERE id = ?', [id]);
        const registration = registrations[0];

        if (!registration) {
            return res.status(404).json({ message: 'Inscription non trouvée.' });
        }
        if (registration.is_checked_in) {
            return res.status(409).json({ message: `Le participant ${registration.first_name} ${registration.last_name} est déjà enregistré.` });
        }

        // Mettre à jour le statut de check-in
        const [result] = await pool.query(
            'UPDATE registrations SET is_checked_in = TRUE, check_in_time = NOW() WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Échec de la mise à jour du check-in (inscription introuvable).' });
        }

        res.status(200).json({ message: `Check-in réussi pour ${registration.first_name} ${registration.last_name}.` });

    } catch (error) {
        console.error('Erreur lors du check-in du participant :', error);
        res.status(500).json({ message: 'Erreur serveur lors du check-in.', error: error.message });
    }
});

// GET /api/checkin/history - Récupérer l'historique des participants check-in
router.get('/checkin/history', async (req, res) => {
    try {
        const [checkedInRegistrations] = await pool.query(
            'SELECT id, first_name, last_name, email, pass_type, check_in_time FROM registrations WHERE is_checked_in = TRUE ORDER BY check_in_time DESC'
        );
        res.json(checkedInRegistrations);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des check-in :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique des check-in.', error: error.message });
    }
});


module.exports = router;