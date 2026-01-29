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
        $stmt = $mysqli->prepare("SELECT * FROM faq WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $faq = $result->fetch_assoc();
        if ($faq) {
            echo json_encode($faq);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'FAQ not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM faq ORDER BY display_order ASC, category ASC");
        $faqs = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($faqs);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO faq (question_fr, question_en, answer_fr, answer_en, category, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssis",
        $data['question_fr'],
        $data['question_en'],
        $data['answer_fr'],
        $data['answer_en'],
        $data['category'],
        $data['display_order'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating FAQ']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'FAQ ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE faq SET question_fr = ?, question_en = ?, answer_fr = ?, answer_en = ?, category = ?, display_order = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "sssssiii",
        $data['question_fr'],
        $data['question_en'],
        $data['answer_fr'],
        $data['answer_en'],
        $data['category'],
        $data['display_order'],
        $data['is_active'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'FAQ not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating FAQ']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'FAQ ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM faq WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'FAQ not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting FAQ']);
    }
    $stmt->close();
}

$mysqli->close();
?>
