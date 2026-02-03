import React from 'react';
import { Bot, User } from 'lucide-react';

interface MessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div className={`message ${isUser ? 'user' : 'assistant'}`}>
            <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>
                {isUser ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div className="bubble">
                {content}
            </div>
        </div>
    );
};
