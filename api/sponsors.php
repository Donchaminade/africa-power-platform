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
        $stmt = $mysqli->prepare("SELECT * FROM sponsors WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $sponsor = $result->fetch_assoc();
        if ($sponsor) {
            echo json_encode($sponsor);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Sponsor not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM sponsors ORDER BY tier ASC, display_order ASC, name ASC");
        $sponsors = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($sponsors);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO sponsors (name, logo_url, website_url, tier, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssii",
        $data['name'],
        $data['logo_url'],
        $data['website_url'],
        $data['tier'],
        $data['display_order'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating sponsor']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Sponsor ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE sponsors SET name = ?, logo_url = ?, website_url = ?, tier = ?, display_order = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "ssssiii",
        $data['name'],
        $data['logo_url'],
        $data['website_url'],
        $data['tier'],
        $data['display_order'],
        $data['is_active'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Sponsor not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating sponsor']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Sponsor ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM sponsors WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Sponsor not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting sponsor']);
    }
    $stmt->close();
}

$mysqli->close();
?>
