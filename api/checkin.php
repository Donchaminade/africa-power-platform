<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : null;

switch ($method) {
    case 'POST':
        // The checkin POST request is to /checkin/{id}, which .htaccess maps to checkin.php?id={id}
        if ($id) {
            handle_post_checkin($mysqli, $id);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Endpoint not found or Registration ID missing for POST']);
        }
        break;
    case 'GET':
        // The history GET request is to /checkin/history, which .htaccess maps to checkin.php?endpoint=history
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
        // Check if the registration exists and is not already checked in
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

        // Update check-in status
        $stmt_update = $mysqli->prepare('UPDATE registrations SET is_checked_in = TRUE, check_in_time = NOW() WHERE id = ?');
        $stmt_update->bind_param("i", $id);
        $stmt_update->execute();

        if ($stmt_update->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(['message' => "Check-in réussi pour " . $registration['first_name'] . " " . $registration['last_name'] . "."]);
        } else {
            // This case is unlikely if the previous SELECT worked, but good for robustness
            http_response_code(404);
            echo json_encode(['message' => 'Échec de la mise à jour du check-in (inscription introuvable).']);
        }
        $stmt_update->close();

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
        header('Content-Type: application/json');
        echo json_encode($checkedInRegistrations);
    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Erreur serveur lors de la récupération de l\'historique des check-in.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();