<?php
require_once 'db.php'; // For CORS headers

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        handle_post_chatbot();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

function handle_post_chatbot() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user_message = $data['message'] ?? '';
    $history = $data['history'] ?? [];
    $system_instruction = $data['systemInstruction'] ?? 'You are a helpful assistant.';

    // --- Placeholder Logic for Chatbot ---
    // This is a simplified response.
    // Full implementation would involve:
    // 1. A PHP client for Google Generative AI or direct HTTP calls to Gemini API.
    // 2. Proper handling of chat history to match Gemini API requirements.
    // 3. Implementing streaming responses if needed.

    $response_text = "Désolé, la fonctionnalité chatbot est en cours de développement. Je ne peux pas répondre pour le moment à : '" . $user_message . "'.";

    // Simulate a simple response based on keywords
    if (stripos($user_message, 'bonjour') !== false || stripos($user_message, 'salut') !== false) {
        $response_text = "Bonjour ! Comment puis-je vous aider aujourd'hui concernant l'Africa Power Platform ?";
    } elseif (stripos($user_message, 'date') !== false || stripos($user_message, 'quand') !== false) {
        $response_text = "L'événement Africa Power Platform se tiendra les 20 et 21 juin 2026.";
    } elseif (stripos($user_message, 'où') !== false || stripos($user_message, 'lieu') !== false) {
        $response_text = "L'événement aura lieu au Palais des Congrès de Cotonou, Bénin.";
    } elseif (stripos($user_message, 'merci') !== false) {
        $response_text = "De rien ! N'hésitez pas si vous avez d'autres questions.";
    }

    // Since streaming is complex in PHP for a simple example,
    // we send the full response at once.
    http_response_code(200);
    header('Content-Type: application/json'); // Changed from text/plain to application/json
    echo json_encode(['text' => $response_text]); // Encapsulate response in 'text' key
}
?>
