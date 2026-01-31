<?php
require_once 'db.php';

// Handle CSV Export Request
if (isset($_GET['export_csv'])) {
    try {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="inscriptions.csv"');
        
        $output = fopen('php://output', 'w');
        
        // Add UTF-8 BOM for Excel compatibility
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); 
        
        // CSV Header
        fputcsv($output, ['ID', 'Prénom', 'Nom', 'Email', 'Entreprise', 'Poste', 'Pays', 'Type de Pass', 'Check-in', 'Date Check-in'], ';');
        
        // Database query with filters
        $search = $_GET['search'] ?? '';
        $checkedIn = $_GET['checkedIn'] ?? null;

        $query = "SELECT * FROM registrations";
        $where_clauses = [];
        $params = [];
        $types = "";

        if ($search) {
            $where_clauses[] = '(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
            $search_term = "%" . $search . "%";
            array_push($params, $search_term, $search_term, $search_term, $search_term);
            $types .= "ssss";
        }
        if ($checkedIn === 'true') {
            $where_clauses[] = 'is_checked_in = 1';
        } elseif ($checkedIn === 'false') {
            $where_clauses[] = 'is_checked_in = 0';
        }

        if (!empty($where_clauses)) {
            $query .= " WHERE " . implode(' AND ', $where_clauses);
        }
        $query .= " ORDER BY registration_date DESC";

        $stmt = $mysqli->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        // Write data to CSV
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['id'],
                $row['first_name'],
                $row['last_name'],
                $row['email'],
                $row['company'],
                $row['job_title'],
                $row['country'],
                str_replace('_', ' ', $row['pass_type']),
                $row['is_checked_in'] ? 'Oui' : 'Non',
                $row['check_in_time'] ? date('d/m/y H:i', strtotime($row['check_in_time'])) : 'N/A'
            ], ';');
        }
        $stmt->close();

    } catch (Exception $e) {
        error_log('CSV Export Error: ' . $e->getMessage());
    } finally {
        fclose($output);
        $mysqli->close();
        exit();
    }
}

// PDF EXPORT LOGIC
if (isset($_GET['export_pdf'])) {
    require_once '../fpdf186/fpdf.php';

    class PDF extends FPDF {
        private $logoPath = '';
        public $tableX;

        function __construct($orientation='P', $unit='mm', $size='A4') {
            parent::__construct($orientation, $unit, $size);
            $pageWidth = $this->GetPageWidth();
            $tableWidth = 255; // 10+50+65+40+20+30
            $this->tableX = ($pageWidth - $tableWidth) / 2;
        }

        function setLogoPath($path) {
            $this->logoPath = $path;
        }

        function Header() {
            if ($this->logoPath && file_exists($this->logoPath)) {
                $this->Image($this->logoPath, 10, 8, 20);
            }
            $this->SetY(15);
            $this->SetFont('Arial', 'B', 12);
            $this->Cell(0, 10, 'Liste des Inscriptions - Africa Power Platform', 0, 1, 'C');
            $this->Ln(5);

            $this->SetFont('Arial', 'B', 8);
            $this->SetFillColor(230, 230, 230);
            
            $this->SetX($this->tableX);
            $this->Cell(10, 7, 'ID', 1, 0, 'C', true);
            $this->Cell(50, 7, 'Nom', 1, 0, 'C', true);
            $this->Cell(65, 7, 'Email', 1, 0, 'C', true);
            $this->Cell(40, 7, 'Pass', 1, 0, 'C', true);
            $this->Cell(20, 7, 'Check-in', 1, 0, 'C', true);
            $this->Cell(30, 7, 'Date Check-in', 1, 1, 'C', true);
        }

        function Footer() {
            $this->SetY(-15);
            $this->SetFont('Arial', 'I', 8);
            $this->Cell(0, 10, 'Page ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
        }

        function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='') {
            $converted_txt = mb_convert_encoding($txt, 'ISO-8859-1', 'UTF-8');
            parent::Cell($w, $h, $converted_txt, $border, $ln, $align, $fill, $link);
        }
    }

    try {
        $result_settings = $mysqli->query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key = 'event_logo_url'");
        $settings_data = $result_settings->fetch_assoc();
        $logo_image_url = $settings_data['setting_value'] ?? '/assets/images/logo.png';
        $logo_path = realpath(dirname(dirname(__FILE__)) . '/public' . $logo_image_url);

        $search = $_GET['search'] ?? '';
        $checkedIn = $_GET['checkedIn'] ?? null;

        $query = "SELECT * FROM registrations";
        $where_clauses = [];
        $params = [];
        $types = "";

        if ($search) {
            $where_clauses[] = '(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
            $search_term = "%" . $search . "%";
            array_push($params, $search_term, $search_term, $search_term, $search_term);
            $types .= "ssss";
        }
        if ($checkedIn === 'true') {
            $where_clauses[] = 'is_checked_in = 1';
        } elseif ($checkedIn === 'false') {
            $where_clauses[] = 'is_checked_in = 0';
        }

        if (!empty($where_clauses)) {
            $query .= " WHERE " . implode(' AND ', $where_clauses);
        }
        $query .= " ORDER BY registration_date DESC";

        $stmt = $mysqli->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $registrations = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        $pdf = new PDF('L', 'mm', 'A4');
        if ($logo_path) {
            $pdf->setLogoPath($logo_path);
        }
        $pdf->AliasNbPages();
        $pdf->AddPage();
        $pdf->SetFont('Arial', '', 8);

        foreach ($registrations as $reg) {
            $pdf->SetX($pdf->tableX);
            $pdf->Cell(10, 6, $reg['id'], 1);
            $pdf->Cell(50, 6, $reg['first_name'] . ' ' . $reg['last_name'], 1);
            $pdf->Cell(65, 6, $reg['email'], 1);
            $pdf->Cell(40, 6, str_replace('_', ' ', $reg['pass_type']), 1);
            $pdf->Cell(20, 6, $reg['is_checked_in'] ? 'Oui' : 'Non', 1, 0, 'C');
            $pdf->Cell(30, 6, $reg['check_in_time'] ? date('d/m/y H:i', strtotime($reg['check_in_time'])) : 'N/A', 1, 1, 'C');
        }

        $pdf->Output('D', 'inscriptions_app.pdf');

    } catch (Exception $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        error_log('PDF Export Error: ' . $e->getMessage());
        echo json_encode(['message' => 'Failed to generate PDF.']);
    }
    
    $mysqli->close();
    exit();
}

// REGULAR JSON API LOGIC
$method = $_SERVER['REQUEST_METHOD'];
$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
}

switch ($method) {
    case 'GET':
        handle_get($mysqli, $id);
        break;
    case 'POST':
        handle_post($mysqli);
        break;
    case 'PUT':
        handle_put($mysqli, $id);
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
    header('Content-Type: application/json');
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
    $pass_type_input = $data['pass_type'] ?? '';

    $pass_type = '';
    $valid_pass_types = ['conference', 'full', 'bootcamp_applicant'];

    if (in_array($pass_type_input, $valid_pass_types)) {
        $pass_type = $pass_type_input;
    } 
    else {
        $pass_type_name_lower = strtolower($pass_type_input);
        if (in_array($pass_type_name_lower, ['pass conférence', 'conference pass'])) {
            $pass_type = 'conference';
        } elseif (in_array($pass_type_name_lower, ['pass complet', 'full pass'])) {
            $pass_type = 'full';
        } elseif (in_array(strtolower($pass_type_name_lower), ['pass bootcamp', 'bootcamp pass'])) {
            $pass_type = 'bootcamp_applicant';
        }
    }

    if (empty($first_name) || empty($last_name) || empty($email) || empty($pass_type)) {
        http_response_code(400);
        echo json_encode(['message' => 'Certains champs obligatoires n\'ont pas été remplis ou le type de pass est invalide.']);
        return;
    }

    try {
        $stmt = $mysqli->prepare('INSERT INTO registrations (first_name, last_name, email, company, job_title, country, pass_type) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param("sssssss", $first_name, $last_name, $email, $company, $job_title, $country, $pass_type);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['message' => 'Registration successful!', 'id' => $mysqli->insert_id]);
        } else {
            if ($mysqli->errno == 1062) {
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

function handle_put($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['message' => 'Registration ID is required']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $first_name = $data['first_name'] ?? null;
    $last_name = $data['last_name'] ?? null;
    $email = $data['email'] ?? null;
    $company = $data['company'] ?? '';
    $job_title = $data['job_title'] ?? '';
    $country = $data['country'] ?? '';
    $pass_type = $data['pass_type'] ?? null;
    $is_checked_in = isset($data['is_checked_in']) ? ($data['is_checked_in'] ? 1 : 0) : 0;
    
    if (empty($first_name) || empty($last_name) || empty($email) || empty($pass_type)) {
        http_response_code(400);
        echo json_encode(['message' => 'Certains champs obligatoires n\'ont pas été remplis.']);
        return;
    }

    try {
        $stmt = $mysqli->prepare('UPDATE registrations SET first_name = ?, last_name = ?, email = ?, company = ?, job_title = ?, country = ?, pass_type = ?, is_checked_in = ? WHERE id = ?');
        $stmt->bind_param("sssssssii", $first_name, $last_name, $email, $company, $job_title, $country, $pass_type, $is_checked_in, $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Inscription mise à jour avec succès.']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Inscription non trouvée ou aucune modification effectuée.']);
            }
        } else {
            if ($mysqli->errno == 1062) {
                http_response_code(409);
                echo json_encode(['message' => 'Cette adresse e-mail est déjà utilisée par un autre participant.']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Erreur serveur lors de la mise à jour de l\'inscription.']);
            }
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur serveur lors de la mise à jour de l\'inscription.', 'error' => $e->getMessage()]);
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

$mysqli->close();