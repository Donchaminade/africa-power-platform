import { PDFDocument, rgb, StandardFonts, PNG, JPG } from 'pdf-lib';
// import qrcode from 'qrcode'; // This is the Node.js qrcode library, can generate SVG or Data URLs
import axios from 'axios';
import { API_URL } from '../../utils/config'; // Use the main config for API_URL

// Define colors based on the PHP /FPDF constants
const BRAND_GREEN = rgb(0 / 255, 168 / 255, 89 / 255); // #00A859
const BLACK = rgb(26 / 255, 26 / 255, 26 / 255);       // #1A1A1A
const GRAY = rgb(77 / 255, 77 / 255, 77 / 255);         // #4D4D4D
const LIGHT_GRAY = rgb(230 / 255, 230 / 255, 230 / 255); // #E6E6E6
const WHITE = rgb(1, 1, 1);                            // #FFFFFF

interface RegistrationData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  pass_type: string;
  registration_date: string;
}

export async function generateClientSideTicketPdf(registrationId: number) {
    try {
        // 1. Fetch ticket data from the new PHP endpoint
        const response = await axios.get(`${API_URL}/ticket_data.php?id=${registrationId}`);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch ticket data: ${response.statusText}`);
        }
        const registration: RegistrationData = response.data;

        // 2. Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        
        // A5 size in points (1mm = 2.83465 points) - Landscape
        const PAGE_WIDTH = 210 * 2.83465; // ~595.275 points
        const PAGE_HEIGHT = 148 * 2.83465; // ~419.528 points
        
        const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        const { width, height } = page.getSize();

        // Embed fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

        // Define layout constants
        const PADDING = 25; // Padding from edges (approx 7mm)
        const OUTER_BORDER_WIDTH = 0.8 * 2.83465; // 0.8mm converted to points (~2.26pt)
        const INNER_LINE_WIDTH = 0.3 * 2.83465; // 0.3mm converted to points (~0.85pt)
        
        const HALF_WIDTH = width / 2;
        const LEFT_COL_X = PADDING;
        const RIGHT_COL_X = HALF_WIDTH + PADDING;

        // --- Outer Border (Brand Green) ---
        page.drawRectangle({
            x: PADDING,
            y: PADDING,
            width: width - 2 * PADDING,
            height: height - 2 * PADDING,
            borderColor: BRAND_GREEN,
            borderWidth: OUTER_BORDER_WIDTH,
        });

        // --- Vertical Separator Line (Light Gray) ---
        page.drawLine({
            start: { x: HALF_WIDTH, y: PADDING + 10 },
            end: { x: HALF_WIDTH, y: height - PADDING - 10 },
            color: LIGHT_GRAY,
            thickness: INNER_LINE_WIDTH,
        });

        let yOffset = height - PADDING - 20; // Starting Y for content

        // --- Left Column Content ---

        // Logo
        // You would typically fetch the logo from your server or embed it directly if small.
        // For simplicity, let's assume a placeholder for now, or embed a base64 version.
        // For production, you'd fetch it as a base64 string or an image file and embed.
        const logoUrl = '/assets/images/logo.png'; // Path relative to public folder
        let logoImage = null;
        try {
            // Fetch the image as a base64 string or ArrayBuffer
            // Note: In a real browser environment, `axios.get(url, { responseType: 'arraybuffer' })` might be needed
            // if the image is not hosted on the same domain or requires specific headers.
            const logoResponse = await fetch(logoUrl);
            const logoBytes = await logoResponse.arrayBuffer();
            if (logoUrl.endsWith('.png')) {
                logoImage = await pdfDoc.embedPng(logoBytes);
            } else if (logoUrl.endsWith('.jpg') || logoUrl.endsWith('.jpeg')) {
                logoImage = await pdfDoc.embedJpg(logoBytes);
            }
        } catch (e) {
            console.error("Failed to load logo image:", e);
            // Handle logo loading error - maybe draw a placeholder text
        }

        const LOGO_HEIGHT = 15; // mm, ~42.5pt
        let logoWidth = 0;
        if (logoImage) {
            const logoDims = logoImage.scale(LOGO_HEIGHT);
            logoWidth = logoDims.width;
            page.drawImage(logoImage, {
                x: LEFT_COL_X + 5,
                y: yOffset - LOGO_HEIGHT,
                width: logoDims.width,
                height: logoDims.height,
            });
        }
        
        const TEXT_AFTER_LOGO_X = LEFT_COL_X + (logoWidth > 0 ? logoWidth + 7 : 0); // Position text after logo

        // Event Title
        page.drawText('AFRICA POWER PLATFORM', { x: TEXT_AFTER_LOGO_X, y: yOffset - LOGO_HEIGHT / 2 + 5, font: fontBold, size: 18, color: BLACK });
        page.drawText('2026', { x: TEXT_AFTER_LOGO_X, y: yOffset - LOGO_HEIGHT / 2 - 5, font: fontBold, size: 14, color: BRAND_GREEN });
        yOffset -= LOGO_HEIGHT + 20;

        // Separator Line
        page.drawLine({ start: { x: LEFT_COL_X, y: yOffset }, end: { x: HALF_WIDTH - PADDING / 2, y: yOffset }, color: LIGHT_GRAY, thickness: 0.5 });
        yOffset -= 15;

        // Event Details
        page.drawText('20 - 21 Juin 2026 • Cotonou, Bénin', { x: LEFT_COL_X, y: yOffset, font: font, size: 12, color: GRAY });
        yOffset -= 30;

        // Participant Details Section
        page.drawText('DÉTAILS DU PARTICIPANT', { x: LEFT_COL_X, y: yOffset, font: fontBold, size: 10, color: GRAY });
        yOffset -= 15;
        page.drawText(`${registration.first_name} ${registration.last_name}`, { x: LEFT_COL_X, y: yOffset, font: fontBold, size: 16, color: BLACK });
        yOffset -= 10;
        page.drawText(registration.email, { x: LEFT_COL_X, y: yOffset, font: font, size: 11, color: GRAY });
        if (registration.company) {
            yOffset -= 10;
            page.drawText(registration.company, { x: LEFT_COL_X, y: yOffset, font: font, size: 11, color: GRAY });
        }
        yOffset -= 25;

        // Pass Type Section
        page.drawText('TYPE DE PASS', { x: LEFT_COL_X, y: yOffset, font: fontBold, size: 10, color: GRAY });
        yOffset -= 15;

        const passTypeText = registration.pass_type.replace('_', ' ').toUpperCase();
        const passTypeFontSize = 14;
        const passTypeTextWidth = fontBold.widthOfText(passTypeText, passTypeFontSize);
        const passRectPadding = 10;
        const passRectHeight = passTypeFontSize + 10;

        page.drawRectangle({
            x: LEFT_COL_X,
            y: yOffset - passTypeFontSize / 2 - passRectPadding / 2,
            width: passTypeTextWidth + passRectPadding,
            height: passRectHeight,
            color: BRAND_GREEN,
            borderColor: BRAND_GREEN,
            borderWidth: 1,
        });
        page.drawText(passTypeText, {
            x: LEFT_COL_X + passRectPadding / 2,
            y: yOffset - passTypeFontSize / 2 + 1, // Adjust for vertical centering
            font: fontBold,
            size: passTypeFontSize,
            color: WHITE,
        });

        // --- Right Column Content (QR Code) ---

        // QR Code
        const qrContent = JSON.stringify({
            id: registration.id,
            name: `${registration.first_name} ${registration.last_name}`,
            email: registration.email,
            pass_type: registration.pass_type,
            event: "Africa Power Platform 2026"
        });

        // const qrCodeDataUrl = await qrcode.toDataURL(qrContent, { errorCorrectionLevel: 'H', type: 'image/png', margin: 2 });
        // const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

        // const QR_SIZE = 120; // in points (~42.3mm)
        // const qrX = HALF_WIDTH + (HALF_WIDTH - PADDING - QR_SIZE) / 2; // Center in right column
        // const qrY = height / 2 - QR_SIZE / 2;

        // page.drawImage(qrImage, {
        //     x: qrX,
        //     y: qrY,
        //     width: QR_SIZE,
        //     height: QR_SIZE,
        // });

        // QR Code Instruction
        page.drawText('Scannez ce QR code à l\'entrée', {
            x: HALF_WIDTH + PADDING,
            y: qrY - 20,
            font: fontItalic,
            size: 9,
            color: GRAY,
            width: HALF_WIDTH - 2 * PADDING,
            align: 'center',
        });

        // --- Global Footer ---
        page.drawText('Veuillez présenter ce ticket à l\'entrée.', {
            x: PADDING,
            y: PADDING / 2 + 10,
            font: font,
            size: 10,
            color: GRAY,
            width: width - 2 * PADDING,
            align: 'center',
        });
        page.drawText('© Africa Power Platform 2026', {
            x: PADDING,
            y: PADDING / 2,
            font: font,
            size: 8,
            color: GRAY,
            width: width - 2 * PADDING,
            align: 'center',
        });

        // 3. Save the PDF and trigger download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const urlBlob = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `ticket-${registration.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlBlob); // Clean up the URL

    } catch (error) {
        console.error("Error generating client-side ticket PDF:", error);
        throw new Error("Failed to generate ticket PDF. Please try again.");
    }
}
