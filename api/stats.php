<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$endpoint = $request_uri[count($request_uri) - 1]; // e.g., 'stats', 'registrations-by-day'

switch ($method) {
    case 'GET':
        handle_get($mysqli, $endpoint);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handle_get($mysqli, $endpoint) {
    switch ($endpoint) {
        case 'stats':
            get_global_stats($mysqli);
            break;
        case 'registrations-by-day':
            get_registrations_by_day($mysqli);
            break;
        case 'registrations-by-type':
            get_registrations_by_type($mysqli);
            break;
        case 'speakers-by-category':
            get_speakers_by_category($mysqli);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
}

function get_global_stats($mysqli) {
    try {
        $stats = [];
        $queries = [
            'registrations' => 'SELECT COUNT(*) as count FROM registrations',
            'speakers' => 'SELECT COUNT(*) as count FROM speakers',
            'sponsors' => 'SELECT COUNT(*) as count FROM sponsors',
            'newsletterSubscribers' => 'SELECT COUNT(*) as count FROM newsletter_subscribers',
            'contactMessages' => 'SELECT COUNT(*) as count FROM contact_messages',
            'partnershipRequests' => 'SELECT COUNT(*) as count FROM partnership_requests',
            'mediaAssets' => 'SELECT COUNT(*) as count FROM media_assets',
            'contentBlocks' => 'SELECT COUNT(*) as count FROM content_blocks',
            'galleryImages' => 'SELECT COUNT(*) as count FROM gallery',
            'teamMembers' => 'SELECT COUNT(*) as count FROM team_members',
        ];

        foreach ($queries as $key => $sql) {
            $result = $mysqli->query($sql);
            $row = $result->fetch_assoc();
            $stats[$key] = (int)$row['count'];
        }
        echo json_encode($stats);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des statistiques globales.', 'details' => $e->getMessage()]);
    }
}

function get_registrations_by_day($mysqli) {
    try {
        $query = "
            SELECT 
                CAST(registration_date AS DATE) as date, 
                COUNT(id) as count 
            FROM registrations 
            WHERE registration_date >= CURDATE() - INTERVAL 30 DAY 
            GROUP BY CAST(registration_date AS DATE)
            ORDER BY date ASC;
        ";
        $result = $mysqli->query($query);
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rows);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des inscriptions par jour.', 'details' => $e->getMessage()]);
    }
}

function get_registrations_by_type($mysqli) {
    try {
        $query = "
            SELECT 
                pass_type as label, 
                COUNT(id) as value 
            FROM registrations 
            GROUP BY pass_type;
        ";
        $result = $mysqli->query($query);
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rows);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des inscriptions par type.', 'details' => $e->getMessage()]);
    }
}

function get_speakers_by_category($mysqli) {
    try {
        $query = "
            SELECT 
                category_fr as label, 
                COUNT(id) as value 
            FROM speakers 
            GROUP BY category_fr;
        ";
        $result = $mysqli->query($query);
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rows);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération des speakers par catégorie.', 'details' => $e->getMessage()]);
    }
}

$mysqli->close();
?>
