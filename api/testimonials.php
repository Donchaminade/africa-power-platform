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
        $stmt = $mysqli->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $testimonial = $result->fetch_assoc();
        if ($testimonial) {
            echo json_encode($testimonial);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Testimonial not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM testimonials ORDER BY display_order ASC, author_name ASC");
        $testimonials = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($testimonials);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $mysqli->prepare("INSERT INTO testimonials (author_name, author_title_fr, author_title_en, author_image_url, quote_fr, quote_en, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssii",
        $data['author_name'],
        $data['author_title_fr'],
        $data['author_title_en'],
        $data['author_image_url'],
        $data['quote_fr'],
        $data['quote_en'],
        $data['display_order'],
        $data['is_active']
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        echo json_encode(['id' => $new_id] + $data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error creating testimonial']);
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Testimonial ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("UPDATE testimonials SET author_name = ?, author_title_fr = ?, author_title_en = ?, author_image_url = ?, quote_fr = ?, quote_en = ?, display_order = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "ssssssiii",
        $data['author_name'],
        $data['author_title_fr'],
        $data['author_title_en'],
        $data['author_image_url'],
        $data['quote_fr'],
        $data['quote_en'],
        $data['display_order'],
        $data['is_active'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Testimonial not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating testimonial']);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Testimonial ID is required']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM testimonials WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Testimonial not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting testimonial']);
    }
    $stmt->close();
}

$mysqli->close();
?>
