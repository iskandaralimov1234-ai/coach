import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message } from './Message';
import { MCC_SYSTEM_PROMPT } from '../ai/systemPrompt';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const ChatWindow: React.FC = () => {
    // Initial State
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello. I am your Executive AI Coach. I'm here to help you achieve clarity and breakthrough results. What is on your mind today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Add User Message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        // Optimistically update UI
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    // Optional: OpenRouter specific headers for ranking/referral
                    // "HTTP-Referer": window.location.origin, 
                    // "X-Title": "Orbit Coach"
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-chat", // V3 is fast and good. R1 is available as "deepseek/deepseek-r1"
                    messages: [
                        { role: "system", content: MCC_SYSTEM_PROMPT },
                        ...newMessages.map(m => ({
                            role: m.role,
                            content: m.content
                        }))
                    ],
                    temperature: 0.7,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const aiContent = data.choices?.[0]?.message?.content || "I apologize, but I'm having trouble connecting right now. Let's pause and try again in a moment.";

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error("Coaching Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "An inner interference occurred (Connection Error). Please check your API key or network."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="brand">
                    <Sparkles size={24} style={{ color: 'var(--color-primary)' }} />
                    <h1>Orbit Coach</h1>
                </div>
                <div className="badge">MCC Level</div>
            </header>

            {/* Messages Area */}
            <div className="chat-area custom-scrollbar">
                {messages.map(msg => (
                    <Message key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                    <div className="message assistant">
                        <div className="avatar assistant">
                            <Sparkles size={16} />
                        </div>
                        <div className="loading-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
                <div className="input-box">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Share your thoughts..."
                        rows={1}
                        style={{ minHeight: '60px', maxHeight: '200px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="send-btn"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="disclaimer">
                    AI can make mistakes. Focus on your insights.
                </div>
            </div>
        </div>
    );
};
