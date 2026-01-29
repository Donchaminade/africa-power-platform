<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to convert array of key-value settings to a single object
function settingsArrayToObject($settingsArray) {
    $settingsObject = [];
    foreach ($settingsArray as $setting) {
        $settingsObject[$setting['setting_key']] = $setting['setting_value'];
    }
    return $settingsObject;
}

switch ($method) {
    case 'GET':
        handle_get($mysqli);
        break;
    case 'PUT':
        handle_put($mysqli);
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_get($mysqli) {
    try {
        $result = $mysqli->query('SELECT setting_key, setting_value FROM site_settings');
        $settings = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(settingsArrayToObject($settings));
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la récupération des paramètres.', 'error' => $e->getMessage()]);
    }
}

function handle_put($mysqli) {
    $updatedSettings = json_decode(file_get_contents('php://input'), true);

    if (empty($updatedSettings)) {
        http_response_code(400);
        echo json_encode(['message' => 'Aucun paramètre à mettre à jour fourni.']);
        return;
    }

    try {
        $mysqli->begin_transaction();
        foreach ($updatedSettings as $key => $value) {
            $stmt = $mysqli->prepare(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
            );
            $stmt->bind_param("ss", $key, $value);
            $stmt->execute();
            $stmt->close();
        }
        $mysqli->commit();
        http_response_code(200);
        echo json_encode(['message' => 'Paramètres mis à jour avec succès.']);
    } catch (Exception $e) {
        $mysqli->rollback();
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la mise à jour des paramètres.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
