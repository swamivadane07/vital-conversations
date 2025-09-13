import { SmartSymptomPredictor } from "@/components/advanced/SmartSymptomPredictor";
import { HealthRiskAssessment } from "@/components/advanced/HealthRiskAssessment";
import { InteractiveBodyDiagram } from "@/components/advanced/InteractiveBodyDiagram";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, User } from "lucide-react";

const AIAnalysis = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">AI Analysis</h1>
            <p className="text-muted-foreground">Advanced health insights powered by artificial intelligence</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <Card className="card-hover shadow-card">
            <CardContent className="p-4 lg:p-6 text-center">
              <Brain className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1 text-sm lg:text-base">AI Analysis</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Smart symptom prediction</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover shadow-card">
            <CardContent className="p-4 lg:p-6 text-center">
              <Activity className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-1 text-sm lg:text-base">Risk Assessment</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Health risk evaluation</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover shadow-card">
            <CardContent className="p-4 lg:p-6 text-center">
              <User className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-3 text-success" />
              <h3 className="font-semibold mb-1 text-sm lg:text-base">Body Analysis</h3>
              <p className="text-xs lg:text-sm text-muted-foreground">Interactive body diagram</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Interactive Body Diagram */}
          <Card className="card-hover shadow-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Interactive Body Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveBodyDiagram />
            </CardContent>
          </Card>

          {/* AI Symptom Predictor */}
          <div className="space-y-6">
            <SmartSymptomPredictor symptoms={symptoms} />
            
            {/* Health Risk Assessment */}
            <HealthRiskAssessment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;