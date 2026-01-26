import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'model', text: t('chatbot.welcome') }]);
        }
    }, [isOpen, t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const systemInstruction = `You are a friendly and helpful assistant for the "Africa Power Platform" event. Your goal is to answer questions about the event. The event is a premier summit dedicated to Microsoft Power Platform in West Africa, taking place in Cotonou, Benin, on June 20-21, 2026. Key topics include low-code/no-code, Power BI, Power Apps, and Dynamics 365. The event is free but requires registration. Use the information provided on the website to answer questions concisely and accurately. Always be polite and encouraging. Answer in the language of the user's question (${language === 'en' ? 'English' : 'French'}).`;

            // Filter out the initial welcome message if it's from the model and is the very first message
            const historyToSend = messages.length > 0 && messages[0].role === 'model' && messages[0].text === t('chatbot.welcome')
                ? messages.slice(1) // Exclude the welcome message
                : messages;

            const response = await fetch(`${API_URL}/chatbot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: historyToSend, // Send the filtered chat history
                    message: userMessage.text,
                    systemInstruction: systemInstruction,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Chatbot API call failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let modelResponse = '';

            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            // Stream the response
            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                modelResponse += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { role: 'model', text: "Désolé, je rencontre des difficultés à me connecter. Veuillez réessayer plus tard." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-brand-green text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:bg-green-700 hover:scale-110 transition-all"
                    aria-label={t('chatbot.open')}
                >
                    <i className="fas fa-robot"></i>
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <h3 className="font-bold text-lg">{t('chatbot.title')}</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label={t('chatbot.close')}>
                        <i className="fas fa-times"></i>
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0"><i className="fas fa-robot text-sm"></i></div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0"><i className="fas fa-robot text-sm"></i></div>
                             <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-none flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <footer className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('chatbot.placeholder')}
                            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-transparent focus:outline-none focus:border-brand-green"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 bg-brand-green text-white rounded-full flex-shrink-0 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;