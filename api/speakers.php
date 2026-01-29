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
        $stmt = $mysqli->prepare("SELECT * FROM speakers WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $speaker = $result->fetch_assoc();
        if ($speaker) {
            echo json_encode($speaker);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Speaker not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM speakers ORDER BY display_order ASC, name ASC");
        $speakers = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($speakers);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO speakers (name, title_fr, title_en, category_fr, category_en, image_url, twitter_url, linkedin_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssssii",
        $data['name'],
        $data['title_fr'],
        $data['title_en'],
        $data['category_fr'],
        $data['category_en'],
        $data['image_url'],
        $data['twitter_url'],
        $data['linkedin_url'],
        $data['display_order'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating speaker']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Speaker ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE speakers SET name = ?, title_fr = ?, title_en = ?, category_fr = ?, category_en = ?, image_url = ?, twitter_url = ?, linkedin_url = ?, is_active = ?, display_order = ? WHERE id = ?");
    $stmt->bind_param(
        "ssssssssiii",
        $data['name'],
        $data['title_fr'],
        $data['title_en'],
        $data['category_fr'],
        $data['category_en'],
        $data['image_url'],
        $data['twitter_url'],
        $data['linkedin_url'],
        $data['is_active'],
        $data['display_order'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Speaker not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating speaker']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Speaker ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM speakers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Speaker not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting speaker']);
    }
    $stmt->close();
}

$mysqli->close();
?>
