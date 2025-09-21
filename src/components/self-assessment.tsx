import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Brain, Heart, BookOpen, Clock } from 'lucide-react';

// --- Type Definitions ---
interface AssessmentQuestion {
  id: string;
  question: string;
  scale: string;
  options: { value: number; label: string }[];
}

interface SelfAssessmentProps {
  onComplete: (results: any) => void;
  userData: any;
}

// --- Assessment Questions ---
const assessmentQuestions: AssessmentQuestion[] = [
  // PHQ-9 Questions (Depression)
  {
    id: 'phq9_1',
    question: 'Over the last 2 weeks, how often have you been bothered by having little interest or pleasure in doing things?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_2',
    question: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  // GAD-7 Questions (Anxiety)
  {
    id: 'gad7_1',
    question: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'gad7_2',
    question: 'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  // Student Stress Questions
  {
    id: 'stress_1',
    question: 'How often have you felt overwhelmed by your academic workload recently?',
    scale: 'Academic Stress',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Always' },
    ],
  },
  {
    id: 'stress_2',
    question: 'How would you rate your ability to balance your studies and personal life?',
    scale: 'Life Balance',
    options: [
        { value: 4, label: 'Excellent' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Fair' },
        { value: 1, label: 'Poor' },
        { value: 0, label: 'Very Poor' },
    ],
  },
];


export function SelfAssessment({ onComplete, userData }: SelfAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;

  const getScaleIcon = (scale: string) => {
    switch (scale) {
      case 'PHQ-9': return Brain;
      case 'GAD-7': return Heart;
      case 'Academic Stress':
      case 'Life Balance': return BookOpen;
      default: return Brain;
    }
  };

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: parseInt(value) }));
  };

  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Process results
    const phq9Score = (responses['phq9_1'] || 0) + (responses['phq9_2'] || 0);
    const gad7Score = (responses['gad7_1'] || 0) + (responses['gad7_2'] || 0);
    const stressScore = (responses['stress_1'] || 0) + (responses['stress_2'] || 0);

    const results = {
      timestamp: new Date().toISOString(),
      scores: {
        depression: {
          score: phq9Score,
          severity: phq9Score >= 3 ? 'Moderate' : 'Mild',
          color: phq9Score >= 3 ? 'yellow' : 'green',
        },
        anxiety: {
          score: gad7Score,
          severity: gad7Score >= 3 ? 'Moderate' : 'Mild',
          color: gad7Score >= 3 ? 'yellow' : 'green',
        },
        academicStress: {
            score: stressScore,
            severity: stressScore > 4 ? 'High' : 'Low-Moderate',
            color: stressScore > 4 ? 'yellow' : 'green',
        },
      },
    };
    
    // Simulate processing time
    setTimeout(() => onComplete(results), 1500);
  };
  
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-medium">Analyzing Your Results...</h2>
          <p className="text-muted-foreground">Personalizing your dashboard.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wellness-gradient p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-medium">Initial Wellness Check-in</h1>
          <p className="text-muted-foreground">Let's get a quick snapshot of your current well-being.</p>
        </motion.div>

        <Progress value={progress} className="h-2 mb-4" />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                Question {currentStep + 1} of {assessmentQuestions.length}
              </Badge>
              <CardTitle className="text-lg font-medium pt-2">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={responses[currentQuestion.id]?.toString()} onValueChange={handleResponseChange} className="space-y-3">
                {currentQuestion.options.map(option => (
                  <Label key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border bg-background/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                    <RadioGroupItem value={option.value.toString()} />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>Previous</Button>
          <Button onClick={handleNext} disabled={responses[currentQuestion.id] === undefined}>
            {currentStep === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
