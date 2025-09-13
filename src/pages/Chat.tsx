import { useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { Message } from "@/components/MedicalChatbot";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Medical Assistant. I'm here to provide health information and support, but please remember that I cannot replace professional medical advice. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();

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
    
    try {
      console.log('Sending message to AI chat:', content);
      
      // Build conversation history for context
      const conversation = messages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: content,
          conversation
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI chat response:', data);
      
      const aiResponse = data?.response || "I apologize, but I'm having trouble processing your request right now. Please try again later, and remember to consult healthcare professionals for urgent medical concerns.";
      addMessage(aiResponse, "assistant");
      
    } catch (error) {
      console.error('Error calling AI chat:', error);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "Failed to get AI response. Please try again."
      });

      addMessage(
        "I'm experiencing technical difficulties right now. Please try again later, and remember to consult healthcare professionals for urgent medical concerns.",
        "assistant"
      );
    }
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