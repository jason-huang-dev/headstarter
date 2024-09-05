import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts/userDataHandler';
import { Send } from 'lucide-react';
import { Button } from '../reusable';

const ChronyChat = () => {
    const { messages, postAI } = useUserContext();
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            postAI({
                role: 'user',
                content: message.trim(),
            });
            setMessage(''); // Clear the input after sending
        }
        console.log(messages)
    };

    return (
        <div className="chat-container flex flex-col h-full">
            {/* Rendering of the previous messages */}
            <div className="overflow-y-auto flex-1 px-0.5 py-5">
                {messages.map((element, index) => (
                    <div
                        key={index}
                        className={`mb-3 max-w-md px-4 py-2 rounded-lg ${
                            element.role === 'user'
                                ? 'bg-gray-200 self-start' // User messages
                                : 'bg-green-500 text-white self-end' // Assistant messages
                        }`}
                    >
                        <span>{element.content}</span>
                    </div>
                ))}
            </div>

            {/* The input component for the ChatBot */}
            <div className="border-t flex justify-between items-center overflow-hidden leading-4">
                <input
                    type="text"
                    className="flex-grow px-3 py-3 border rounded-md"
                    placeholder="Enter what you want to ask the AI"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    onClick={handleSendMessage}
                    className="flex ml-1 mt-2"
                >
                    <Send
                        className="flex-grow send-icon cursor-pointer text-white"
                    />
                </Button>
            </div>
        </div>
    );
};

export default ChronyChat;
