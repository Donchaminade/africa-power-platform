<?php

require_once __DIR__ . '/fpdf/fpdf.php';
require_once __DIR__ . '/qrcode/qrlib.php'; // Include the QR code library

// Custom FPDF class to encapsulate common elements like colors and logo
class CustomFPDF extends FPDF {
    // Brand Colors (assuming RGB values from Node.js version)
    const BRAND_GREEN_R = 0;
    const BRAND_GREEN_G = 168;
    const BRAND_GREEN_B = 89; // #00A859
    const BRAND_YELLOW_R = 255;
    const BRAND_YELLOW_G = 215;
    const BRAND_YELLOW_B = 0; // #FFD700
    const BLACK_R = 26;
    const BLACK_G = 26;
    const BLACK_B = 26; // #1A1A1A (approx 0.1,0.1,0.1 from Node.js)
    const GRAY_R = 77;
    const GRAY_G = 77;
    const GRAY_B = 77;   // #4D4D4D (approx 0.3,0.3,0.3 from Node.js)
    const LIGHT_GRAY_R = 230;
    const LIGHT_GRAY_G = 230;
    const LIGHT_GRAY_B = 230; // #E6E6E6 (approx 0.9,0.9,0.9 from Node.js)
    const WHITE_R = 255;
    const WHITE_G = 255;
    const WHITE_B = 255; // #FFFFFF

    // Path to logo
    const LOGO_PATH = __DIR__ . '/../../public/assets/images/logo.png';
    const TEMP_QR_DIR = __DIR__ . '/tmp/'; // Temporary directory for QR codes

    function Header() {
        // Not used for the registration list, but can be customized later
    }

    function Footer() {
        // Page footer for multi-page documents
        $this->SetY(-15);
        $this->SetFont('Helvetica', 'I', 8);
        $this->SetTextColor(self::GRAY_R, self::GRAY_G, self::GRAY_B);
        $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }

    function removeTempFile($filepath) {
        if (file_exists($filepath)) {
            unlink($filepath);
        }
    }
}

function generatePdfForRegistrations($mysqli, $checkedInFilter = null) {
    try {
        $pdf = new CustomFPDF('L', 'mm', 'A4'); // Landscape A4
        $pdf->AliasNbPages();
        $pdf->AddPage();

        // Set common fonts and colors
        $pdf->SetTextColor(CustomFPDF::BLACK_R, CustomFPDF::BLACK_G, CustomFPDF::BLACK_B);

        // --- Header ---
        $pdf->SetFont('Helvetica', 'B', 20);
        $pdf->SetTextColor(CustomFPDF::BRAND_GREEN_R, CustomFPDF::BRAND_GREEN_G, CustomFPDF::BRAND_GREEN_B);
        $pdf->Cell(0, 10, utf8_decode('Liste des Inscriptions - Africa Power Platform 2026'), 0, 1, 'C');
        $pdf->Ln(5);
        $pdf->SetTextColor(CustomFPDF::BLACK_R, CustomFPDF::BLACK_G, CustomFPDF::BLACK_B); // Reset text color

        // --- Table Headers ---
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetFillColor(CustomFPDF::LIGHT_GRAY_R, CustomFPDF::LIGHT_GRAY_G, CustomFPDF::LIGHT_GRAY_B);
        $pdf->SetDrawColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->SetLineWidth(0.3);

        $header = ['ID', 'Nom', 'Email', 'Compagnie', 'Type de Pass', 'Date'];
        $column_widths = [15, 50, 65, 45, 40, 30]; // Adjusted for landscape A4 (approx 280mm width)

        $current_x = $pdf->GetX();
        foreach ($header as $i => $col) {
            $pdf->Cell($column_widths[$i], 7, utf8_decode($col), 1, 0, 'C', true);
        }
        $pdf->Ln();

        // --- Table Rows ---
        $pdf->SetFont('Helvetica', '', 9);
        $pdf->SetFillColor(255, 255, 255); // White background for rows

        $query = 'SELECT * FROM registrations';
        $params = [];
        $types = '';

        if ($checkedInFilter === 'true') {
            $query .= ' WHERE is_checked_in = 1';
        } elseif ($checkedInFilter === 'false') {
            $query .= ' WHERE is_checked_in = 0';
        }
        $query .= ' ORDER BY registration_date DESC';

        $result = $mysqli->query($query);
        $allRegistrations = $result->fetch_all(MYSQLI_ASSOC);

        foreach ($allRegistrations as $reg) {
            // Check for page break
            if ($pdf->GetY() + 7 > $pdf->PageBreakTrigger) {
                $pdf->AddPage('L', 'A4'); // Add new page, 'L' for landscape
                // Redraw table headers on new page
                $pdf->SetFont('Helvetica', 'B', 10);
                $pdf->SetFillColor(CustomFPDF::LIGHT_GRAY_R, CustomFPDF::LIGHT_GRAY_G, CustomFPDF::LIGHT_GRAY_B);
                $pdf->SetDrawColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
                foreach ($header as $i => $col) {
                    $pdf->Cell($column_widths[$i], 7, utf8_decode($col), 1, 0, 'C', true);
                }
                $pdf->Ln();
                $pdf->SetFont('Helvetica', '', 9);
                $pdf->SetFillColor(255, 255, 255);
            }

            $pass_type_display = str_replace('_', ' ', strtoupper($reg['pass_type']));
            $registration_date_formatted = (new DateTime($reg['registration_date']))->format('d/m/Y');

            $pdf->Cell($column_widths[0], 7, utf8_decode($reg['id']), 1, 0, 'C', true);
            $pdf->Cell($column_widths[1], 7, utf8_decode($reg['first_name'] . ' ' . $reg['last_name']), 1, 0, 'L', true);
            $pdf->Cell($column_widths[2], 7, utf8_decode($reg['email']), 1, 0, 'L', true);
            $pdf->Cell($column_widths[3], 7, utf8_decode($reg['company'] ?? 'N/A'), 1, 0, 'L', true);
            $pdf->Cell($column_widths[4], 7, utf8_decode($pass_type_display), 1, 0, 'C', true);
            $pdf->Cell($column_widths[5], 7, utf8_decode($registration_date_formatted), 1, 0, 'C', true);
            $pdf->Ln();
        }

        // Output the PDF
        $pdf->Output('D', 'registrations_export.pdf'); // D = download, I = inline
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la génération du PDF d\'exportation.', 'error' => $e->getMessage()]);
    }
}

// You might also need a function for ticket generation
function generateTicketPdf($mysqli, $registrationId, $registrationData) {
    // Create temporary directory for QR codes if it doesn't exist
    if (!is_dir(CustomFPDF::TEMP_QR_DIR)) {
        mkdir(CustomFPDF::TEMP_QR_DIR, 0777, true);
    }
    $qr_temp_file = CustomFPDF::TEMP_QR_DIR . 'qrcode_' . $registrationId . '.png';

    try {
        $pdf = new CustomFPDF('L', 'mm', array(210, 148)); // Landscape A5 size (roughly 210x148 mm), similar to 600x400 pts
        $pdf->AddPage();

        // 1. Fetch registration data if not already passed
        // (already passed as $registrationData for convenience, but keeping query for robustness)
        if (empty($registrationData)) {
            $stmt = $mysqli->prepare('SELECT * FROM registrations WHERE id = ?');
            $stmt->bind_param("i", $registrationId);
            $stmt->execute();
            $result = $stmt->get_result();
            $registration = $result->fetch_assoc();
            $stmt->close();

            if (!$registration) {
                throw new Exception('Inscription non trouvée.');
            }
        } else {
            $registration = $registrationData;
        }

        // 2. Create QR code content
        $qrContent = json_encode([
            'id' => $registration['id'],
            'name' => ($registration['first_name'] . ' ' . $registration['last_name']), // Removed utf8_decode here as json_encode handles UTF-8
            'email' => $registration['email'],
            'pass_type' => $registration['pass_type'],
            'event' => "Africa Power Platform 2026"
        ]);

        // 3. Generate QR code image to a temporary file
        QRcode::png($qrContent, $qr_temp_file, QR_ECLEVEL_H, 5, 2); // Increased size and margin for better quality

        // --- Design replication ---
        $width = $pdf->GetPageWidth();
        $height = $pdf->GetPageHeight();
        $padding = 7; // Approximately 25pt

        // Outer Rectangle
        $pdf->SetDrawColor(CustomFPDF::BRAND_GREEN_R, CustomFPDF::BRAND_GREEN_G, CustomFPDF::BRAND_GREEN_B);
        $pdf->SetLineWidth(0.8); // Approximately 3pt
        $pdf->Rect($padding, $padding, $width - 2 * $padding, $height - 2 * $padding, 'D');

        // Vertical Separator Line (halfway across the page)
        $pdf->SetDrawColor(CustomFPDF::LIGHT_GRAY_R, CustomFPDF::LIGHT_GRAY_G, CustomFPDF::LIGHT_GRAY_B);
        $pdf->SetLineWidth(0.3); // Approximately 1pt
        $pdf->Line($width / 2, $padding + 3, $width / 2, $height - $padding - 3);

        // --- Left Column (Textual Information) ---
        $left_col_x = $padding + 8; // Approximately PADDING + 30
        $right_col_x = $width / 2 + 8; // Approximately width / 2 + 30
        $col_width = $width / 2 - $padding - 8 - 5; // Adjusted width for left column

        $y_offset = $padding + 8; // Start from top after padding

        // Logo and Event Title
        $logo_height_mm = 15; // Adjusted for mm
        $logo_path = CustomFPDF::LOGO_PATH;
        if (file_exists($logo_path)) {
            $pdf->Image($logo_path, $left_col_x, $y_offset, 0, $logo_height_mm); // 0 for auto width
            
            // Calculate actual width of the logo image after scaling
            list($logo_original_width, $logo_original_height) = getimagesize($logo_path);
            $logo_actual_width = $logo_height_mm * ($logo_original_width / $logo_original_height);
            
            $text_start_x_after_logo = $left_col_x + $logo_actual_width + 2; // Position text next to logo
            
        } else {
            // Fallback if logo not found
            $text_start_x_after_logo = $left_col_x;
        }
        
        $pdf->SetFont('Helvetica', 'B', 18);
        $pdf->SetTextColor(CustomFPDF::BLACK_R, CustomFPDF::BLACK_G, CustomFPDF::BLACK_B);
        $pdf->Text($text_start_x_after_logo, $y_offset + 7, utf8_decode('AFRICA POWER PLATFORM'));

        $pdf->SetFont('Helvetica', 'B', 14);
        $pdf->SetTextColor(CustomFPDF::BRAND_GREEN_R, CustomFPDF::BRAND_GREEN_G, CustomFPDF::BRAND_GREEN_B);
        $pdf->Text($text_start_x_after_logo, $y_offset + 12, '2026');
        
        $y_offset += $logo_height_mm + 5; // Spacing after logo/title block
        $pdf->SetY($y_offset);

        // Separator Line
        $pdf->SetDrawColor(CustomFPDF::LIGHT_GRAY_R, CustomFPDF::LIGHT_GRAY_G, CustomFPDF::LIGHT_GRAY_B);
        $pdf->SetLineWidth(0.1);
        $pdf->Line($left_col_x, $y_offset, $width / 2 - 4, $y_offset);
        $pdf->Ln(5);
        $y_offset = $pdf->GetY();

        // Event Details (date and location)
        $pdf->SetFont('Helvetica', '', 12);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->Text($left_col_x, $y_offset, utf8_decode('20 - 21 Juin 2026 • Cotonou, Bénin'));
        $pdf->Ln(10);
        $y_offset = $pdf->GetY();

        // Section "Détails du Participant"
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->Text($left_col_x, $y_offset, utf8_decode('DÉTAILS DU PARTICIPANT'));
        $pdf->Ln(5);
        $y_offset = $pdf->GetY();

        $pdf->SetFont('Helvetica', 'B', 16);
        $pdf->SetTextColor(CustomFPDF::BLACK_R, CustomFPDF::BLACK_G, CustomFPDF::BLACK_B);
        $pdf->Text($left_col_x, $y_offset, utf8_decode($registration['first_name'] . ' ' . $registration['last_name']));
        $pdf->Ln(7);
        $y_offset = $pdf->GetY();

        $pdf->SetFont('Helvetica', '', 11);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->Text($left_col_x, $y_offset, utf8_decode($registration['email']));
        $pdf->Ln(5);
        $y_offset = $pdf->GetY();

        if (!empty($registration['company'])) {
            $pdf->Text($left_col_x, $y_offset, utf8_decode($registration['company']));
            $pdf->Ln(5);
            $y_offset = $pdf->GetY();
        }
        $pdf->Ln(8); // Extra spacing
        $y_offset = $pdf->GetY();

        // Section "Type de Pass"
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->Text($left_col_x, $y_offset, utf8_decode('TYPE DE PASS'));
        $pdf->Ln(5);
        $y_offset = $pdf->GetY();

        $passTypeText = str_replace('_', ' ', strtoupper($registration['pass_type']));
        $pdf->SetFont('Helvetica', 'B', 14);
        $passTextWidth = $pdf->GetStringWidth(utf8_decode($passTypeText));
        $passRectHeight = 8; // mm

        $pdf->SetFillColor(CustomFPDF::BRAND_GREEN_R, CustomFPDF::BRAND_GREEN_G, CustomFPDF::BRAND_GREEN_B);
        $pdf->SetDrawColor(CustomFPDF::BRAND_GREEN_R, CustomFPDF::BRAND_GREEN_G, CustomFPDF::BRAND_GREEN_B);
        $pdf->Rect($left_col_x, $y_offset - $passRectHeight + 1.5, $passTextWidth + 5, $passRectHeight, 'F'); // x, y, w, h, style
        
        $pdf->SetTextColor(CustomFPDF::WHITE_R, CustomFPDF::WHITE_G, CustomFPDF::WHITE_B);
        $pdf->Text($left_col_x + 2.5, $y_offset - $passRectHeight / 2 + 1.5 + $pdf->FontSize / 2.5, utf8_decode($passTypeText)); // Center text vertically, adjust 14/(2*$pdf->k) to $pdf->FontSize/2.5
        $pdf->SetTextColor(CustomFPDF::BLACK_R, CustomFPDF::BLACK_G, CustomFPDF::BLACK_B); // Reset text color

        // --- Right Column (QR Code) ---
        $qr_size_mm = 45; // Approximately 150pt
        $qr_x = $width / 2 + ($width / 2 - $padding - $qr_size_mm) / 2;
        $qr_y = $height / 2 - $qr_size_mm / 2 + 5; // Centered vertically in right column

        $pdf->Image($qr_temp_file, $qr_x, $qr_y, $qr_size_mm, $qr_size_mm, 'PNG');

        $pdf->SetFont('Helvetica', '', 9);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->SetXY($width / 2, $qr_y + $qr_size_mm + 3);
        $pdf->Cell($width / 2 - $padding, 5, utf8_decode('Scannez ce QR code à l\'entrée'), 0, 0, 'C');

        // --- Global Footer ---
        $pdf->SetFont('Helvetica', '', 10);
        $pdf->SetTextColor(CustomFPDF::GRAY_R, CustomFPDF::GRAY_G, CustomFPDF::GRAY_B);
        $pdf->SetXY($padding, $height - $padding + 2); // Position at bottom
        $pdf->Cell($width - 2 * $padding, 5, utf8_decode('Veuillez présenter ce ticket à l\'entrée.'), 0, 0, 'C');

        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetXY($padding, $height - $padding + 5); // Position below previous line
        $pdf->Cell($width - 2 * $padding, 5, utf8_decode('© Africa Power Platform 2026'), 0, 0, 'C');


        // Output the PDF
        $pdf->Output('D', 'ticket-' . $registration['id'] . '.pdf');

    } catch (Exception $e) {
        // Ensure no headers are sent before json_encode
        if (!headers_sent()) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur serveur lors de la génération du PDF.', 'error' => $e->getMessage()]);
        } else {
            error_log('PDF generation error: ' . $e->getMessage());
            echo 'An error occurred during PDF generation.';
        }
    } finally {
        // Clean up temporary QR code file
        if (file_exists($qr_temp_file)) {
            unlink($qr_temp_file);
        }
    }
}

?>
