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
    $limit = $_GET['limit'] ?? null;
    $all = isset($_GET['all']) && $_GET['all'] === 'true';

    $query = 'SELECT * FROM newsletter_subscribers';
    $params = [];
    $types = '';

    if (!$all) {
        $query .= ' WHERE is_active = TRUE';
    }

    $query .= ' ORDER BY subscribed_at DESC';

    if ($limit && is_numeric($limit)) {
        $query .= ' LIMIT ?';
        $params[] = (int)$limit;
        $types .= 'i';
    }

    $stmt = $mysqli->prepare($query);
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $subscribers = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    echo json_encode($subscribers);
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is required']);
        return;
    }

    $stmt = $mysqli->prepare(
        'INSERT INTO newsletter_subscribers (email, is_active) VALUES (?, TRUE) ON DUPLICATE KEY UPDATE is_active = TRUE'
    );
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['id' => $mysqli->insert_id, 'email' => $email]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error subscribing to newsletter']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Subscriber ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM newsletter_subscribers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Subscriber not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting subscriber']);
    }
    $stmt->close();
}

$mysqli->close();
?>
