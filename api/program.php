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
        $stmt = $mysqli->prepare("SELECT * FROM program_items WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $item = $result->fetch_assoc();
        if ($item) {
            echo json_encode($item);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Program item not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM program_items ORDER BY day ASC, start_time ASC");
        $items = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($items);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO program_items (day, start_time, end_time, title_fr, title_en, description_fr, description_en, icon_class, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "isssssssi",
        $data['day'],
        $data['start_time'],
        $data['end_time'],
        $data['title_fr'],
        $data['title_en'],
        $data['description_fr'],
        $data['description_en'],
        $data['icon_class'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating program item']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Program item ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE program_items SET day = ?, start_time = ?, end_time = ?, title_fr = ?, title_en = ?, description_fr = ?, description_en = ?, icon_class = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "isssssssii",
        $data['day'],
        $data['start_time'],
        $data['end_time'],
        $data['title_fr'],
        $data['title_en'],
        $data['description_fr'],
        $data['description_en'],
        $data['icon_class'],
        $data['is_active'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Program item not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating program item']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Program item ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM program_items WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Program item not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting program item']);
    }
    $stmt->close();
}

$mysqli->close();
?>
