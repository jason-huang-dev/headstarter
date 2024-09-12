import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '../../contexts/userDataHandler';
import { Send } from 'lucide-react';
import { Button } from '../reusable';

const ChronyChat = () => {
    const { messages, postAI } = useUserContext();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayedMessages, setDisplayedMessages] = useState([]); // State to manage displayed messages
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [displayedMessages]); // Changed from messages to displayedMessages

    useEffect(() => {
        setDisplayedMessages(messages); // Update displayed messages whenever messages change
        setIsLoading(false); // Stop loading once messages are updated with the AI response
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setDisplayedMessages((prevMessages) => [
                ...prevMessages,
                { role: 'user', content: message.trim() },
            ]); // Add user's message to displayed messages

            setIsLoading(true); // Start loading state
            postAI({
                role: 'user',
                content: message.trim(),
            });
            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Messages Container */}
            <div className="flex-1 w-full max-w-lg overflow-y-auto p-2 custom-scroll">
                {/* Rendering of the previous messages */}
                {displayedMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex mb-2 ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
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
                {/* Loading Animation as a Message */}
                {isLoading && (
                    <div className="flex mb-2 justify-start">
                        <div className="p-3 rounded-lg max-w-md bg-green-500 text-white">
                            <span>Loading...</span> {/* Replace this with a spinner or animation if needed */}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section Fixed at the Bottom */}
            <div className="w-full max-w-lg p-2 border-t flex items-center bg-white">
                <input
                    type="text"
                    className="flex-grow px-3 py-2 border rounded-md"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSendMessage}
                    className="ml-2"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : <Send className="text-white" />}
                </Button>
            </div>
        </div>
    );
};

export default ChronyChat;
