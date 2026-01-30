<?php
require_once 'db.php';
// The PDF generator is no longer needed here.

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));
$registration_id = null;

// Get the last part of the path
$last_part = end($path_parts);
if (is_numeric($last_part)) {
    $registration_id = (int)$last_part;
}

switch ($method) {
    case 'GET':
        if ($registration_id) {
            handle_get_ticket_data($mysqli, $registration_id); // Changed function call
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Registration ID is required for ticket data.']); // Changed message
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_get_ticket_data($mysqli, $registration_id) { // Changed function name
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

        // Return registration data as JSON
        http_response_code(200);
        echo json_encode($registration); // Return the actual registration data
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la récupération des données de ticket.', 'error' => $e->getMessage()]); // Changed message
    }
}

$mysqli->close();
?>