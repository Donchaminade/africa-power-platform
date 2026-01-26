
const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

// GET all media assets
router.get('/', async (req, res) => {
    try {
        const [assets] = await pool.query('SELECT * FROM media_assets ORDER BY uploaded_at DESC');
        res.json(assets);
    } catch (error) {
        console.error('Error fetching media assets:', error);
        res.status(500).json({ error: 'An error occurred while fetching media assets' });
    }
});

// GET media asset by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [asset] = await pool.query('SELECT * FROM media_assets WHERE id = ?', [id]);
        if (asset.length === 0) {
            return res.status(404).json({ error: 'Media asset not found' });
        }
        res.json(asset[0]);
    } catch (error) {
        console.error('Error fetching media asset:', error);
        res.status(500).json({ error: 'An error occurred while fetching the media asset' });
    }
});

// POST a new media asset (upload file)
router.post('/', upload.single('media_file'), async (req, res) => {
    const { title_fr, title_en, alt_text_fr, alt_text_en, description_fr, description_en, type, is_active } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file_url = `/uploads/${file.filename}`; // URL accessible from the client
    const mime_type = file.mimetype;
    const file_size = file.size;

    try {
        const [result] = await pool.query(
            'INSERT INTO media_assets (file_name, file_url, alt_text_fr, alt_text_en, description_fr, description_en, type, mime_type, file_size, is_active, title_fr, title_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [file.filename, file_url, alt_text_fr, alt_text_en, description_fr, description_en, type, mime_type, file_size, is_active, title_fr, title_en]
        );
        res.status(201).json({ id: result.insertId, file_url, ...req.body });
    } catch (error) {
        console.error('Error creating media asset:', error);
        // Clean up uploaded file if DB insert fails
        fs.unlinkSync(file.path);
        res.status(500).json({ error: 'An error occurred while creating the media asset' });
    }
});

// POST an about video file
router.post('/upload-video', upload.single('video'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'Aucun fichier vidéo téléchargé.' });
    }
    const videoUrl = `/uploads/${file.filename}`;
    res.status(200).json({ message: 'Vidéo téléchargée avec succès', videoUrl });
});

// PUT update a media asset (metadata only)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title_fr, title_en, alt_text_fr, alt_text_en, description_fr, description_en, type, is_active } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE media_assets SET title_fr = ?, title_en = ?, alt_text_fr = ?, alt_text_en = ?, description_fr = ?, description_en = ?, type = ?, is_active = ? WHERE id = ?',
            [title_fr, title_en, alt_text_fr, alt_text_en, description_fr, description_en, type, is_active, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Media asset not found' });
        }
        res.json({ id, ...req.body });
    } catch (error) {
        console.error('Error updating media asset:', error);
        res.status(500).json({ error: 'An error occurred while updating the media asset' });
    }
});

// DELETE a media asset
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Get file_url to delete the actual file
        const [assets] = await pool.query('SELECT file_name FROM media_assets WHERE id = ?', [id]);
        if (assets.length === 0) {
            return res.status(404).json({ error: 'Media asset not found' });
        }

        const fileName = assets[0].file_name;
        const filePath = path.join(__dirname, '../../public/uploads', fileName);

        // Delete from database
        const [result] = await pool.query('DELETE FROM media_assets WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Media asset not found in DB' });
        }

        // Delete the actual file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting media asset:', error);
        res.status(500).json({ error: 'An error occurred while deleting the media asset' });
    }
});

module.exports = router;
