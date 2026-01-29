<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        handle_get($mysqli, $id);
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

function handle_get($mysqli, $id) {
    // Contact messages API does not typically support GET by ID, but fetches all
    // or provides a specific filter. Node.js version only has GET all.
    $result = $mysqli->query("SELECT * FROM contact_messages ORDER BY id DESC");
    $messages = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($messages);
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $subject = $data['subject'] ?? '';
    $message = $data['message'] ?? '';

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        return;
    }

    $stmt = $mysqli->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param(
        "ssss",
        $name,
        $email,
        $subject,
        $message
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error submitting contact message']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Contact message ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM contact_messages WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Message not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting contact message']);
    }
    $stmt->close();
}

$mysqli->close();
?>
