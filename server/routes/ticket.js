const express = require('express');
const router = express.Router();
const pool = require('../db');
const QRCode = require('qrcode');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// GET /api/ticket/:registrationId - Générer un ticket en PDF
router.get('/:registrationId', async (req, res) => {
    const { registrationId } = req.params;

    try {
        // 1. Récupérer les données de l'inscription
        const [rows] = await pool.query('SELECT * FROM registrations WHERE id = ?', [registrationId]);
        const registration = rows[0];

        if (!registration) {
            return res.status(404).json({ message: 'Inscription non trouvée.' });
        }

        // 2. Créer le contenu du QR code
        const qrContent = JSON.stringify({
            id: registration.id,
            name: `${registration.first_name} ${registration.last_name}`,
            email: registration.email,
            pass_type: registration.pass_type
        });

        // 3. Générer le QR code en tant que Data URL (base64)
        const qrCodeDataURL = await QRCode.toDataURL(qrContent);

        // 4. Créer un nouveau document PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([350, 500]); // Taille du ticket
        const { width, height } = page.getSize();

        // Charger les polices standard
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Charger le logo
        const logoPath = path.join(__dirname, '../../../public/assets/images/logo.png');
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.25); // Réduire la taille du logo

        // 5. Dessiner le contenu du ticket
        // Logo
        page.drawImage(logoImage, {
            x: width / 2 - logoDims.width / 2,
            y: height - 80,
            width: logoDims.width,
            height: logoDims.height,
        });

        // Informations de l'inscrit
        page.drawText(`${registration.first_name} ${registration.last_name}`, {
            x: 50,
            y: height - 120,
            font: fontBold,
            size: 20,
        });
        page.drawText(registration.email, {
            x: 50,
            y: height - 140,
            font: fontRegular,
            size: 12,
            color: rgb(0.3, 0.3, 0.3),
        });

        // Type de pass
        page.drawText('PASS TYPE:', {
            x: 50,
            y: height - 180,
            font: fontBold,
            size: 10,
            color: rgb(0.5, 0.5, 0.5),
        });
        page.drawText(registration.pass_type.replace('_', ' ').toUpperCase(), {
            x: 50,
            y: height - 195,
            font: fontBold,
            size: 18,
            color: rgb(0, 0.65, 0.35),
        });

        // QR Code
        const qrImage = await pdfDoc.embedPng(qrCodeDataURL);
        const qrDims = qrImage.scale(0.6);
        page.drawImage(qrImage, {
            x: width / 2 - qrDims.width / 2,
            y: 80,
            width: qrDims.width,
            height: qrDims.height,
        });

        // Footer
        page.drawText('Veuillez présenter ce ticket à l\'entrée.', {
            x: width / 2 - 100,
            y: 50,
            font: fontRegular,
            size: 10,
        });


        // 6. Sérialiser le PDF en bytes
        const pdfBytes = await pdfDoc.save();

        // 7. Envoyer le PDF au client
        res.setHeader('Content-Length', pdfBytes.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${registration.id}.pdf`);
        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error(`Erreur lors de la génération du ticket pour l'ID ${registrationId} :`, error);
        res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF.' });
    }
});

module.exports = router;
