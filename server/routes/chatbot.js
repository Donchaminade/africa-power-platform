const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Accédez à votre clé API à partir des variables d'environnement
const API_KEY = process.env.GEMINI_API_KEY; // Assurez-vous que cette variable est définie dans votre .env

if (!API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment variables. Chatbot functionality may be limited.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Gérer les messages du chatbot
router.post('/', async (req, res) => {
    if (!genAI) {
        return res.status(500).json({ error: "Chatbot service is not available. API key not configured." });
    }

    const { history, message, systemInstruction } = req.body;

    // --- Pre-process history for Gemini API ---
    const geminiHistory = [];
    let lastRole = null;

    // Iterate through the history received from frontend, excluding the very last message
    // because the last message is the 'message' for the current turn.
    const conversationHistory = history.slice(0, history.length - 1); // All messages BEFORE the current user message

    for (const chatMessage of conversationHistory) {
        // Skip consecutive messages from the same role to enforce alternation
        if (chatMessage.role === lastRole) {
            continue; // Skip this message as it breaks alternation
        }

        // Gemini API requires 'model' role to be 'model', 'user' to be 'user'
        const role = chatMessage.role === 'user' ? 'user' : 'model';
        geminiHistory.push({
            role: role,
            parts: [{ text: chatMessage.text }],
        });
        lastRole = role;
    }

    // After processing, ensure history starts with 'user'. If it starts with 'model', remove it.
    // This handles the initial 'welcome' message from the model if it was the very first message.
    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift(); // Remove the leading model message
    }
    // --- End of history pre-processing ---

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.0-pro", // Changed from "gemini-pro" to "gemini-1.0-pro"
            systemInstruction: { parts: [{ text: systemInstruction }] }, // System instruction moved here
        });
        
        const chat = model.startChat({
            history: geminiHistory, // Use the pre-processed history
            generationConfig: {
                maxOutputTokens: 500,
            },
            // systemInstruction is removed from here
        });

        const result = await chat.sendMessageStream(message); // 'message' is the current user's turn
        
        // Définir les en-têtes pour le streaming
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                res.write(chunkText);
            }
        }
        res.end(); // Terminer la réponse après l'envoi de tous les morceaux

    } catch (error) {
        console.error('Erreur lors de la communication avec l\'API Gemini :', error);
        // Add specific error handling for Gemini API history validation
        if (error.message && error.message.includes("First content should be with role 'user', got model")) {
             return res.status(400).json({ error: "Historique de conversation mal formé pour l'API Gemini. Le premier message doit être de l'utilisateur." });
        }
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API du chatbot.' });
    }
});

module.exports = router;
