import React, {useState} from 'react'
import { useUserContext } from '../../contexts/userDataHandler'
import { Button } from '../reusable'
import { Send } from 'lucide-react'

const ChronyChat = () => {
    const {messages, postAI} = useUserContext()
    const [message, setMessage] = useState('')

    const handleSendMessage = () => {
        if (message.trim()) {
            postAI({
                role: 'user',
                message: message.trim()
            });
            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="chat-container">
            {/* Rendering of the previous messages */}
            <div className="overflow-y-auto flex-1 px-3 py-5">
                {messages.map((element, index) => (
                    <div key={index} className="message">
                        <span>{element.message}</span>
                    </div>
                ))}
            </div>

            {/* The input component for the ChatBot */}
            <div className="boarder-t input-container flex justify-between items-center">
                <input 
                    type="text" 
                    placeholder="Enter what you want to ask the AI" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
                <Send className="send-icon" onClick={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChronyChat;