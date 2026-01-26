
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all contact messages
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY submitted_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'An error occurred while fetching messages' });
    }
});

// POST a new contact message
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        res.status(201).json({ id: result.insertId, name, email, subject, message });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ error: 'An error occurred while submitting the message' });
    }
});

// DELETE a contact message
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ error: 'An error occurred while deleting the message' });
    }
});

module.exports = router;
