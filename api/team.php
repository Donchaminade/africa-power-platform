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
        $stmt = $mysqli->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $member = $result->fetch_assoc();
        if ($member) {
            echo json_encode($member);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Team member not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM team_members ORDER BY display_order ASC, name ASC");
        $members = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($members);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO team_members (name, role_fr, role_en, image_url, linkedin_url, twitter_url, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssii",
        $data['name'],
        $data['role_fr'],
        $data['role_en'],
        $data['image_url'],
        $data['linkedin_url'],
        $data['twitter_url'],
        $data['display_order'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating team member']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Team member ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE team_members SET name = ?, role_fr = ?, role_en = ?, image_url = ?, linkedin_url = ?, twitter_url = ?, display_order = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "ssssssiii",
        $data['name'],
        $data['role_fr'],
        $data['role_en'],
        $data['image_url'],
        $data['linkedin_url'],
        $data['twitter_url'],
        $data['display_order'],
        $data['is_active'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Team member not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating team member']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Team member ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM team_members WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Team member not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting team member']);
    }
    $stmt->close();
}

$mysqli->close();
?>
