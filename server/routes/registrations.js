const express = require('express');
const router = express.Router();
const pool = require('../db');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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

// GET /api/registrations/:id - Récupérer une seule inscription par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [registrations] = await pool.query('SELECT * FROM registrations WHERE id = ?', [id]);
    const registration = registrations[0];

    if (!registration) {
      return res.status(404).json({ message: 'Inscription non trouvée.' });
    }
    res.json(registration);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'inscription ${id} :`, error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'inscription.', error: error.message });
  }
});

// POST /api/registrations - Ajouter une nouvelle inscription depuis le formulaire public
router.post('/', async (req, res) => {
  const { first_name, last_name, email, company, pass_type } = req.body;

  if (!first_name || !last_name || !email || !pass_type) {
    return res.status(400).json({ message: 'Missing required registration fields.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO registrations (first_name, last_name, email, company, pass_type) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, company || null, pass_type]
    );

    res.status(201).json({ message: 'Registration successful!', registrationId: result.insertId });
  } catch (error) {
    console.error('Error during registration:', error);
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// GET /api/registrations/export/pdf - Exporter les inscriptions en PDF (paysage)
router.get('/export/pdf', async (req, res) => {
    try {
        let query = 'SELECT * FROM registrations';
        const queryParams = [];

        // Check for 'checkedIn' query parameter
        if (req.query.checkedIn === 'true') {
            query += ' WHERE is_checked_in = 1';
        } else if (req.query.checkedIn === 'false') {
            query += ' WHERE is_checked_in = 0';
        }
        query += ' ORDER BY registration_date DESC';

        const [allRegistrations] = await pool.query(query, queryParams);

        const pdfDoc = await PDFDocument.create();
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const BRAND_GREEN = rgb(0, 0.659, 0.349); // #00A859
        const BLACK = rgb(0.1, 0.1, 0.1);
        const GRAY = rgb(0.3, 0.3, 0.3);
        const LIGHT_GRAY = rgb(0.9, 0.9, 0.9);
        const WHITE = rgb(1, 1, 1);

        // A4 Landscape dimensions
        const PAGE_WIDTH = 841.89;
        const PAGE_HEIGHT = 595.28;
        const MARGIN = 30;

        let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

        let yOffset = PAGE_HEIGHT - MARGIN;
        const xOffset = MARGIN;

        // --- Header ---
        page.drawText('Liste des Inscriptions - Africa Power Platform 2026', {
            x: xOffset,
            y: yOffset,
            font: fontBold,
            size: 20,
            color: BRAND_GREEN,
        });
        yOffset -= 30;

        // --- Table Headers ---
        const tableHeaders = ['ID', 'Nom', 'Email', 'Compagnie', 'Type de Pass', 'Date'];
        const columnWidths = [50, 150, 200, 120, 120, 100]; // Adjusted for landscape A4
        const headerFontSize = 10;
        const rowFontSize = 9;
        const rowHeight = 18;
        const tableStartHeight = yOffset;
        
        let currentX = xOffset;
        page.drawRectangle({
            x: xOffset,
            y: yOffset - headerFontSize - 5,
            width: columnWidths.reduce((a, b) => a + b, 0),
            height: headerFontSize + 10,
            color: LIGHT_GRAY,
            borderColor: GRAY,
            borderWidth: 0.5,
        });
        tableHeaders.forEach((header, index) => {
            page.drawText(header, {
                x: currentX + 5,
                y: yOffset - headerFontSize,
                font: fontBold,
                size: headerFontSize,
                color: BLACK,
            });
            currentX += columnWidths[index];
        });
        yOffset -= (headerFontSize + 10); // Space for header row

        // --- Table Rows ---
        allRegistrations.forEach((reg, index) => {
            if (yOffset < MARGIN + 40) { // Check if new page is needed (allow space for footer) 
                page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
                yOffset = PAGE_HEIGHT - MARGIN;
                 // Redraw headers on new page
                let newPageCurrentX = xOffset;
                page.drawRectangle({
                    x: xOffset,
                    y: yOffset - headerFontSize - 5,
                    width: columnWidths.reduce((a, b) => a + b, 0),
                    height: headerFontSize + 10,
                    color: LIGHT_GRAY,
                    borderColor: GRAY,
                    borderWidth: 0.5,
                });
                tableHeaders.forEach((header, idx) => {
                    page.drawText(header, {
                        x: newPageCurrentX + 5,
                        y: yOffset - headerFontSize,
                        font: fontBold,
                        size: headerFontSize,
                        color: BLACK,
                    });
                    newPageCurrentX += columnWidths[idx];
                });
                yOffset -= (headerFontSize + 10);
            }

            currentX = xOffset;
            const rowData = [
                reg.id.toString(),
                `${reg.first_name} ${reg.last_name}`,
                reg.email,
                reg.company || 'N/A',
                reg.pass_type.replace('_', ' ').toUpperCase(),
                new Date(reg.registration_date).toLocaleDateString(),
            ];

            rowData.forEach((data, colIndex) => {
                page.drawText(data, {
                    x: currentX + 5,
                    y: yOffset - rowFontSize,
                    font: fontRegular,
                    size: rowFontSize,
                    color: BLACK,
                });
                currentX += columnWidths[colIndex];
            });
            yOffset -= rowHeight;
        });

        // --- Footer ---
        const pages = pdfDoc.getPages();
        pages.forEach((p, i) => {
            p.drawText(`Page ${i + 1} of ${pages.length}`, {
                x: PAGE_WIDTH / 2,
                y: MARGIN / 2,
                font: fontRegular,
                size: 8,
                color: GRAY,
                xAlignment: 'center',
            });
        });


        // 6. Sérialiser le PDF en bytes
        const pdfBytes = await pdfDoc.save();

        // 7. Envoyer le PDF au client
        res.setHeader('Content-Length', pdfBytes.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=registrations_export.pdf`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error('Erreur lors de l\'exportation PDF des inscriptions :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF d\'exportation.', error: error.message });
    }
});

module.exports = router;