import React from 'react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Brain, Heart, BookOpen } from 'lucide-react';

// --- Type Definitions ---
interface AssessmentQuestion {
  id: string;
  question: string;
  scale: 'PHQ-9' | 'GAD-7' | 'Academic Stress';
  options: { value: number; label: string }[];
}

interface SelfAssessmentProps {
  onComplete: (results: any) => void;
  userData: any;
}

// --- Updated Assessment Questions (PHQ-9, GAD-7, Academic Stress) ---
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
  {
    id: 'phq9_3',
    question: 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_4',
    question: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_5',
    question: 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_6',
    question: 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself—or that you are a failure or have let yourself or your family down?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_7',
    question: 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_8',
    question: 'Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual.',
    scale: 'PHQ-9',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'phq9_9',
    question: 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?',
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
  {
    id: 'gad7_3',
    question: 'Over the last 2 weeks, how often have you been bothered by worrying too much about different things?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'gad7_4',
    question: 'Over the last 2 weeks, how often have you been bothered by trouble relaxing?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'gad7_5',
    question: 'Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'gad7_6',
    question: 'Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?',
    scale: 'GAD-7',
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },
  {
    id: 'gad7_7',
    question: 'Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?',
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
    scale: 'Academic Stress',
    options: [
      { value: 4, label: 'Very Good' },
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
      case 'Academic Stress': return BookOpen;
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
    
    // Calculate scores based on scale
    const phq9Score = assessmentQuestions.filter(q => q.scale === 'PHQ-9').reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const gad7Score = assessmentQuestions.filter(q => q.scale === 'GAD-7').reduce((sum, q) => sum + (responses[q.id] || 0), 0);
    const stressScore = assessmentQuestions.filter(q => q.scale === 'Academic Stress').reduce((sum, q) => sum + (responses[q.id] || 0), 0);

    // Determine severity levels
    const getPhq9Severity = (score: number) => {
        if (score <= 4) return { severity: 'Minimal', color: 'green' };
        if (score <= 9) return { severity: 'Mild', color: 'green' };
        if (score <= 14) return { severity: 'Moderate', color: 'yellow' };
        if (score <= 19) return { severity: 'Moderately Severe', color: 'red' };
        return { severity: 'Severe', color: 'red' };
    };

    const getGad7Severity = (score: number) => {
        if (score <= 4) return { severity: 'Minimal', color: 'green' };
        if (score <= 9) return { severity: 'Mild', color: 'green' };
        if (score <= 14) return { severity: 'Moderate', color: 'yellow' };
        return { severity: 'Severe', color: 'red' };
    };

    const getStressSeverity = (score: number) => {
        if (score <= 3) return { severity: 'Low', color: 'green' };
        if (score <= 6) return { severity: 'Moderate', color: 'yellow' };
        return { severity: 'High', color: 'red' };
    };

    const results = {
      timestamp: new Date().toISOString(),
      scores: {
        depression: {
          score: phq9Score,
          ...getPhq9Severity(phq9Score)
        },
        anxiety: {
          score: gad7Score,
          ...getGad7Severity(gad7Score)
        },
        academicStress: {
            score: stressScore,
            ...getStressSeverity(stressScore)
        },
      },
    };
    
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
          <h1 className="text-2xl font-medium">Wellness Check-in</h1>
          <p className="text-muted-foreground">This will help us understand your current well-being.</p>
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
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="w-fit">
                        Question {currentStep + 1} of {assessmentQuestions.length}
                    </Badge>
                    <Badge variant="secondary" className="w-fit flex items-center gap-1.5">
                        {React.createElement(getScaleIcon(currentQuestion.scale), { className: "w-4 h-4" })}
                        {currentQuestion.scale}
                    </Badge>
                </div>
              <CardTitle className="text-lg font-medium pt-4">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={responses[currentQuestion.id]?.toString()} onValueChange={handleResponseChange} className="space-y-3">
                {currentQuestion.options.map(option => (
                  <Label key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border bg-background/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all cursor-pointer">
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
            {currentStep === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
