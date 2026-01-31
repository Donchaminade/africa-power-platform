<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = null;
$upload_video_endpoint = false;

// Determine if it's media-assets/{id} or media-assets/upload-video
if (isset($request_uri[count($request_uri) - 1]) && is_numeric($request_uri[count($request_uri) - 1])) {
    $id = (int)$request_uri[count($request_uri) - 1];
} elseif (isset($request_uri[count($request_uri) - 1]) && $request_uri[count($request_uri) - 1] === 'upload-video') {
    $upload_video_endpoint = true;
}


switch ($method) {
    case 'GET':
        handle_get($mysqli, $id);
        break;
    case 'POST':
        if ($upload_video_endpoint) {
            handle_post_upload_video($mysqli);
        } else {
            handle_post($mysqli);
        }
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
        $stmt = $mysqli->prepare("SELECT * FROM media_assets WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $asset = $result->fetch_assoc();
        if ($asset) {
            echo json_encode($asset);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Media asset not found']);
        }
        $stmt->close();
    } else {
        $result = $mysqli->query("SELECT * FROM media_assets ORDER BY uploaded_at DESC");
        $assets = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($assets);
    }
}

function handle_post($mysqli) {
    $data = $_POST; // For multipart/form-data, data is in $_POST
    $file_field_name = 'media_file'; // Name of the file input field

    if (!isset($_FILES[$file_field_name]) || $_FILES[$file_field_name]['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or an error occurred.']);
        return;
    }

    $file = $_FILES[$file_field_name];
    $upload_dir = __DIR__ . '/../../public/uploads/'; // Path relative to current script

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $unique_filename = $file_field_name . '-' . time() . '-' . rand(100000000, 999999999) . '.' . $extension;
    $target_file_path = $upload_dir . $unique_filename;
    $file_url = '/uploads/' . $unique_filename;

    if (move_uploaded_file($file['tmp_name'], $target_file_path)) {
        $stmt = $mysqli->prepare(
            'INSERT INTO media_assets (file_name, file_url, title_fr, title_en, alt_text_fr, alt_text_en, description_fr, description_en, type, mime_type, file_size, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        
        $is_active = 0;
        if (isset($data['is_active'])) {
            $is_active = ($data['is_active'] === 'true' || $data['is_active'] === '1' || $data['is_active'] === 1) ? 1 : 0;
        }

        $stmt->bind_param(
            "ssssssssssii",
            $unique_filename,
            $file_url,
            $data['title_fr'] ?? null,
            $data['title_en'] ?? null,
            $data['alt_text_fr'] ?? null,
            $data['alt_text_en'] ?? null,
            $data['description_fr'] ?? null,
            $data['description_en'] ?? null,
            $data['type'] ?? 'image',
            $file['type'],
            $file['size'],
            $is_active
        );

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['id' => $mysqli->insert_id, 'file_url' => $file_url, 'message' => 'Media asset uploaded successfully.']);
        } else {
            // If DB insert fails, delete the uploaded file
            unlink($target_file_path);
            http_response_code(500);
            echo json_encode(['error' => 'Error creating media asset record in DB: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error moving uploaded file.']);
    }
}

function handle_post_upload_video($mysqli) {
    $file_field_name = 'video'; // Name of the file input field

    if (!isset($_FILES[$file_field_name]) || $_FILES[$file_field_name]['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['message' => 'Aucun fichier vidéo téléchargé.']);
        return;
    }

    $file = $_FILES[$file_field_name];
    $upload_dir = __DIR__ . '/../../public/uploads/'; // Path relative to current script

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $unique_filename = $file_field_name . '-' . time() . '-' . rand(100000000, 999999999) . '.' . $extension;
    $target_file_path = $upload_dir . $unique_filename;
    $video_url = '/uploads/' . $unique_filename;

    if (move_uploaded_file($file['tmp_name'], $target_file_path)) {
        http_response_code(200);
        echo json_encode(['message' => 'Vidéo téléchargée avec succès', 'videoUrl' => $video_url]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors du déplacement du fichier vidéo téléversé.']);
    }
}


function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Media asset ID is required']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);

    $is_active = 0;
    if (isset($data['is_active'])) {
        $is_active = ($data['is_active'] === true || $data['is_active'] === 1 || $data['is_active'] === 'true') ? 1 : 0;
    }

    $stmt = $mysqli->prepare("UPDATE media_assets SET title_fr = ?, title_en = ?, alt_text_fr = ?, alt_text_en = ?, description_fr = ?, description_en = ?, type = ?, is_active = ? WHERE id = ?");
    $stmt->bind_param(
        "sssssssii",
        $data['title_fr'] ?? null,
        $data['title_en'] ?? null,
        $data['alt_text_fr'] ?? null,
        $data['alt_text_en'] ?? null,
        $data['description_fr'] ?? null,
        $data['description_en'] ?? null,
        $data['type'] ?? 'image',
        $is_active,
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['id' => $id] + $data);
        } else {
            // If no rows were affected, it could be that the data was the same, or the asset was not found.
            // We can add a check to be sure.
            $check_stmt = $mysqli->prepare("SELECT id FROM media_assets WHERE id = ?");
            $check_stmt->bind_param("i", $id);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            if ($check_result->num_rows === 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Media asset not found']);
            } else {
                 // The data was the same, so we can return a success message
                echo json_encode(['id' => $id] + $data);
            }
            $check_stmt->close();
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error updating media asset: ' . $stmt->error]);
    }
    $stmt->close();
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Media asset ID is required']);
        return;
    }

    // Get file_name to delete the actual file
    $stmt = $mysqli->prepare("SELECT file_name FROM media_assets WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $asset = $result->fetch_assoc();
    $stmt->close();

    if (!$asset) {
        http_response_code(404);
        echo json_encode(['error' => 'Media asset not found']);
        return;
    }

    $file_name = $asset['file_name'];
    $file_path = __DIR__ . '/../../public/uploads/' . $file_name;

    // Delete from database
    $stmt = $mysqli->prepare("DELETE FROM media_assets WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Delete the actual file
            if (file_exists($file_path)) {
                unlink($file_path);
            }
            http_response_code(204);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Media asset not found in DB']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting media asset']);
    }
    $stmt->close();
}

$mysqli->close();
?>
