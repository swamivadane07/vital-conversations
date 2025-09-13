import { VoiceSymptomInput } from "@/components/advanced/VoiceSymptomInput";
import { SmartSymptomPredictor } from "@/components/advanced/SmartSymptomPredictor";
import { useState } from "react";

const VoiceInput = () => {
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Voice Input</h1>
            <p className="text-muted-foreground">Speak your symptoms and get instant analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
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
    </div>
  );
};

export default VoiceInput;