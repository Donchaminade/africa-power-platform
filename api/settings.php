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
            // Debugging: Log key and value being processed
            error_log("Processing setting: Key=" . $key . ", Value=" . $value);

            $stmt = $mysqli->prepare(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
            );
            if (!$stmt) {
                // Debugging: Log prepare error
                error_log("Prepare failed: " . $mysqli->error);
                throw new Exception("Prepare failed: " . $mysqli->error . " Query: " . 
                    'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'); // Added query to error
            }
            // Ensure value is correctly cast to string if it might be non-string (e.g. null, boolean)
            $bind_value = (string)$value; 
            $stmt->bind_param("ss", $key, $bind_value);
            if (!$stmt->execute()) {
                // Debugging: Log execute error
                error_log("Execute failed for key " . $key . ": " . $stmt->error);
                throw new Exception("Execute failed for key " . $key . ": " . $stmt->error);
            }
            $stmt->close();
        }
        $mysqli->commit();
        error_log("Transaction committed successfully."); // New log after commit

        // --- NEW: Add a SELECT to verify from PHP's perspective ---
        $verify_result = $mysqli->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key = 'speaker_form_link'");
        if ($verify_result && $verify_result->num_rows > 0) {
            $verified_setting = $verify_result->fetch_assoc();
            error_log("PHP verified setting: Key=" . $verified_setting['setting_key'] . ", Value=" . $verified_setting['setting_value']);
        } else {
            error_log("PHP could not verify setting 'speaker_form_link' immediately after commit.");
        }
        // --- END NEW ---

        http_response_code(200);
        echo json_encode(['message' => 'Paramètres mis à jour avec succès.']);
    } catch (Exception $e) {
        $mysqli->rollback();
        // Debugging: Log transaction or general exception error
        error_log("Transaction failed: " . $e->getMessage());
        http_response_code(500);
        echo json_enc1ode(['message' => 'Erreur serveur lors de la mise à jour des paramètres.', 'error' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
