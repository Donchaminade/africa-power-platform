const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/registrations - Récupérer les inscriptions avec recherche et pagination
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = '';
    const params = [];
    
    if (search) {
      whereClause = ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Requête pour compter le total
    const countQuery = `SELECT COUNT(*) as total FROM registrations${whereClause}`;
    const [totalRows] = await pool.query(countQuery, params);
    const totalItems = totalRows[0].total;
    const totalPages = Math.ceil(totalItems / limitNum);

    // Requête pour récupérer les données paginées
    const dataQuery = `SELECT * FROM registrations${whereClause} ORDER BY registration_date DESC LIMIT ? OFFSET ?`;
    const [registrations] = await pool.query(dataQuery, [...params, limitNum, offset]);

    res.json({
      data: registrations,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
