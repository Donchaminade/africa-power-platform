
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all content blocks
router.get('/', async (req, res) => {
    try {
        const [blocks] = await pool.query('SELECT * FROM content_blocks');
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching content blocks:', error);
        res.status(500).json({ error: 'An error occurred while fetching content blocks' });
    }
});

// GET content block by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [block] = await pool.query('SELECT * FROM content_blocks WHERE id = ?', [id]);
        if (block.length === 0) {
            return res.status(404).json({ error: 'Content block not found' });
        }
        res.json(block[0]);
    } catch (error) {
        console.error('Error fetching content block:', error);
        res.status(500).json({ error: 'An error occurred while fetching the content block' });
    }
});

// POST a new content block
router.post('/', async (req, res) => {
    const { block_key, display_name, content_fr, content_en, page_section } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO content_blocks (block_key, display_name, content_fr, content_en, page_section) VALUES (?, ?, ?, ?, ?)',
            [block_key, display_name, content_fr, content_en, page_section]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error('Error creating content block:', error);
        res.status(500).json({ error: 'An error occurred while creating the content block' });
    }
});

// PUT update a content block
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { block_key, display_name, content_fr, content_en, page_section } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE content_blocks SET block_key = ?, display_name = ?, content_fr = ?, content_en = ?, page_section = ? WHERE id = ?',
            [block_key, display_name, content_fr, content_en, page_section, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Content block not found' });
        }
        res.json({ id, ...req.body });
    } catch (error) {
        console.error('Error updating content block:', error);
        res.status(500).json({ error: 'An error occurred while updating the content block' });
    }
});

// DELETE a content block
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM content_blocks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Content block not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting content block:', error);
        res.status(500).json({ error: 'An error occurred while deleting the content block' });
    }
});

module.exports = router;
