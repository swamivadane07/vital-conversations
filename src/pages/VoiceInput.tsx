import { VoiceSymptomInput } from "@/components/advanced/VoiceSymptomInput";
import { SmartSymptomPredictor } from "@/components/advanced/SmartSymptomPredictor";
import { VoiceRecognition } from "@/components/advanced/VoiceRecognition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Mic, Brain, MessageSquare } from "lucide-react";

const VoiceInput = () => {
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const handleVoiceTranscript = (text: string) => {
    setVoiceTranscript(text);
    // Extract potential symptoms from the transcript
    const symptoms = extractSymptomsFromText(text);
    if (symptoms.length > 0) {
      setDetectedSymptoms(symptoms);
    }
  };

  const extractSymptomsFromText = (text: string): string[] => {
    const commonSymptoms = [
      'headache', 'fever', 'cough', 'sore throat', 'fatigue', 'nausea', 
      'dizziness', 'chest pain', 'shortness of breath', 'stomach ache',
      'back pain', 'joint pain', 'muscle pain', 'runny nose', 'sneezing'
    ];
    
    const foundSymptoms: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonSymptoms.forEach(symptom => {
      if (lowerText.includes(symptom)) {
        foundSymptoms.push(symptom);
      }
    });
    
    return foundSymptoms;
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Voice Health Assistant</h1>
            <p className="text-muted-foreground">Speak naturally about your symptoms and get AI-powered health insights</p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Mic, title: "Voice Recognition", desc: "Advanced speech-to-text technology" },
            { icon: Brain, title: "AI Analysis", desc: "Smart symptom pattern recognition" },
            { icon: MessageSquare, title: "Natural Language", desc: "Speak in your own words" }
          ].map((feature, index) => (
            <Card key={index} className="text-center p-4">
              <feature.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Enhanced Voice Recognition */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceRecognition 
                  onTranscript={handleVoiceTranscript}
                  placeholder="Tell me about your symptoms... For example: 'I have a headache and feel tired'"
                />
              </CardContent>
            </Card>

            {/* Legacy Voice Input */}
            <VoiceSymptomInput 
              onSymptomDetected={(symptoms) => setDetectedSymptoms(symptoms)} 
            />
          </div>
          
          {/* AI Analysis */}
          <div className="space-y-4">
            <SmartSymptomPredictor 
              symptoms={detectedSymptoms}
            />
            
            {/* Transcript Display */}
            {voiceTranscript && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Live Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{voiceTranscript}"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;