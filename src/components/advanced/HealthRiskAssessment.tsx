import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertCircle, Heart, Activity, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Assessment {
  category: string;
  score: number;
  maxScore: number;
  risk: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

interface Question {
  id: string;
  question: string;
  type: 'radio' | 'select';
  options: { value: string; label: string; score: number }[];
  category: string;
}

const questions: Question[] = [
  {
    id: 'age',
    question: 'What is your age group?',
    type: 'select',
    category: 'demographic',
    options: [
      { value: '18-30', label: '18-30 years', score: 0 },
      { value: '31-40', label: '31-40 years', score: 1 },
      { value: '41-50', label: '41-50 years', score: 2 },
      { value: '51-65', label: '51-65 years', score: 3 },
      { value: '65+', label: '65+ years', score: 4 }
    ]
  },
  {
    id: 'exercise',
    question: 'How often do you exercise per week?',
    type: 'radio',
    category: 'lifestyle',
    options: [
      { value: 'daily', label: 'Daily (7+ times)', score: 0 },
      { value: 'regular', label: '4-6 times per week', score: 1 },
      { value: 'moderate', label: '2-3 times per week', score: 2 },
      { value: 'occasional', label: 'Once per week', score: 3 },
      { value: 'sedentary', label: 'Rarely or never', score: 4 }
    ]
  },
  {
    id: 'smoking',
    question: 'What is your smoking status?',
    type: 'radio',
    category: 'lifestyle',
    options: [
      { value: 'never', label: 'Never smoked', score: 0 },
      { value: 'former', label: 'Former smoker (quit >1 year)', score: 2 },
      { value: 'recent', label: 'Recently quit (<1 year)', score: 3 },
      { value: 'current', label: 'Current smoker', score: 5 }
    ]
  },
  {
    id: 'alcohol',
    question: 'How often do you consume alcohol?',
    type: 'radio',
    category: 'lifestyle',
    options: [
      { value: 'none', label: 'Never', score: 0 },
      { value: 'occasional', label: 'Occasionally (1-2 times/month)', score: 1 },
      { value: 'moderate', label: 'Moderate (1-2 times/week)', score: 2 },
      { value: 'frequent', label: 'Frequent (3-5 times/week)', score: 3 },
      { value: 'daily', label: 'Daily', score: 4 }
    ]
  },
  {
    id: 'diet',
    question: 'How would you describe your diet?',
    type: 'radio',
    category: 'lifestyle',
    options: [
      { value: 'excellent', label: 'Mostly fruits, vegetables, whole grains', score: 0 },
      { value: 'good', label: 'Balanced with occasional treats', score: 1 },
      { value: 'average', label: 'Mixed healthy and unhealthy foods', score: 2 },
      { value: 'poor', label: 'Mostly processed and fast foods', score: 4 }
    ]
  },
  {
    id: 'sleep',
    question: 'How many hours do you sleep per night on average?',
    type: 'radio',
    category: 'lifestyle',
    options: [
      { value: '7-9', label: '7-9 hours', score: 0 },
      { value: '6-7', label: '6-7 hours', score: 1 },
      { value: '5-6', label: '5-6 hours', score: 3 },
      { value: '<5', label: 'Less than 5 hours', score: 4 }
    ]
  },
  {
    id: 'stress',
    question: 'How would you rate your stress level?',
    type: 'radio',
    category: 'mental',
    options: [
      { value: 'low', label: 'Low - I manage stress well', score: 0 },
      { value: 'moderate', label: 'Moderate - Some stressful periods', score: 2 },
      { value: 'high', label: 'High - Often stressed', score: 4 },
      { value: 'severe', label: 'Severe - Constantly overwhelmed', score: 5 }
    ]
  },
  {
    id: 'family_history',
    question: 'Do you have a family history of heart disease, diabetes, or cancer?',
    type: 'radio',
    category: 'medical',
    options: [
      { value: 'none', label: 'No family history', score: 0 },
      { value: 'distant', label: 'Distant relatives only', score: 1 },
      { value: 'immediate', label: 'Immediate family (parents/siblings)', score: 3 },
      { value: 'multiple', label: 'Multiple immediate family members', score: 5 }
    ]
  }
];

export const HealthRiskAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [assessment, setAssessment] = useState<Assessment[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRiskAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateRiskAssessment = () => {
    const categoryScores: { [key: string]: { score: number; maxScore: number } } = {};

    // Calculate scores by category
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          if (!categoryScores[question.category]) {
            categoryScores[question.category] = { score: 0, maxScore: 0 };
          }
          categoryScores[question.category].score += option.score;
          categoryScores[question.category].maxScore += Math.max(...question.options.map(opt => opt.score));
        }
      }
    });

    // Generate assessments
    const assessments: Assessment[] = [];

    Object.entries(categoryScores).forEach(([category, { score, maxScore }]) => {
      const percentage = (score / maxScore) * 100;
      let risk: 'low' | 'moderate' | 'high';
      let recommendations: string[] = [];

      if (percentage < 30) {
        risk = 'low';
      } else if (percentage < 65) {
        risk = 'moderate';
      } else {
        risk = 'high';
      }

      // Category-specific recommendations
      switch (category) {
        case 'lifestyle':
          recommendations = [
            'Maintain regular physical activity',
            'Follow a balanced, nutritious diet',
            'Ensure adequate sleep (7-9 hours)',
            'Avoid smoking and limit alcohol consumption'
          ];
          break;
        case 'mental':
          recommendations = [
            'Practice stress management techniques',
            'Consider meditation or mindfulness',
            'Maintain social connections',
            'Seek professional help if needed'
          ];
          break;
        case 'medical':
          recommendations = [
            'Regular health screenings',
            'Discuss family history with your doctor',
            'Stay up to date with preventive care',
            'Monitor key health indicators'
          ];
          break;
        default:
          recommendations = ['Consult with healthcare provider'];
      }

      assessments.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        score,
        maxScore,
        risk,
        recommendations
      });
    });

    setAssessment(assessments);
    setIsComplete(true);
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAssessment([]);
    setIsComplete(false);
    setShowResults(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  if (showResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Your Health Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
                <p className="text-muted-foreground">
                  Based on your responses, here's your personalized health risk analysis
                </p>
              </div>

              <Button onClick={resetAssessment} variant="outline" className="w-full">
                Retake Assessment
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Categories */}
        <div className="grid gap-6">
          {assessment.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      {cat.category} Risk
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cat.risk === 'low' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : cat.risk === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {cat.risk.toUpperCase()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Risk Score</span>
                      <span>{cat.score} / {cat.maxScore}</span>
                    </div>
                    <Progress 
                      value={(cat.score / cat.maxScore) * 100} 
                      className="h-3"
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {cat.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Health Risk Assessment
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
            
            {currentQ.type === 'radio' ? (
              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Select
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  {currentQ.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </motion.div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQ.id]}
              className="bg-gradient-primary hover:opacity-90"
            >
              {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};