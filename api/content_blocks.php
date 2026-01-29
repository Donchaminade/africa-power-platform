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
    case 'PUT':
        handle_put($mysqli, $id);
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
    if ($id) {
        $stmt = $mysqli->prepare("SELECT * FROM content_blocks WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $block = $result->fetch_assoc();
        if ($block) {
            echo json_encode($block);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Content block not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM content_blocks");
        $blocks = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($blocks);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO content_blocks (block_key, display_name, content_fr, content_en, page_section) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssss",
        $data['block_key'],
        $data['display_name'],
        $data['content_fr'],
        $data['content_en'],
        $data['page_section']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating content block']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Content block ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE content_blocks SET block_key = ?, display_name = ?, content_fr = ?, content_en = ?, page_section = ? WHERE id = ?");
    $stmt->bind_param(
        "sssssi",
        $data['block_key'],
        $data['display_name'],
        $data['content_fr'],
        $data['content_en'],
        $data['page_section'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Content block not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating content block']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Content block ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM content_blocks WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Content block not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting content block']);
    }
    $stmt->close();
}

$mysqli->close();
?>
