<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root';
$db_password = getenv('DB_PASSWORD') ?: '';
$db_name = getenv('DB_NAME') ?: 'africa_power_platform';
$db_port = getenv('DB_PORT') ?: 3306;

$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name, $db_port);

if ($mysqli->connect_error) {
  header('Content-Type: application/json');
  http_response_code(500);
  echo json_encode(['error' => "Connection failed: " . $mysqli->connect_error]);
  exit();
}

// Set charset to utf8mb4
$mysqli->set_charset("utf8mb4");

?>
