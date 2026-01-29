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
        $stmt = $mysqli->prepare("SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT id, name, email, role, is_active, created_at FROM users ORDER BY name ASC");
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($users);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Password is required.']);
        return;
    }

    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

    $stmt = $mysqli->prepare("INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssi",
        $data['name'],
        $data['email'],
        $password_hash,
        $data['role'],
        $data['is_active'] ?? 1
    );

    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        http_response_code(201);
        unset($data['password']); // Don't return password
        echo json_encode(['id' => $new_id] + $data);
    } else {
        // Handle duplicate email error
        if ($mysqli->errno == 1062) { // MySQL error code for duplicate entry
            http_response_code(409);
            echo json_encode(['error' => 'This email is already in use.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error creating user']);
        }
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $password_hash = null;
    if (isset($data['password']) && !empty($data['password'])) {
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    $query = "UPDATE users SET name = ?, email = ?, role = ?, is_active = ?";
    $types = "sssi";
    $params = [
        $data['name'],
        $data['email'],
        $data['role'],
        $data['is_active'] ?? 1
    ];

    if ($password_hash) {
        $query .= ", password_hash = ?";
        $types .= "s";
        $params[] = $password_hash;
    }

    $query .= " WHERE id = ?";
    $types .= "i";
    $params[] = $id;

    $stmt = $mysqli->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'User updated successfully.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    } else {
        if ($mysqli->errno == 1062) { // MySQL error code for duplicate entry
            http_response_code(409);
            echo json_encode(['error' => 'This email is already in use.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error updating user']);
        }
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }

    // Check if it's the last user
    $result = $mysqli->query("SELECT COUNT(*) as count FROM users");
    $row = $result->fetch_assoc();
    if ($row['count'] <= 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot delete the last user.']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting user']);
    }
    $stmt->close();
}

$mysqli->close();
?>
