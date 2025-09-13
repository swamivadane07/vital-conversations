import { VoiceSymptomInput } from "@/components/advanced/VoiceSymptomInput";
import { SmartSymptomPredictor } from "@/components/advanced/SmartSymptomPredictor";
import { useState } from "react";

const VoiceInput = () => {
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Voice Symptom Input</h1>
        <p className="text-muted-foreground">Describe your symptoms using voice input and get AI-powered analysis</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <VoiceSymptomInput 
            onSymptomDetected={(symptoms) => setDetectedSymptoms(symptoms)} 
          />
        </div>
        
        <div>
          <SmartSymptomPredictor 
            symptoms={detectedSymptoms}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;