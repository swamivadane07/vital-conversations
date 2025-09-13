import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BodyPart {
  id: string;
  name: string;
  position: { x: number; y: number };
  symptoms?: string[];
}

const bodyParts: BodyPart[] = [
  { id: 'head', name: 'Head', position: { x: 50, y: 10 }, symptoms: ['Headache', 'Dizziness', 'Migraine'] },
  { id: 'neck', name: 'Neck', position: { x: 50, y: 18 }, symptoms: ['Stiff neck', 'Sore throat', 'Neck pain'] },
  { id: 'chest', name: 'Chest', position: { x: 50, y: 30 }, symptoms: ['Chest pain', 'Shortness of breath', 'Cough'] },
  { id: 'stomach', name: 'Stomach', position: { x: 50, y: 45 }, symptoms: ['Nausea', 'Abdominal pain', 'Bloating'] },
  { id: 'left-arm', name: 'Left Arm', position: { x: 25, y: 35 }, symptoms: ['Arm pain', 'Numbness', 'Weakness'] },
  { id: 'right-arm', name: 'Right Arm', position: { x: 75, y: 35 }, symptoms: ['Arm pain', 'Numbness', 'Weakness'] },
  { id: 'left-leg', name: 'Left Leg', position: { x: 40, y: 75 }, symptoms: ['Leg pain', 'Swelling', 'Cramps'] },
  { id: 'right-leg', name: 'Right Leg', position: { x: 60, y: 75 }, symptoms: ['Leg pain', 'Swelling', 'Cramps'] },
];

export const InteractiveBodyDiagram = () => {
  const [selectedParts, setSelectedParts] = useState<BodyPart[]>([]);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handlePartClick = (part: BodyPart) => {
    const isSelected = selectedParts.some(p => p.id === part.id);
    if (isSelected) {
      setSelectedParts(selectedParts.filter(p => p.id !== part.id));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const clearSelection = () => {
    setSelectedParts([]);
  };

  const getSymptomSuggestions = () => {
    const allSymptoms = selectedParts.flatMap(part => part.symptoms || []);
    return [...new Set(allSymptoms)];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Body Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Interactive Body Diagram
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on body parts where you're experiencing symptoms
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 mx-auto">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full border rounded-lg bg-gradient-to-b from-background to-accent/10"
            >
              {/* Simple body outline */}
              <path
                d="M50 10 
                   C 45 10, 42 15, 42 20
                   L 42 30
                   C 35 32, 30 35, 25 40
                   L 25 50
                   C 30 52, 35 50, 42 50
                   L 42 60
                   C 40 65, 38 70, 40 75
                   L 40 90
                   C 45 92, 48 90, 50 90
                   C 52 90, 55 92, 60 90
                   L 60 75
                   C 62 70, 60 65, 58 60
                   L 58 50
                   C 65 50, 70 52, 75 50
                   L 75 40
                   C 70 35, 65 32, 58 30
                   L 58 20
                   C 58 15, 55 10, 50 10 Z"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />

              {/* Clickable body parts */}
              {bodyParts.map((part) => (
                <motion.circle
                  key={part.id}
                  cx={part.position.x}
                  cy={part.position.y}
                  r="4"
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedParts.some(p => p.id === part.id)
                      ? 'fill-primary stroke-primary-foreground'
                      : hoveredPart === part.id
                      ? 'fill-accent stroke-accent-foreground'
                      : 'fill-muted stroke-muted-foreground'
                  }`}
                  onClick={() => handlePartClick(part)}
                  onMouseEnter={() => setHoveredPart(part.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}

              {/* Labels for hovered parts */}
              {hoveredPart && (
                <text
                  x={bodyParts.find(p => p.id === hoveredPart)?.position.x}
                  y={(bodyParts.find(p => p.id === hoveredPart)?.position.y || 0) - 6}
                  textAnchor="middle"
                  className="fill-foreground text-xs font-medium"
                >
                  {bodyParts.find(p => p.id === hoveredPart)?.name}
                </text>
              )}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedParts.map((part) => (
              <Badge key={part.id} variant="default" className="cursor-pointer" onClick={() => handlePartClick(part)}>
                {part.name} ×
              </Badge>
            ))}
          </div>

          {selectedParts.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearSelection} className="mt-2">
              Clear Selection
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Symptom Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" />
            Symptom Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedParts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select body parts to see related symptoms</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Selected Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedParts.map((part) => (
                    <Badge key={part.id} variant="secondary">
                      {part.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Common Symptoms:</h4>
                <div className="space-y-2">
                  {getSymptomSuggestions().map((symptom) => (
                    <motion.div
                      key={symptom}
                      className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{symptom}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-3">
                  These symptoms can help guide your consultation with a healthcare provider.
                </p>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Continue to Symptom Checker
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};