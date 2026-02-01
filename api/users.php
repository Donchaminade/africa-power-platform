<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = null;

// Extract ID from URI for GET, PUT, DELETE operations
// Assuming URI format is /api/users/{id}
if (isset($request_uri[count($request_uri) - 1]) && is_numeric($request_uri[count($request_uri) - 1])) {
    $id = (int)$request_uri[count($request_uri) - 1];
}

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
            $user['is_active'] = (bool)$user['is_active']; // Explicitly cast to boolean
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT id, name, email, role, is_active, created_at FROM users ORDER BY name ASC");
        $users = $result->fetch_all(MYSQLI_ASSOC);
        foreach ($users as &$user_item) { // Use & to modify array elements by reference
            $user_item['is_active'] = (bool)$user_item['is_active']; // Explicitly cast to boolean
        }
        echo json_encode($users);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Debugging: Log data received
    error_log("handle_post (users): Received data: " . json_encode($data));

    if (!isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Password is required.']);
        return;
    }

    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

    $is_active = $data['is_active'] ?? 1; // Default to 1 if not provided
    error_log("handle_post (users): is_active value before bind: " . var_export($is_active, true));

    $stmt = $mysqli->prepare("INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        error_log("Prepare failed (users): " . $mysqli->error);
        throw new Exception("Prepare failed (users): " . $mysqli->error);
    }
    $active_status_int = (int)$is_active; // Store the cast value in a variable
    $stmt->bind_param(
        "ssssi",
        $data['name'],
        $data['email'],
        $password_hash,
        $data['role'],
        $active_status_int // Pass the variable by reference
    ); 
    if ($stmt->execute()) {
        $new_id = $mysqli->insert_id;
        error_log("User inserted successfully with ID: " . $new_id); // Log success
        http_response_code(201);
        unset($data['password']); // Don't return password
        echo json_encode(['id' => $new_id] + $data);
    } 
    else {
        // Handle duplicate email error
        if ($mysqli->errno == 1062) { // MySQL error code for duplicate entry
            error_log("Duplicate email error (users): " . $data['email']);
            http_response_code(409);
            echo json_encode(['error' => 'This email is already in use.']);
        } else {
            error_log("Execute failed (users): " . $stmt->error); // Log execute error
            http_response_code(500);
            echo json_encode(['error' => 'Error creating user']);
        }
    }
    $stmt->close();
}

function handle_put($mysqli, $id) {
    // Debugging: Log entry point
    error_log("handle_put (users): Processing user ID: " . $id);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    // Debugging: Log data received
    error_log("handle_put (users): Received data: " . json_encode($data));

    $password_hash = null;
    if (isset($data['password']) && !empty($data['password'])) {
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    // Ensure is_active is 0 or 1
    // If it's a checkbox, it might not be present in $data if unchecked, or be 'false' string
    // Refined handling for is_active
    $is_active_val = 0; // Default to inactive if not explicitly set or not true
    if (isset($data['is_active'])) {
        // Explicitly check for values that indicate 'active'
        if ($data['is_active'] === true || $data['is_active'] === 1 || $data['is_active'] === '1' || $data['is_active'] === 'true') {
            $is_active_val = 1;
        }
    }
    error_log("handle_put (users): is_active value to be set: " . $is_active_val);


    $query = "UPDATE users SET name = ?, email = ?, role = ?, is_active = ?";
    $types = "sssi";
    $params = [
        $data['name'],
        $data['email'],
        $data['role'],
        $is_active_val // Use the correctly parsed value
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
    if (!$stmt) {
        error_log("Prepare failed (users PUT): " . $mysqli->error);
        http_response_code(500); // Send error response
        echo json_encode(['error' => 'Prepare failed: ' . $mysqli->error]);
        return; // Exit
    }

    // Dynamically bind parameters using splat operator for $params array
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        error_log("User updated successfully (users PUT) for ID: " . $id);
        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'User updated successfully.']);
        } else {
            // This case happens if no data was actually changed, still a success
            error_log("User update successful, but no rows affected for ID: " . $id . " (Data might be identical)");
            echo json_encode(['message' => 'User data is identical, no changes made.']); // More informative message
        }
    } else {
        if ($mysqli->errno == 1062) { // MySQL error code for duplicate entry
            error_log("Duplicate email error (users PUT): " . $data['email']);
            http_response_code(409);
            echo json_encode(['error' => 'This email is already in use.']);
        } else {
            error_log("Execute failed (users PUT): " . $stmt->error); // Log execute error
            http_response_code(500);
            echo json_encode(['error' => 'Error updating user: ' . $stmt->error]); // Include stmt error
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
