const express = require('express');
const router = express.Router();
const pool = require('../db');
const QRCode = require('qrcode');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

// GET /api/ticket/:registrationId - Générer un ticket en PDF avec un design amélioré et en mode paysage
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
            pass_type: registration.pass_type,
            event: "Africa Power Platform 2026"
        });

        // 3. Générer le QR code en tant que Data URL (base64)
        // 4. Créer un nouveau document PDF
        const pdfDoc = await PDFDocument.create();

        // 3. Générer le QR code en tant que Data URL (base64)
        const qrCodeDataURL = await QRCode.toDataURL(qrContent, { errorCorrectionLevel: 'H', width: 200 });
        const qrImage = await pdfDoc.embedPng(qrCodeDataURL); // Déclaration anticipée
        // Définir la taille du ticket en mode paysage [width, height]
        const page = pdfDoc.addPage([600, 400]); 
        const { width, height } = page.getSize();

        // Couleurs de la marque
        const BRAND_GREEN = rgb(0, 0.659, 0.349); // #00A859
        const BRAND_YELLOW = rgb(1, 0.843, 0);     // #FFD700
        const BLACK = rgb(0.1, 0.1, 0.1);
        const GRAY = rgb(0.3, 0.3, 0.3);
        const LIGHT_GRAY = rgb(0.9, 0.9, 0.9);
        const WHITE = rgb(1, 1, 1);

        // Charger les polices standard
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontLight = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Charger le logo
        const logoPath = path.join(process.cwd(), '../public/assets/images/logo.png');
        const logoBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.12); // Réduire la taille du logo pour l'adapter au paysage

        // ====== Dessin du contenu du ticket ======

        // Cadre général du ticket
        const PADDING = 25;
        const innerWidth = width - 2 * PADDING;
        const innerHeight = height - 2 * PADDING;

        page.drawRectangle({
            x: PADDING, y: PADDING, width: innerWidth, height: innerHeight,
            borderColor: BRAND_GREEN,
            borderWidth: 3,
        });

        // Colonne de gauche (informations textuelles)
        const LEFT_COL_X = PADDING + 30;
        const RIGHT_COL_X = width / 2 + 30;
        const COL_WIDTH = innerWidth / 2 - 30 - PADDING;

        let yOffset = height - PADDING - 30; // Commencer à partir du haut de la zone de contenu

        // Logo et Titre de l'événement
        page.drawImage(logoImage, {
            x: LEFT_COL_X,
            y: yOffset - logoDims.height / 2,
            width: logoDims.width,
            height: logoDims.height,
        });
        const logoAndTitleHeight = logoDims.height;

        page.drawText('AFRICA POWER PLATFORM', {
            x: LEFT_COL_X + logoDims.width + 10,
            y: yOffset - 5,
            font: fontBold,
            size: 18,
            color: BLACK,
        });
        page.drawText('2026', {
            x: LEFT_COL_X + logoDims.width + 10,
            y: yOffset - 25,
            font: fontBold,
            size: 14,
            color: BRAND_GREEN,
        });
        yOffset -= logoAndTitleHeight + 10; // Espacement après le bloc logo/titre

        // Ligne de séparation
        page.drawLine({
            start: { x: LEFT_COL_X, y: yOffset },
            end: { x: PADDING + innerWidth / 2 - 15, y: yOffset },
            color: LIGHT_GRAY,
            thickness: 0.5,
        });
        yOffset -= 15;

        // Détails de l'événement (date et lieu)
        page.drawText('20 - 21 Juin 2026 • Cotonou, Bénin', {
            x: LEFT_COL_X,
            y: yOffset,
            font: fontRegular,
            size: 12,
            color: GRAY,
        });
        yOffset -= 30;

        // Section "Détails du Participant"
        page.drawText('DÉTAILS DU PARTICIPANT', {
            x: LEFT_COL_X,
            y: yOffset,
            font: fontBold,
            size: 10,
            color: GRAY,
        });
        yOffset -= 15;
        page.drawText(`${registration.first_name} ${registration.last_name}`, {
            x: LEFT_COL_X,
            y: yOffset,
            font: fontBold,
            size: 16, // Réduction de la taille de la police de 20 à 16
            color: BLACK,
        });
        yOffset -= 18;
        page.drawText(registration.email, {
            x: LEFT_COL_X,
            y: yOffset,
            font: fontRegular,
            size: 11,
            color: GRAY,
        });
        if (registration.company) {
            yOffset -= 14;
            page.drawText(registration.company, {
                x: LEFT_COL_X,
                y: yOffset,
                font: fontRegular,
                size: 11,
                color: GRAY,
            });
        }
        yOffset -= 25;

        // Section "Type de Pass"
        page.drawText('TYPE DE PASS', {
            x: LEFT_COL_X,
            y: yOffset,
            font: fontBold,
            size: 10,
            color: GRAY,
        });
        yOffset -= 20;
        const passTypeText = registration.pass_type.replace('_', ' ').toUpperCase();
        const passTextWidth = fontBold.widthOfTextAtSize(passTypeText, 16);
        const passRectHeight = 25;
        page.drawRectangle({
            x: LEFT_COL_X,
            y: yOffset - 5,
            width: passTextWidth + 20,
            height: passRectHeight,
            color: BRAND_GREEN,
            borderWidth: 1,
            borderColor: BRAND_GREEN,
        });
        page.drawText(passTypeText, {
            x: LEFT_COL_X + 10,
            y: yOffset - 5 + (passRectHeight / 2) - (14 / 2), // Centre le texte dans le rectangle en utilisant la taille de police directe
            font: fontBold,
            size: 14,
            color: WHITE,
            // yAlignment est retiré car y est explicitement calculé
        });
        
        // Colonne de droite (QR Code)
        const qrSize = 150; 
        page.drawImage(qrImage, {
            x: RIGHT_COL_X + (COL_WIDTH / 2) - (qrSize / 2),
            y: height / 2 - qrSize / 2 + 20, // Centrer verticalement dans la colonne de droite
            width: qrSize,
            height: qrSize,
        });
        page.drawText('Scannez ce QR code à l\'entrée', {
            x: RIGHT_COL_X + (COL_WIDTH / 2),
            y: height / 2 - qrSize / 2 - 10,
            font: fontRegular,
            size: 9,
            color: GRAY,
            xAlignment: 'center',
        });

        // Ligne de séparation verticale
        page.drawLine({
            start: { x: width / 2, y: PADDING + 10 },
            end: { x: width / 2, y: height - PADDING - 10 },
            color: LIGHT_GRAY,
            thickness: 1,
            opacity: 0.7,
        });

        // Footer global
        page.drawText('Veuillez présenter ce ticket à l\'entrée.', {
            x: width / 2,
            y: PADDING + 15, // Position fixe en bas
            font: fontRegular,
            size: 10,
            color: GRAY,
            xAlignment: 'center',
        });
        page.drawText('© Africa Power Platform 2026', {
            x: width / 2,
            y: PADDING + 5, // Position fixe en bas
            font: fontLight,
            size: 8,
            color: GRAY,
            xAlignment: 'center',
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
        res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF.', error: error.message });
    }
});

module.exports = router;
