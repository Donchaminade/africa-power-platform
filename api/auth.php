<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handle_post_login($mysqli);
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_post_login($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Email and password are required.']);
        return;
    }

    try {
        $stmt = $mysqli->prepare('SELECT name, role, password_hash FROM users WHERE email = ? AND is_active = TRUE');
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if (!$user) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid email or password.']);
            return;
        }

        // Comparer le mot de passe fourni avec le hash stocké
        error_log("Attempting password_verify for email: " . $email);
        error_log("Provided password (first 5 chars): " . substr($password, 0, 5) . "...");
        error_log("Stored hash (first 5 chars): " . substr($user['password_hash'], 0, 5) . "...");

        if (password_verify($password, $user['password_hash'])) {
            error_log("password_verify SUCCESS for email: " . $email);
            // Le mot de passe correspond. Renvoyer les informations de l'utilisateur (sans le hash)
            echo json_encode([
                'name' => $user['name'],
                'role' => $user['role'],
            ]);
        } else {
            error_log("password_verify FAILED for email: " . $email);
            // Le mot de passe ne correspond pas
            http_response_code(401);
            echo json_encode(['message' => 'Invalid email or password.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Server error during authentication.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
