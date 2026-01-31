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
    // Detailed error checking
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        $error_messages = [
            UPLOAD_ERR_INI_SIZE   => 'Le fichier téléchargé dépasse la directive upload_max_filesize dans php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'Le fichier téléchargé dépasse la directive MAX_FILE_SIZE qui a été spécifiée dans le formulaire HTML.',
            UPLOAD_ERR_PARTIAL    => 'Le fichier n\'a été que partiellement téléchargé.',
            UPLOAD_ERR_NO_FILE    => 'Aucun fichier n\'a été téléchargé.',
            UPLOAD_ERR_NO_TMP_DIR => 'Un dossier temporaire est manquant.',
            UPLOAD_ERR_CANT_WRITE => 'Échec de l\'écriture du fichier sur le disque.',
            UPLOAD_ERR_EXTENSION  => 'Une extension PHP a arrêté le téléchargement du fichier.',
        ];
        $error_code = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
        $error_message = $error_messages[$error_code] ?? 'Une erreur de téléchargement inconnue est survenue.';
        echo json_encode(['error' => $error_message, 'errorCode' => $error_code]);
        exit();
    }

    $file = $_FILES['image'];
    $upload_dir = dirname(__DIR__) . '/public/uploads/';

    // Create directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0777, true)) {
            http_response_code(500);
            echo json_encode(['error' => 'Impossible de créer le dossier de téléversement.']);
            exit();
        }
    }

    // Check if upload directory is writable
    if (!is_writable($upload_dir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Le dossier de téléversement n\'est pas accessible en écriture.', 'path' => $upload_dir]);
        exit();
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
            'filePath' => '/uploads/' . $unique_filename
        ]);
    } else {
        http_response_code(500);
        $last_error = error_get_last();
        echo json_encode([
            'error' => 'Erreur lors du déplacement du fichier téléversé.',
            'php_error' => $last_error['message'] ?? 'Pas de message d\'erreur PHP disponible.'
        ]);
    }
}
?>
