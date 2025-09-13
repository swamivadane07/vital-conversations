import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

interface VoiceSymptomInputProps {
  onSymptomDetected?: (symptoms: string[]) => void;
}

export const VoiceSymptomInput = ({ onSymptomDetected }: VoiceSymptomInputProps) => {
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { speak, cancel, speaking, supported: speechSupported } = useSpeechSynthesis();
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const commonSymptoms = [
    'headache', 'fever', 'cough', 'sore throat', 'nausea', 'dizziness',
    'chest pain', 'shortness of breath', 'fatigue', 'abdominal pain',
    'back pain', 'muscle aches', 'runny nose', 'congestion'
  ];

  useEffect(() => {
    if (transcript) {
      analyzeTranscriptForSymptoms(transcript);
    }
  }, [transcript]);

  const analyzeTranscriptForSymptoms = (text: string) => {
    const lowerText = text.toLowerCase();
    const foundSymptoms: string[] = [];

    commonSymptoms.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });

    // Additional pattern matching for symptoms
    const symptomPatterns = [
      { pattern: /my head hurts?/i, symptom: 'headache' },
      { pattern: /i have a headache/i, symptom: 'headache' },
      { pattern: /my throat is sore/i, symptom: 'sore throat' },
      { pattern: /i feel nauseous/i, symptom: 'nausea' },
      { pattern: /my stomach hurts?/i, symptom: 'abdominal pain' },
      { pattern: /i'm coughing/i, symptom: 'cough' },
      { pattern: /hard to breathe/i, symptom: 'shortness of breath' },
      { pattern: /chest hurts?/i, symptom: 'chest pain' },
      { pattern: /feeling tired/i, symptom: 'fatigue' },
      { pattern: /temperature|hot|cold|shivering/i, symptom: 'fever' },
    ];

    symptomPatterns.forEach(({ pattern, symptom }) => {
      if (pattern.test(lowerText) && !foundSymptoms.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });

    if (foundSymptoms.length > 0) {
      const newSymptoms = [...new Set([...detectedSymptoms, ...foundSymptoms])];
      setDetectedSymptoms(newSymptoms);
      onSymptomDetected?.(newSymptoms);
    }
  };

  const startListening = () => {
    resetTranscript();
    setIsProcessing(true);
    // This would normally use SpeechRecognition API
    // For demo purposes, we'll simulate it
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsProcessing(false);
  };

  const speakInstructions = () => {
    const instructions = "Please describe your symptoms. I'm listening and will help identify them for you.";
    speak({ text: instructions });
  };

  const clearSymptoms = () => {
    setDetectedSymptoms([]);
    resetTranscript();
  };

  const removeSymptom = (symptom: string) => {
    const updated = detectedSymptoms.filter(s => s !== symptom);
    setDetectedSymptoms(updated);
    onSymptomDetected?.(updated);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MicOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Voice input is not supported in your browser. Please use the text input instead.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            Voice Symptom Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={listening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full ${
                  listening ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={isProcessing}
              >
                {listening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <MicOff className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            </motion.div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {listening ? 'Listening...' : 'Click to start voice input'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isProcessing ? 'Processing your speech...' : 'Describe your symptoms naturally'}
              </p>
            </div>

            {speechSupported && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakInstructions}
                  disabled={speaking}
                >
                  {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </div>

          {/* Live Transcript */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-accent/30 border border-accent/40 rounded-lg"
            >
              <p className="text-sm font-medium mb-1">You said:</p>
              <p className="text-sm">{transcript}</p>
            </motion.div>
          )}

          {/* Voice Status Indicator */}
          <div className="flex items-center justify-center">
            <motion.div
              className={`w-24 h-2 rounded-full ${
                listening ? 'bg-primary' : 'bg-muted'
              }`}
              animate={listening ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
              transition={listening ? { repeat: Infinity, duration: 1.5 } : {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detected Symptoms */}
      {detectedSymptoms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detected Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {detectedSymptoms.map((symptom, index) => (
                  <motion.div
                    key={symptom}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      variant="default"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSymptom(symptom)}
                    >
                      {symptom} ×
                    </Badge>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSymptoms}>
                  Clear All
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  Analyze Symptoms
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Alternative Text Input */}
      <Card>
        <CardHeader>
          <CardTitle>Or Type Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your symptoms here if you prefer typing..."
            className="min-h-[100px]"
            onChange={(e) => analyzeTranscriptForSymptoms(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
};