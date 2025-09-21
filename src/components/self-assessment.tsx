import { motion } from 'motion/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { 
  Brain, 
  Heart, 
  Moon, 
  Users, 
  Dumbbell, 
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface AssessmentQuestion {
  id: string
  question: string
  scale: string
  options: { value: number; label: string }[]
}

interface SelfAssessmentProps {
  onComplete: (results: any) => void
  userData: any
}

export function SelfAssessment({ onComplete, userData }: SelfAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [isCompleting, setIsCompleting] = useState(false)

  // PHQ-9 Depression Scale Questions
  const phq9Questions: AssessmentQuestion[] = [
    {
      id: 'phq9_1',
      question: 'Little interest or pleasure in doing things',
      scale: 'PHQ-9',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_2',
      question: 'Feeling down, depressed, or hopeless',
      scale: 'PHQ-9',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_3',
      question: 'Trouble falling or staying asleep, or sleeping too much',
      scale: 'PHQ-9',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'phq9_4',
      question: 'Feeling tired or having little energy',
      scale: 'PHQ-9',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ]

  // GAD-7 Anxiety Scale Questions
  const gad7Questions: AssessmentQuestion[] = [
    {
      id: 'gad7_1',
      question: 'Feeling nervous, anxious, or on edge',
      scale: 'GAD-7',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_2',
      question: 'Not being able to stop or control worrying',
      scale: 'GAD-7',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    },
    {
      id: 'gad7_3',
      question: 'Worrying too much about different things',
      scale: 'GAD-7',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' }
      ]
    }
  ]

  // Student-Specific Stress Questions
  const studentStressQuestions: AssessmentQuestion[] = [
    {
      id: 'stress_1',
      question: 'How often do you feel overwhelmed by academic workload?',
      scale: 'Academic Stress',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    },
    {
      id: 'stress_2',
      question: 'How difficult is it to balance study and personal life?',
      scale: 'Life Balance',
      options: [
        { value: 0, label: 'Very easy' },
        { value: 1, label: 'Easy' },
        { value: 2, label: 'Moderate' },
        { value: 3, label: 'Difficult' },
        { value: 4, label: 'Very difficult' }
      ]
    },
    {
      id: 'stress_3',
      question: 'How often do you experience exam or assessment anxiety?',
      scale: 'Academic Stress',
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    }
  ]

  // Lifestyle & Wellness Questions
  const lifestyleQuestions: AssessmentQuestion[] = [
    {
      id: 'sleep_1',
      question: 'How would you rate your sleep quality?',
      scale: 'Sleep Quality',
      options: [
        { value: 4, label: 'Excellent' },
        { value: 3, label: 'Good' },
        { value: 2, label: 'Fair' },
        { value: 1, label: 'Poor' },
        { value: 0, label: 'Very poor' }
      ]
    },
    {
      id: 'social_1',
      question: 'How connected do you feel to your peers and support network?',
      scale: 'Social Connection',
      options: [
        { value: 4, label: 'Very connected' },
        { value: 3, label: 'Connected' },
        { value: 2, label: 'Somewhat connected' },
        { value: 1, label: 'Disconnected' },
        { value: 0, label: 'Very disconnected' }
      ]
    },
    {
      id: 'physical_1',
      question: 'How often do you engage in physical activity or exercise?',
      scale: 'Physical Activity',
      options: [
        { value: 4, label: 'Daily' },
        { value: 3, label: 'Most days' },
        { value: 2, label: 'Few times a week' },
        { value: 1, label: 'Rarely' },
        { value: 0, label: 'Never' }
      ]
    }
  ]

  const allQuestions = [
    ...phq9Questions,
    ...gad7Questions, 
    ...studentStressQuestions,
    ...lifestyleQuestions
  ]

  const currentQuestion = allQuestions[currentStep]
  const progress = ((currentStep + 1) / allQuestions.length) * 100

  const getScaleIcon = (scale: string) => {
    switch (scale) {
      case 'PHQ-9': return Brain
      case 'GAD-7': return Heart
      case 'Academic Stress': return BookOpen
      case 'Life Balance': return TrendingUp
      case 'Sleep Quality': return Moon
      case 'Social Connection': return Users
      case 'Physical Activity': return Dumbbell
      default: return Brain
    }
  }

  const getScaleColor = (scale: string) => {
    switch (scale) {
      case 'PHQ-9': return 'text-purple-600 dark:text-purple-400'
      case 'GAD-7': return 'text-red-600 dark:text-red-400'
      case 'Academic Stress': return 'text-orange-600 dark:text-orange-400'
      case 'Life Balance': return 'text-green-600 dark:text-green-400'
      case 'Sleep Quality': return 'text-blue-600 dark:text-blue-400'
      case 'Social Connection': return 'text-pink-600 dark:text-pink-400'
      case 'Physical Activity': return 'text-emerald-600 dark:text-emerald-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }))
  }

  const handleNext = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const calculateScores = () => {
    const phq9Score = phq9Questions.reduce((sum, q) => sum + (responses[q.id] || 0), 0)
    const gad7Score = gad7Questions.reduce((sum, q) => sum + (responses[q.id] || 0), 0)
    const stressScore = studentStressQuestions.reduce((sum, q) => sum + (responses[q.id] || 0), 0)
    const lifestyleScore = lifestyleQuestions.reduce((sum, q) => sum + (responses[q.id] || 0), 0)

    return {
      depression: {
        score: phq9Score,
        severity: phq9Score < 5 ? 'Minimal' : phq9Score < 10 ? 'Mild' : phq9Score < 15 ? 'Moderate' : phq9Score < 20 ? 'Moderately Severe' : 'Severe',
        color: phq9Score < 10 ? 'green' : phq9Score < 15 ? 'yellow' : 'red'
      },
      anxiety: {
        score: gad7Score,
        severity: gad7Score < 5 ? 'Minimal' : gad7Score < 10 ? 'Mild' : gad7Score < 15 ? 'Moderate' : 'Severe',
        color: gad7Score < 10 ? 'green' : gad7Score < 15 ? 'yellow' : 'red'
      },
      academicStress: {
        score: stressScore,
        severity: stressScore < 4 ? 'Low' : stressScore < 8 ? 'Moderate' : 'High',
        color: stressScore < 4 ? 'green' : stressScore < 8 ? 'yellow' : 'red'
      },
      wellnessScore: Math.round((lifestyleScore / 12) * 100)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const scores = calculateScores()
    const results = {
      timestamp: new Date().toISOString(),
      responses,
      scores,
      recommendations: generateRecommendations(scores)
    }
    
    onComplete(results)
  }

  const generateRecommendations = (scores: any) => {
    const recommendations = []
    
    if (scores.depression.score >= 10) {
      recommendations.push({
        type: 'urgent',
        category: 'Depression',
        text: 'Consider speaking with a counselor or mental health professional',
        action: 'Schedule counseling appointment'
      })
    }
    
    if (scores.anxiety.score >= 10) {
      recommendations.push({
        type: 'urgent',
        category: 'Anxiety',
        text: 'Try anxiety management techniques and consider professional support',
        action: 'Access anxiety resources'
      })
    }
    
    if (scores.academicStress.score >= 8) {
      recommendations.push({
        type: 'important',
        category: 'Academic Stress',
        text: 'Implement better study-life balance strategies',
        action: 'View stress management tools'
      })
    }
    
    if (scores.wellnessScore < 60) {
      recommendations.push({
        type: 'suggestion',
        category: 'Wellness',
        text: 'Focus on improving sleep, exercise, and social connections',
        action: 'Create wellness plan'
      })
    }
    
    return recommendations
  }

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-primary-foreground" />
            </motion.div>
          </div>
          <h2 className="text-xl font-medium mb-2">Processing Your Assessment</h2>
          <p className="text-muted-foreground">Analyzing responses and generating personalized insights...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-medium mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground mb-4">
            A comprehensive evaluation using validated clinical scales
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>~5 minutes • Completely confidential</span>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentStep + 1} of {allQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getScaleIcon(currentQuestion.scale)
                  return <Icon className={`w-5 h-5 ${getScaleColor(currentQuestion.scale)}`} />
                })()}
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.scale}
                </Badge>
              </div>
              <CardTitle className="text-lg font-medium leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={responses[currentQuestion.id]?.toString() || ''}
                onValueChange={handleResponseChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option.value.toString()} 
                      id={`option-${option.value}`}
                    />
                    <Label 
                      htmlFor={`option-${option.value}`}
                      className="flex-1 cursor-pointer py-2"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!responses[currentQuestion.id]}
            className="min-w-24"
          >
            {currentStep === allQuestions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Your responses are encrypted and stored securely. This assessment is for educational purposes 
            and does not replace professional mental health evaluation.
          </p>
        </div>
      </div>
    </div>
  )
}