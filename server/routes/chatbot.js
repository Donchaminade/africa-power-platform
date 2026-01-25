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

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Use gemini-pro for text-only
        
        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500,
            },
            systemInstruction: systemInstruction,
        });

        const result = await chat.sendMessageStream(message);
        
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
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API du chatbot.' });
    }
});

module.exports = router;
