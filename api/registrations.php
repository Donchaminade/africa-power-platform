<?php
require_once 'db.php';
require_once 'pdf_generator.php'; // Will create this later for PDF generation

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$id = null;
$export_pdf = false;

// Determine if it's an /api/registrations/{id} or /api/registrations/export/pdf
if (isset($request_uri[count($request_uri) - 1]) && is_numeric($request_uri[count($request_uri) - 1])) {
    $id = (int)$request_uri[count($request_uri) - 1];
} elseif (isset($request_uri[count($request_uri) - 2]) && $request_uri[count($request_uri) - 2] === 'export' && $request_uri[count($request_uri) - 1] === 'pdf') {
    $export_pdf = true;
}


switch ($method) {
    case 'GET':
        if ($export_pdf) {
            handle_export_pdf($mysqli); // Will implement this function
        } else {
            handle_get($mysqli, $id);
        }
        break;
    case 'POST':
        handle_post($mysqli);
        break;
    case 'DELETE':
        handle_delete($mysqli, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
        break;
}

function handle_get($mysqli, $id) {
    if ($id) {
        $stmt = $mysqli->prepare("SELECT * FROM registrations WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $registration = $result->fetch_assoc();
        if ($registration) {
            echo json_encode($registration);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Inscription non trouvée.']);
        }
        $stmt->close();
    } else {
        $search = $_GET['search'] ?? '';
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 10);
        $offset = ($page - 1) * $limit;

        $where_clause = '';
        $params = [];
        $types = '';

        if ($search) {
            $where_clause = ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?';
            $search_term = "%" . $search . "%";
            $params = [$search_term, $search_term, $search_term, $search_term];
            $types = "ssss";
        }

        // Count total items
        $count_query = "SELECT COUNT(*) as total FROM registrations" . $where_clause;
        $stmt_count = $mysqli->prepare($count_query);
        if ($types) {
            $stmt_count->bind_param($types, ...$params);
        }
        $stmt_count->execute();
        $result_count = $stmt_count->get_result();
        $total_items = $result_count->fetch_assoc()['total'];
        $stmt_count->close();

        $total_pages = ceil($total_items / $limit);

        // Fetch paginated data
        $data_query = "SELECT * FROM registrations" . $where_clause . " ORDER BY registration_date DESC LIMIT ? OFFSET ?";
        $stmt_data = $mysqli->prepare($data_query);
        
        if ($types) {
            $stmt_data->bind_param($types . "ii", ...array_merge($params, [$limit, $offset]));
        } else {
            $stmt_data->bind_param("ii", $limit, $offset);
        }
        
        $stmt_data->execute();
        $result_data = $stmt_data->get_result();
        $registrations = $result_data->fetch_all(MYSQLI_ASSOC);
        $stmt_data->close();

        echo json_encode([
            'data' => $registrations,
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $total_pages,
                'totalItems' => $total_items,
            ]
        ]);
    }
}

function handle_post($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $first_name = $data['first_name'] ?? '';
    $last_name = $data['last_name'] ?? '';
    $email = $data['email'] ?? '';
    $company = $data['company'] ?? '';
    $job_title = $data['job_title'] ?? '';
    $country = $data['country'] ?? '';
    $pass_type = $data['pass_type'] ?? 'conference';

    if (empty($first_name) || empty($last_name) || empty($email) || empty($pass_type)) {
        http_response_code(400);
        echo json_encode(['message' => 'Certains champs obligatoires n\'ont pas été remplis.']);
        return;
    }

    try {
        $stmt = $mysqli->prepare(
            'INSERT INTO registrations (first_name, last_name, email, company, job_title, country, pass_type) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->bind_param(
            "sssssss",
            $first_name,
            $last_name,
            $email,
            $company,
            $job_title,
            $country,
            $pass_type
        );

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['message' => 'Registration successful!', 'id' => $mysqli->insert_id]);
        } else {
            // Handle duplicate email error
            if ($mysqli->errno == 1062) { // MySQL error code for duplicate entry
                http_response_code(409);
                echo json_encode(['message' => 'Cette adresse e-mail est déjà enregistrée.']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.']);
            }
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.', 'error' => $e->getMessage()]);
    }
}

function handle_delete($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Registration ID is required']);
        return;
    }

    try {
        $stmt = $mysqli->prepare("DELETE FROM registrations WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Inscription supprimée avec succès.']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Inscription non trouvée.']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur serveur lors de la suppression de l\'inscription.']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la suppression de l\'inscription.', 'error' => $e->getMessage()]);
    }
}

function handle_export_pdf($mysqli) {
    // This function will be implemented later, requiring a PHP PDF library.
    // For now, it's a placeholder.
    http_response_code(501); // Not Implemented
    echo json_encode(['message' => 'PDF export not yet implemented in PHP.']);
}

$mysqli->close();
?>
