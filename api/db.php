<?php
ob_start(); // Start output buffering to prevent accidental output before headers

// CORS headers - ALWAYS send these for every request hitting the API
header("Access-Control-Allow-Origin: https://africa-power-platform.vercel.app"); // Explicitly allow frontend origin
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Added X-Requested-With
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests for CORS. Important: This must be after setting ALL headers.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond to preflight with 200 OK
    ob_end_flush(); // Flush output buffer
    exit(); // Exit immediately after preflight
}

// Debugging: Added a test log
error_log("PHP script reached db.php - " . date('Y-m-d H:i:s'));

// Détection de l'environnement (local vs production)
if ($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
    // Environnement de développement local (XAMPP)
    $db_host = 'localhost';
    $db_user = 'root'; // Utilisateur par défaut de XAMPP
    $db_password = ''; // Mot de passe par défaut de XAMPP (vide)
    $db_name = 'africa_power_platform'; // Le nom correct de votre base de données locale
    $db_port = 3306;
} else {
    // Environnement de production (Hostinger)
    $db_host = 'localhost'; // Confirmé comme étant correct pour votre Hostinger
    $db_user = 'u878418868_Donchaminade';
    $db_password = 'Donchaminade1@@';
    $db_name = 'u878418868_powerplate';
    $db_port = 3306;
}

$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name, $db_port);

if ($mysqli->connect_error) {
  header('Content-Type: application/json');
  http_response_code(500);
  error_log("Connection failed: " . $mysqli->connect_error); // Log connection error
  echo json_encode(['error' => "Connection failed: " . $mysqli->connect_error]);
  exit();
}

// Set charset to utf8mb4
$mysqli->set_charset("utf8mb4");

?>
