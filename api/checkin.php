<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$endpoint = $request_uri[count($request_uri) - 1]; // e.g., 'checkin', 'history'
$id = null;

// Determine if it's checkin/:id
if ($endpoint === 'checkin' && isset($request_uri[count($request_uri) - 1]) && is_numeric($request_uri[count($request_uri) - 1])) {
    $id = (int)$request_uri[count($request_uri) - 1];
    $endpoint = 'checkin'; // Reset endpoint to checkin for logic
} elseif ($endpoint === 'history') {
    $endpoint = 'history';
}


switch ($method) {
    case 'POST':
        if ($endpoint === 'checkin' && $id) {
            handle_post_checkin($mysqli, $id);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint not found or ID missing for POST']);
        }
        break;
    case 'GET':
        if ($endpoint === 'history') {
            handle_get_history($mysqli);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint not found for GET']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_post_checkin($mysqli, $id) {
    try {
        // Vérifier si l'inscription existe et n'a pas déjà été check-in
        $stmt = $mysqli->prepare("SELECT id, is_checked_in, first_name, last_name FROM registrations WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $registration = $result->fetch_assoc();
        $stmt->close();

        if (!$registration) {
            http_response_code(404);
            echo json_encode(['message' => 'Inscription non trouvée.']);
            return;
        }
        if ($registration['is_checked_in']) {
            http_response_code(409);
            echo json_encode(['message' => "Le participant " . $registration['first_name'] . " " . $registration['last_name'] . " est déjà enregistré."]);
            return;
        }

        // Mettre à jour le statut de check-in
        $stmt = $mysqli->prepare(
            'UPDATE registrations SET is_checked_in = TRUE, check_in_time = NOW() WHERE id = ?'
        );
        $stmt->bind_param("i", $id);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Échec de la mise à jour du check-in (inscription introuvable).']);
        } else {
            http_response_code(200);
            echo json_encode(['message' => "Check-in réussi pour " . $registration['first_name'] . " " . $registration['last_name'] . "."]);
        }
        $stmt->close();

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors du check-in.', 'error' => $e->getMessage()]);
    }
}

function handle_get_history($mysqli) {
    try {
        $result = $mysqli->query(
            'SELECT id, first_name, last_name, email, pass_type, check_in_time FROM registrations WHERE is_checked_in = TRUE ORDER BY check_in_time DESC'
        );
        $checkedInRegistrations = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($checkedInRegistrations);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la récupération de l\'historique des check-in.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
