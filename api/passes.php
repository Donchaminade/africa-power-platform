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
        $stmt = $mysqli->prepare("SELECT * FROM pass_types WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $pass = $result->fetch_assoc();
        if ($pass) {
            // Convert JSON strings to arrays
            $pass['features_fr'] = json_decode($pass['features_fr'] ?: '[]', true);
            $pass['features_en'] = json_decode($pass['features_en'] ?: '[]', true);
            echo json_encode($pass);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pass type not found']);
        }
        $stmt->close();
    } else {
        $all = isset($_GET['all']) && $_GET['all'] === 'true';
        $query = "SELECT * FROM pass_types";
        if (!$all) {
            $query .= " WHERE is_active = TRUE";
        }
        $query .= " ORDER BY display_order ASC";

        $result = $mysqli->query($query);
        $passes = $result->fetch_all(MYSQLI_ASSOC);

        // Convert JSON strings to arrays for all passes
        foreach ($passes as &$pass) {
            $pass['features_fr'] = json_decode($pass['features_fr'] ?: '[]', true);
            $pass['features_en'] = json_decode($pass['features_en'] ?: '[]', true);
        }
        echo json_encode($passes);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $features_fr_json = json_encode($data['features_fr'] ?? []);
    $features_en_json = json_encode($data['features_en'] ?? []);

    $stmt = $mysqli->prepare("INSERT INTO pass_types (name_fr, name_en, description_fr, description_en, price_fr, price_en, features_fr, features_en, is_active, display_order, tag_fr, tag_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssssisss",
        $data['name_fr'],
        $data['name_en'],
        $data['description_fr'],
        $data['description_en'],
        $data['price_fr'],
        $data['price_en'],
        $features_fr_json,
        $features_en_json,
        $data['is_active'],
        $data['display_order'],
        $data['tag_fr'],
        $data['tag_en']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating pass type']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Pass type ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $features_fr_json = json_encode($data['features_fr'] ?? []);
    $features_en_json = json_encode($data['features_en'] ?? []);

    $stmt = $mysqli->prepare("UPDATE pass_types SET name_fr = ?, name_en = ?, description_fr = ?, description_en = ?, price_fr = ?, price_en = ?, features_fr = ?, features_en = ?, is_active = ?, display_order = ?, tag_fr = ?, tag_en = ? WHERE id = ?");
    $stmt->bind_param(
        "ssssssssisssi",
        $data['name_fr'],
        $data['name_en'],
        $data['description_fr'],
        $data['description_en'],
        $data['price_fr'],
        $data['price_en'],
        $features_fr_json,
        $features_en_json,
        $data['is_active'],
        $data['display_order'],
        $data['tag_fr'],
        $data['tag_en'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pass type not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating pass type']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Pass type ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM pass_types WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pass type not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting pass type']);
    }
    $stmt->close();
}

$mysqli->close();
?>
