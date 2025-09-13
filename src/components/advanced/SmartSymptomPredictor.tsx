import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SymptomPrediction {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  description: string;
}

interface SmartSymptomPredictorProps {
  symptoms?: string[];
  demographics?: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
  };
}

export const SmartSymptomPredictor = ({ symptoms = [], demographics }: SmartSymptomPredictorProps) => {
  const [predictions, setPredictions] = useState<SymptomPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  // Simulated AI model for symptom prediction
  const symptomDatabase = {
    'headache': {
      conditions: [
        { name: 'Tension Headache', baseProb: 0.7, severity: 'low' },
        { name: 'Migraine', baseProb: 0.4, severity: 'medium' },
        { name: 'Cluster Headache', baseProb: 0.1, severity: 'high' },
      ]
    },
    'fever': {
      conditions: [
        { name: 'Viral Infection', baseProb: 0.6, severity: 'low' },
        { name: 'Bacterial Infection', baseProb: 0.3, severity: 'medium' },
        { name: 'Flu', baseProb: 0.4, severity: 'medium' },
      ]
    },
    'cough': {
      conditions: [
        { name: 'Common Cold', baseProb: 0.5, severity: 'low' },
        { name: 'Bronchitis', baseProb: 0.3, severity: 'medium' },
        { name: 'Pneumonia', baseProb: 0.1, severity: 'high' },
      ]
    },
    'chest pain': {
      conditions: [
        { name: 'Muscle Strain', baseProb: 0.4, severity: 'low' },
        { name: 'Acid Reflux', baseProb: 0.3, severity: 'low' },
        { name: 'Angina', baseProb: 0.2, severity: 'high' },
      ]
    },
    'nausea': {
      conditions: [
        { name: 'Gastroenteritis', baseProb: 0.5, severity: 'medium' },
        { name: 'Food Poisoning', baseProb: 0.3, severity: 'medium' },
        { name: 'Motion Sickness', baseProb: 0.2, severity: 'low' },
      ]
    }
  };

  const conditionRecommendations = {
    'Tension Headache': [
      'Rest in a quiet, dark room',
      'Apply cold or warm compress',
      'Stay hydrated',
      'Consider over-the-counter pain relievers'
    ],
    'Migraine': [
      'Avoid known triggers',
      'Take prescribed migraine medication',
      'Rest in a dark, quiet environment',
      'Consider preventive medications'
    ],
    'Viral Infection': [
      'Get plenty of rest',
      'Stay hydrated',
      'Use symptom relief medications',
      'Monitor symptoms closely'
    ],
    'Common Cold': [
      'Rest and fluids',
      'Warm saltwater gargle',
      'Humidifier use',
      'Avoid spreading to others'
    ],
    'Muscle Strain': [
      'Rest the affected area',
      'Apply ice initially, then heat',
      'Gentle stretching exercises',
      'Anti-inflammatory medications'
    ]
  };

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const allConditions: { [key: string]: SymptomPrediction } = {};
    let totalRisk = 0;

    // Process each symptom
    symptoms.forEach(symptom => {
      const symptomLower = symptom.toLowerCase();
      const symptomData = symptomDatabase[symptomLower as keyof typeof symptomDatabase];
      
      if (symptomData) {
        symptomData.conditions.forEach(condition => {
          let probability = condition.baseProb;
          
          // Adjust probability based on age (demo logic)
          if (demographics?.age) {
            if (demographics.age > 65) probability *= 1.2;
            if (demographics.age < 18) probability *= 0.8;
          }
          
          // Boost probability if multiple related symptoms
          if (symptoms.length > 1) {
            probability *= 1.1;
          }
          
          // Cap probability at 95%
          probability = Math.min(probability, 0.95);
          
          if (allConditions[condition.name]) {
            allConditions[condition.name].probability = Math.max(
              allConditions[condition.name].probability,
              probability
            );
          } else {
            allConditions[condition.name] = {
              condition: condition.name,
              probability,
              severity: condition.severity as 'low' | 'medium' | 'high',
              recommendations: conditionRecommendations[condition.name as keyof typeof conditionRecommendations] || [
                'Consult with a healthcare provider',
                'Monitor symptoms',
                'Rest and stay hydrated'
              ],
              description: getConditionDescription(condition.name)
            };
          }
          
          // Calculate risk score
          const severityMultiplier = condition.severity === 'high' ? 3 : condition.severity === 'medium' ? 2 : 1;
          totalRisk += probability * severityMultiplier;
        });
      }
    });

    // Sort by probability and take top 5
    const sortedPredictions = Object.values(allConditions)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);

    setPredictions(sortedPredictions);
    setRiskScore(Math.min(totalRisk * 20, 100)); // Scale to 0-100
    setIsAnalyzing(false);
  };

  const getConditionDescription = (condition: string): string => {
    const descriptions = {
      'Tension Headache': 'Most common type of headache, usually caused by stress or muscle tension.',
      'Migraine': 'Severe headache often accompanied by nausea, vomiting, and light sensitivity.',
      'Viral Infection': 'Infection caused by a virus, typically resolves on its own with rest.',
      'Common Cold': 'Mild viral infection affecting the upper respiratory tract.',
      'Muscle Strain': 'Injury to muscle fibers, usually from overuse or sudden movement.',
      'Gastroenteritis': 'Inflammation of the stomach and intestines, often called stomach flu.',
    };
    return descriptions[condition as keyof typeof descriptions] || 'Consult a healthcare provider for proper diagnosis.';
  };

  useEffect(() => {
    if (symptoms.length > 0) {
      analyzeSymptoms();
    }
  }, [symptoms]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  if (symptoms.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">AI Symptom Analysis</h3>
          <p className="text-muted-foreground">
            Add symptoms to get AI-powered health insights and recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Health Analysis
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">{symptoms.length}</p>
              <p className="text-sm text-muted-foreground">Symptoms Analyzed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-accent">{predictions.length}</p>
              <p className="text-sm text-muted-foreground">Possible Conditions</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className={`text-2xl font-bold ${riskScore > 70 ? 'text-red-600' : riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                {Math.round(riskScore)}%
              </p>
              <p className="text-sm text-muted-foreground">Risk Assessment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      {isAnalyzing ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <motion.div
                className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-lg font-medium">Analyzing your symptoms...</p>
              <p className="text-sm text-muted-foreground">Using advanced AI algorithms</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {predictions.map((prediction, index) => {
            const SeverityIcon = getSeverityIcon(prediction.severity);
            return (
              <motion.div
                key={prediction.condition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <SeverityIcon className={`w-6 h-6 ${getSeverityColor(prediction.severity)}`} />
                        <div>
                          <h3 className="text-lg font-semibold">{prediction.condition}</h3>
                          <p className="text-sm text-muted-foreground">{prediction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={prediction.severity === 'high' ? 'destructive' : prediction.severity === 'medium' ? 'secondary' : 'default'}>
                          {prediction.severity} risk
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Probability Match</span>
                          <span className="text-sm font-medium">{Math.round(prediction.probability * 100)}%</span>
                        </div>
                        <Progress value={prediction.probability * 100} className="h-2" />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {prediction.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">Important Disclaimer</p>
              <p className="text-orange-700 dark:text-orange-300">
                This AI analysis is for informational purposes only and should not replace professional medical advice. 
                Please consult with a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};