import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '../../contexts/userDataHandler';
import { Send } from 'lucide-react';
import { Button } from '../reusable';

const ChronyChat = () => {
    const { messages, postAI } = useUserContext();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
    scrollToBottom();
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSendMessage();
        }
      };

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
        <div className="flex flex-col h-screen justify-center items-center">
            <div
                className="flex flex-col w-full max-w-lg h-5/6 border p-0.25 rounded-lg"
            >
                {/* Rendering of the previous messages */}
                <div className="flex-1 overflow-y-auto mb-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex mb-2 ${msg.role === "assistant"? "justify-start": "justify-end"}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-md ${
                                    msg.role === 'user'
                                        ? 'bg-gray-200' // User messages
                                        : 'bg-green-500 text-white' // Assistant messages
                                }`}
                            >
                                <span>{msg.content}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* The input component for the ChatBot */}
                <div className="items-center overflow-hidden flex border-t pt-2 justify-between ">
                    <input
                        type="text"
                        className="flex-grow px-3 py-3 border rounded-md"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="flex ml-1 mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : <Send className="text-white" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChronyChat;
