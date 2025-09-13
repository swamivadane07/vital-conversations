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
    <div className="p-6 space-y-6 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Health Analysis</h1>
        <p className="text-muted-foreground">Advanced AI-powered health insights and risk assessment tools</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover shadow-card">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">Smart symptom prediction</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover shadow-card">
          <CardContent className="p-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-1">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Health risk evaluation</p>
          </CardContent>
        </Card>
        
        <Card className="card-hover shadow-card">
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 mx-auto mb-3 text-success" />
            <h3 className="font-semibold mb-1">Body Analysis</h3>
            <p className="text-sm text-muted-foreground">Interactive body diagram</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Body Diagram */}
        <Card className="card-hover shadow-card">
          <CardHeader>
            <CardTitle>Interactive Body Diagram</CardTitle>
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
  );
};

export default AIAnalysis;