import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Square } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecognitionProps {
  onTranscript: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  placeholder?: string;
}

export function VoiceRecognition({ onTranscript, onFinalTranscript, placeholder = "Click to start speaking..." }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Voice recognition started");
      };

      recognition.onend = () => {
        setIsListening(false);
        setVolume(0);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        onTranscript(fullTranscript);

        if (finalTranscript && onFinalTranscript) {
          onFinalTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Voice recognition error: ${event.error}`);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onTranscript, onFinalTranscript]);

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setTranscript("");
      recognitionRef.current.start();
      
      // Simulate volume visualization
      const animate = () => {
        setVolume(Math.random() * 100);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
      
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast.error("Microphone access is required for voice input");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <VolumeX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Voice recognition is not supported in your browser.
            Please use Chrome, Edge, or Safari for voice features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Voice Visualization */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-primary to-accent shadow-glow animate-pulse' 
                : 'bg-muted hover:bg-primary/10'
            }`}>
              {isListening ? (
                <div className="flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(8, volume / 5 + Math.random() * 20)}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </div>
            
            {isListening && (
              <div className="absolute -inset-4 rounded-full border-2 border-primary/30 animate-ping" />
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${
                isListening 
                  ? 'bg-destructive hover:bg-destructive/90' 
                  : 'bg-primary hover:bg-primary/90'
              } transition-all duration-300`}
            >
              {isListening ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Voice Input
                </>
              )}
            </Button>
          </div>

          {/* Transcript Display */}
          <div className="w-full">
            <div className="min-h-[60px] p-4 bg-muted/50 rounded-lg border">
              {transcript ? (
                <p className="text-sm text-foreground animate-fade-in">
                  {transcript}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {isListening ? "Listening... Speak now" : placeholder}
                </p>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span className="text-muted-foreground">
              {isListening ? 'Recording...' : 'Ready to listen'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}