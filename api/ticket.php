<?php
require_once 'db.php';
require_once 'pdf_generator.php'; // Will contain PDF generation functions

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$registration_id = null;

// The Node.js route is /api/ticket/:registrationId
if (isset($request_uri[count($request_uri) - 1]) && is_numeric($request_uri[count($request_uri) - 1])) {
    $registration_id = (int)$request_uri[count($request_uri) - 1];
}

switch ($method) {
    case 'GET':
        if ($registration_id) {
            handle_get_ticket_pdf($mysqli, $registration_id);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Registration ID is required for ticket generation.']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_get_ticket_pdf($mysqli, $registration_id) {
    try {
        // 1. Récupérer les données de l'inscription
        $stmt = $mysqli->prepare('SELECT * FROM registrations WHERE id = ?');
        $stmt->bind_param("i", $registration_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $registration = $result->fetch_assoc();
        $stmt->close();

        if (!$registration) {
            http_response_code(404);
            echo json_encode(['message' => 'Inscription non trouvée.']);
            return;
        }

        // Placeholder for PDF generation
        // The actual PDF generation will be handled by a PHP PDF library
        // and its logic will be encapsulated in pdf_generator.php
        generateTicketPdf($mysqli, $registration_id, $registration); // Pass registration data
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la génération du PDF.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
