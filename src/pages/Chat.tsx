import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { Message } from "@/components/MedicalChatbot";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Medical Assistant. I'm here to provide health information and support, but please remember that I cannot replace professional medical advice. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage(content, "user");
    
    // Simulate AI response (replace with actual API call when backend is ready)
    setTimeout(() => {
      const response = `Thank you for your question about "${content}". This is a simulated response. 

⚠️ I'm an AI assistant, not a doctor. Please consult a healthcare professional for medical decisions.`;
      addMessage(response, "assistant");
    }, 1000);
  };

  return (
    <div className="h-full">
      <ChatArea 
        messages={messages} 
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;