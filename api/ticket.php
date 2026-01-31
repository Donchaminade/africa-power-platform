<?php
require_once 'db.php';
require_once 'phpqrcode/qrlib.php';
require_once '../fpdf186/fpdf.php';

/**
 * Custom PDF class to handle UTF-8 encoding automatically.
 * FPDF expects ISO-8859-1, so we convert text from UTF-8.
 */
class PDF extends FPDF {
    // Override the Cell method to handle UTF-8 text
    function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='') {
        $converted_txt = mb_convert_encoding($txt, 'ISO-8859-1', 'UTF-8');
        parent::Cell($w, $h, $converted_txt, $border, $ln, $align, $fill, $link);
    }
}

// Ensure we have an ID and it's an integer
$registration_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($registration_id <= 0) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'A valid Registration ID is required.']);
    exit();
}

try {
    // 1. Fetch site settings
    $settings = [];
    $keys = ['event_title', 'event_date_location', 'event_logo_url'];
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    
    $stmt_settings = $mysqli->prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ($placeholders)");
    $stmt_settings->bind_param(str_repeat('s', count($keys)), ...$keys);
    $stmt_settings->execute();
    $result_settings = $stmt_settings->get_result();
    
    while ($row = $result_settings->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    $stmt_settings->close();

    $event_title = $settings['event_title'] ?? 'AFRICA POWER PLATFORM 2026';
    $event_date_location = $settings['event_date_location'] ?? '20 - 21 Juin 2026 | Cotonou, Bénin';
    $logo_image_url = $settings['event_logo_url'] ?? '/assets/images/logo.png';

    // 2. Fetch registration data
    $stmt_reg = $mysqli->prepare('SELECT * FROM registrations WHERE id = ?');
    $stmt_reg->bind_param("i", $registration_id);
    $stmt_reg->execute();
    $result_reg = $stmt_reg->get_result();
    $registration = $result_reg->fetch_assoc();
    $stmt_reg->close();

    if (!$registration) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Registration not found.']);
        exit();
    }

    // 3. Prepare and generate QR code
    $qr_content = json_encode([
        'id' => $registration['id'],
        'first_name' => $registration['first_name'],
        'last_name' => $registration['last_name'],
        'email' => $registration['email'],
        'pass_type' => $registration['pass_type'],
        'event' => $event_title
    ]);

    $PNG_TEMP_DIR = dirname(__FILE__) . '/phpqrcode/temp/';
    if (!file_exists($PNG_TEMP_DIR)) {
        mkdir($PNG_TEMP_DIR, 0777, true);
    }
    $qr_filename = $PNG_TEMP_DIR . 'qr_registration_' . $registration_id . '.png';
    QRcode::png($qr_content, $qr_filename, QR_ECLEVEL_H, 10, 2);

    // 4. Generate PDF using the custom PDF class
    $pdf = new PDF('L', 'mm', 'A5');
    $pdf->AddPage();
    $pdf->SetAutoPageBreak(false);
    $pdf->SetMargins(10, 10, 10);

    $logo_path = realpath(dirname(dirname(__FILE__)) . '/public' . $logo_image_url);
    if ($logo_path) {
        $pdf->Image($logo_path, 10, 10, 20);
        $pdf->SetY(15);
    }

    // -- PDF Header --
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->SetTextColor(0, 168, 89);
    $pdf->Cell(0, 10, $event_title, 0, 1, 'C');
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(77, 77, 77);
    $pdf->Cell(0, 7, $event_date_location, 0, 1, 'C');
    $pdf->Ln(5);

    $pdf->SetDrawColor(230, 230, 230);
    $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
    $pdf->Ln(5);

    // -- Participant Details --
    $pdf->SetFont('Arial', 'B', 12);
    $pdf->SetTextColor(26, 26, 26);
    $pdf->Cell(0, 8, 'Ticket d\'accès', 0, 1, 'C');
    $pdf->Ln(5);

    $details = [
        'Nom' => $registration['first_name'] . ' ' . $registration['last_name'],
        'Email' => $registration['email'],
        'Entreprise' => $registration['company'] ?: 'N/A',
        'Type de Pass' => str_replace('_', ' ', strtoupper($registration['pass_type'])),
    ];

    foreach ($details as $label => $value) {
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetTextColor(77, 77, 77);
        $pdf->Cell(40, 7, $label . ':', 0, 0);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetTextColor($label === 'Type de Pass' ? 0 : 26, $label === 'Type de Pass' ? 168 : 26, $label === 'Type de Pass' ? 89 : 26);
        $pdf->Cell(0, 7, $value, 0, 1);
    }
    $pdf->Ln(5);

    // -- QR Code --
    $pdf->Image($qr_filename, (210 / 2) - (40 / 2), $pdf->GetY(), 40, 40, 'PNG');
    $pdf->Ln(45);

    $pdf->SetFont('Arial', '', 8);
    $pdf->SetTextColor(77, 77, 77);
    $pdf->Cell(0, 5, 'Scannez ce QR code à l\'entrée pour le check-in.', 0, 1, 'C');

    // -- Footer --
    $pdf->SetY(-15);
    $pdf->SetFont('Arial', 'I', 8);
    $pdf->SetTextColor(150, 150, 150);
    $pdf->Cell(0, 10, 'Veuillez présenter ce ticket à l\'entrée. © Africa Power Platform 2026', 0, 0, 'C');

    unlink($qr_filename);
    $pdf->Output('I', 'ticket_APP_' . $registration['id'] . '.pdf');

} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    error_log('Error generating ticket: ' . $e->getMessage());
    echo json_encode(['message' => 'Error generating ticket. Please contact support.']);
}



$mysqli->close();