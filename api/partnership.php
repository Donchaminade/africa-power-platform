<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        handle_get($mysqli);
        break;
    case 'POST':
        handle_post($mysqli);
        break;
    case 'DELETE':
        handle_delete($mysqli, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handle_get($mysqli) {
    $result = $mysqli->query("SELECT * FROM partnership_requests ORDER BY submitted_at DESC");
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($requests);
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $company_name = $data['company_name'] ?? '';
    $contact_name = $data['contact_name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? null;
    $message = $data['message'] ?? null;

    if (empty($company_name) || empty($contact_name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['message' => 'Company name, contact name, and email are required.']);
        return;
    }

    $stmt = $mysqli->prepare("INSERT INTO partnership_requests (company_name, contact_name, email, phone, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssss",
        $company_name,
        $contact_name,
        $email,
        $phone,
        $message
    );

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['message' => 'Partnership request submitted successfully.', 'id' => $mysqli->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Error submitting partnership request.']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Partnership request ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM partnership_requests WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Request not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting partnership request']);
    }
    $stmt->close();
}

$mysqli->close();
?>
