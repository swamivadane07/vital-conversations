import { Bot, User, Clock } from "lucide-react";
import { Message } from "@/components/MedicalChatbot";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isLoading = false }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-card border"
      )}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-pulse text-muted-foreground">
                  Analyzing your query...
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>
        </div>
        
        {!isLoading && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            <Clock className="w-3 h-3" />
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};