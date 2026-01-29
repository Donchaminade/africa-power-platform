<?php
require_once 'db.php'; // For CORS headers

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handle_post_upload();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handle_post_upload() {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Aucun fichier n\'a été téléversé ou une erreur est survenue.']);
        exit();
    }

    $file = $_FILES['image'];
    $upload_dir = __DIR__ . '/../../public/uploads/'; // Path relative to current script

    // Create directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $unique_filename = 'image-' . time() . '-' . rand(100000000, 999999999) . '.' . $extension;
    $target_file = $upload_dir . $unique_filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        http_response_code(200);
        echo json_encode([
            'message' => 'Fichier téléversé avec succès.',
            'filePath' => '/uploads/' . $unique_filename // Publicly accessible path
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors du déplacement du fichier téléversé.']);
    }
}
?>
