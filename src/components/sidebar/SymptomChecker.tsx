import { useState } from "react";
import { Plus, X, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Sore throat", "Nausea", 
    "Fatigue", "Dizziness", "Chest pain", "Shortness of breath"
  ];

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setNewSymptom("");
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const analyzeSymptoms = () => {
    // This would connect to the backend symptom analysis API
    console.log("Analyzing symptoms:", { symptoms, severity, duration, additionalInfo });
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Symptom Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Symptoms */}
        <div>
          <Label htmlFor="symptoms" className="text-sm font-medium">
            What symptoms are you experiencing?
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="symptoms"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              placeholder="Enter symptom..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addSymptom(newSymptom)}
            />
            <Button 
              size="sm" 
              onClick={() => addSymptom(newSymptom)}
              disabled={!newSymptom.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Common Symptoms */}
        <div>
          <Label className="text-sm font-medium">Common Symptoms</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonSymptoms.map(symptom => (
              <Badge
                key={symptom}
                variant={symptoms.includes(symptom) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => addSymptom(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {symptoms.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Your Symptoms</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {symptoms.map(symptom => (
                <Badge key={symptom} className="gap-1">
                  {symptom}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeSymptom(symptom)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Severity */}
        <div>
          <Label htmlFor="severity" className="text-sm font-medium">
            Severity Level
          </Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select severity..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild - Manageable discomfort</SelectItem>
              <SelectItem value="moderate">Moderate - Noticeable impact</SelectItem>
              <SelectItem value="severe">Severe - Significant distress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Duration */}
        <div>
          <Label htmlFor="duration" className="text-sm font-medium">
            How long have you had these symptoms?
          </Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select duration..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">A few hours</SelectItem>
              <SelectItem value="1day">1 day</SelectItem>
              <SelectItem value="2-3days">2-3 days</SelectItem>
              <SelectItem value="week">About a week</SelectItem>
              <SelectItem value="weeks">Several weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Information */}
        <div>
          <Label htmlFor="additional" className="text-sm font-medium">
            Additional Information (Optional)
          </Label>
          <Textarea
            id="additional"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any additional details, medications, or relevant medical history..."
            className="mt-2 min-h-[80px]"
          />
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={analyzeSymptoms}
          className="w-full bg-gradient-primary hover:opacity-90 shadow-medical"
          disabled={symptoms.length === 0}
        >
          Analyze Symptoms
        </Button>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning-foreground">
            This tool provides general information only. For urgent symptoms or concerns, 
            please contact your healthcare provider immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};