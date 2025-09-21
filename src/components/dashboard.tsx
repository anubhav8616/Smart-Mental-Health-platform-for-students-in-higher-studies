import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Avatar, AvatarFallback } from './ui/avatar'
import { SelfAssessment } from './self-assessment'
import { 
  Heart, 
  Brain, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  Award,
  Bell,
  Moon,
  Users,
  Dumbbell,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Timer,
  Flame,
  Sparkles
} from 'lucide-react'

interface DashboardProps {
  onSectionChange: (section: string) => void
  userData: any
}

export function Dashboard({ onSectionChange, userData }: DashboardProps) {
  const [showAssessment, setShowAssessment] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [currentStreak, setCurrentStreak] = useState(7)
  const [wellnessScore, setWellnessScore] = useState(72)

  // Check if user needs to take assessment
  useEffect(() => {
    
      // Load existing results
      const savedResults = localStorage.getItem('assessmentResults')
      if (savedResults) {
        setAssessmentResults(JSON.parse(savedResults))
      }
    
  }, [])

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results)
    setShowAssessment(false)
    localStorage.setItem('lastAssessment', new Date().toISOString())
    localStorage.setItem('assessmentResults', JSON.stringify(results))
    
    // Update wellness score based on assessment
    const newScore = Math.max(20, 100 - (results.scores.depression.score * 3) - (results.scores.anxiety.score * 3))
    setWellnessScore(Math.round(newScore))
  }

  if (showAssessment) {
    return <SelfAssessment onComplete={handleAssessmentComplete} userData={userData} />
  }

  const quickStats = [
    { 
      title: 'Wellness Score', 
      value: `${wellnessScore}%`, 
      change: '+5%', 
      icon: Heart, 
      gradient: wellnessScore > 70 ? 'from-warm-green to-calm-blue' : wellnessScore > 50 ? 'from-sunny-orange to-gentle-pink' : 'from-mood-red to-sunny-orange',
      color: wellnessScore > 70 ? 'text-warm-green' : wellnessScore > 50 ? 'text-sunny-orange' : 'text-mood-red',
      bgColor: wellnessScore > 70 ? 'bg-warm-green/10' : wellnessScore > 50 ? 'bg-sunny-orange/10' : 'bg-mood-red/10',
      trend: 'up'
    },
    { 
      title: 'Current Streak', 
      value: `${currentStreak} days`, 
      change: 'Check-ins', 
      icon: Flame, 
      gradient: 'from-sunny-orange to-mood-red',
      color: 'text-sunny-orange',
      bgColor: 'bg-sunny-orange/10',
      trend: 'stable'
    },
    { 
      title: 'Mood Trend', 
      value: '7.2/10', 
      change: '+0.3', 
      icon: TrendingUp, 
      gradient: 'from-calm-blue to-soft-purple',
      color: 'text-calm-blue',
      bgColor: 'bg-calm-blue/10',
      trend: 'up'
    },
    { 
      title: 'Goals Completed', 
      value: '3/5', 
      change: 'This week', 
      icon: Target, 
      gradient: 'from-soft-purple to-gentle-pink',
      color: 'text-soft-purple',
      bgColor: 'bg-soft-purple/10',
      trend: 'stable'
    },
  ]

  const recentActivities = [
    { action: 'Completed daily mood check', time: '2 hours ago', icon: Heart, color: 'text-gentle-pink', bgColor: 'bg-gentle-pink/10' },
    { action: 'Finished mindfulness session', time: '5 hours ago', icon: Brain, color: 'text-soft-purple', bgColor: 'bg-soft-purple/10' },
    { action: 'Connected with study group', time: '1 day ago', icon: Users, color: 'text-calm-blue', bgColor: 'bg-calm-blue/10' },
    { action: 'Weekly assessment completed', time: '3 days ago', icon: CheckCircle, color: 'text-warm-green', bgColor: 'bg-warm-green/10' },
  ]

  const upcomingGoals = [
    { title: 'Complete 10-minute meditation', category: 'Mindfulness', dueDate: 'Today', progress: 0, color: 'soft-purple' },
    { title: 'Exercise for 30 minutes', category: 'Physical', dueDate: 'Today', progress: 60, color: 'warm-green' },
    { title: 'Connect with 2 friends', category: 'Social', dueDate: 'Tomorrow', progress: 50, color: 'gentle-pink' },
    { title: 'Get 8 hours of sleep', category: 'Sleep', dueDate: 'Tonight', progress: 0, color: 'calm-blue' },
  ]

  const mentalHealthMetrics = assessmentResults ? [
    {
      title: 'Depression (PHQ-9)',
      score: assessmentResults.scores.depression.score,
      severity: assessmentResults.scores.depression.severity,
      color: assessmentResults.scores.depression.color,
      maxScore: 27,
      icon: Brain,
      gradient: assessmentResults.scores.depression.color === 'green' ? 'from-warm-green/20 to-calm-blue/20' : 
                assessmentResults.scores.depression.color === 'yellow' ? 'from-sunny-orange/20 to-gentle-pink/20' : 'from-mood-red/20 to-sunny-orange/20'
    },
    {
      title: 'Anxiety (GAD-7)',
      score: assessmentResults.scores.anxiety.score,
      severity: assessmentResults.scores.anxiety.severity,
      color: assessmentResults.scores.anxiety.color,
      maxScore: 21,
      icon: Heart,
      gradient: assessmentResults.scores.anxiety.color === 'green' ? 'from-warm-green/20 to-calm-blue/20' : 
                assessmentResults.scores.anxiety.color === 'yellow' ? 'from-sunny-orange/20 to-gentle-pink/20' : 'from-mood-red/20 to-sunny-orange/20'
    },
    {
      title: 'Academic Stress',
      score: assessmentResults.scores.academicStress.score,
      severity: assessmentResults.scores.academicStress.severity,
      color: assessmentResults.scores.academicStress.color,
      maxScore: 12,
      icon: BookOpen,
      gradient: assessmentResults.scores.academicStress.color === 'green' ? 'from-warm-green/20 to-calm-blue/20' : 
                assessmentResults.scores.academicStress.color === 'yellow' ? 'from-sunny-orange/20 to-gentle-pink/20' : 'from-mood-red/20 to-sunny-orange/20'
    }
  ] : []

  return (
    <div className="min-h-screen bg-wellness-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium bg-gradient-to-r from-soft-purple to-calm-blue bg-clip-text text-transparent">
                Welcome back, {userData?.name?.split(' ')[0] || 'Student'}! 
                <Sparkles className="inline w-6 h-6 ml-2 text-sunny-orange" />
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's your mental health overview for today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAssessment(true)}
                className="bg-gradient-to-r from-soft-purple/10 to-calm-blue/10 border-soft-purple/30 hover:from-soft-purple/20 hover:to-calm-blue/20"
              >
                <Brain className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gradient-to-r from-gentle-pink/10 to-sunny-orange/10 border-gentle-pink/30 hover:from-gentle-pink/20 hover:to-sunny-orange/20"
              >
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${stat.gradient}/10 backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-medium mt-2">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Results */}
            {assessmentResults && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-soft-purple/20 to-calm-blue/20">
                        <Brain className="w-5 h-5 text-soft-purple" />
                      </div>
                      Mental Health Assessment Results
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Based on validated clinical scales • Last updated {new Date(assessmentResults.timestamp).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mentalHealthMetrics.map((metric, index) => (
                        <div key={metric.title} className={`space-y-4 p-4 rounded-xl bg-gradient-to-br ${metric.gradient}`}>
                          <div className="flex items-center gap-3">
                            <metric.icon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-medium">{metric.title}</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Score: {metric.score}/{metric.maxScore}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  metric.color === 'green' ? 'border-warm-green/30 bg-warm-green/10 text-warm-green' :
                                  metric.color === 'yellow' ? 'border-sunny-orange/30 bg-sunny-orange/10 text-sunny-orange' :
                                  'border-mood-red/30 bg-mood-red/10 text-mood-red'
                                }`}
                              >
                                {metric.severity}
                              </Badge>
                            </div>
                            <Progress 
                              value={(metric.score / metric.maxScore) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Recommendations */}
                    {assessmentResults.recommendations && assessmentResults.recommendations.length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-sunny-orange" />
                          Personalized Recommendations
                        </h4>
                        <div className="space-y-3">
                          {assessmentResults.recommendations.slice(0, 2).map((rec: any, index: number) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-xl border-l-4 ${
                                rec.type === 'urgent' ? 'bg-gradient-to-r from-mood-red/10 to-sunny-orange/10 border-mood-red' :
                                rec.type === 'important' ? 'bg-gradient-to-r from-sunny-orange/10 to-gentle-pink/10 border-sunny-orange' :
                                'bg-gradient-to-r from-calm-blue/10 to-soft-purple/10 border-calm-blue'
                              }`}
                            >
                              <p className="text-sm font-medium">{rec.text}</p>
                              <Button variant="link" className="h-auto p-0 text-xs mt-2 text-soft-purple hover:text-soft-purple/80">
                                {rec.action} →
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gentle-pink/20 to-sunny-orange/20">
                      <Zap className="w-5 h-5 text-sunny-orange" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-gentle-pink/10 to-mood-red/5 border-gentle-pink/30 hover:from-gentle-pink/20 hover:to-mood-red/10"
                      onClick={() => onSectionChange('mood')}
                    >
                      <Heart className="w-6 h-6 text-gentle-pink" />
                      <span className="text-xs font-medium">Log Mood</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-calm-blue/10 to-soft-purple/5 border-calm-blue/30 hover:from-calm-blue/20 hover:to-soft-purple/10"
                      onClick={() => onSectionChange('chatbot')}
                    >
                      <Brain className="w-6 h-6 text-calm-blue" />
                      <span className="text-xs font-medium">AI Support</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-warm-green/10 to-calm-blue/5 border-warm-green/30 hover:from-warm-green/20 hover:to-calm-blue/10"
                      onClick={() => onSectionChange('resources')}
                    >
                      <BookOpen className="w-6 h-6 text-warm-green" />
                      <span className="text-xs font-medium">Resources</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-soft-purple/10 to-gentle-pink/5 border-soft-purple/30 hover:from-soft-purple/20 hover:to-gentle-pink/10"
                      onClick={() => onSectionChange('community')}
                    >
                      <Users className="w-6 h-6 text-soft-purple" />
                      <span className="text-xs font-medium">Community</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-warm-green/20 to-calm-blue/20">
                      <CheckCircle className="w-5 h-5 text-warm-green" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className={`flex items-start gap-4 p-4 rounded-xl ${activity.bgColor} border border-current/10`}>
                        <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-soft-purple/20 to-gentle-pink/20">
                      <Target className="w-5 h-5 text-soft-purple" />
                    </div>
                    Today's Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingGoals.map((goal, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{goal.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs bg-${goal.color}/10 text-${goal.color} border-${goal.color}/20`}
                              >
                                {goal.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{goal.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wellness Streaks */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-sunny-orange/10 to-gentle-pink/10 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-sunny-orange/20 to-mood-red/20">
                      <Award className="w-5 h-5 text-sunny-orange" />
                    </div>
                    Wellness Streaks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-sunny-orange/10">
                      <div className="flex items-center gap-3">
                        <Flame className="w-5 h-5 text-sunny-orange" />
                        <span className="text-sm font-medium">Daily Check-ins</span>
                      </div>
                      <Badge className="bg-sunny-orange/20 text-sunny-orange border-sunny-orange/30">
                        {currentStreak} days
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-calm-blue/10">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-calm-blue" />
                        <span className="text-sm font-medium">Good Sleep</span>
                      </div>
                      <Badge className="bg-calm-blue/20 text-calm-blue border-calm-blue/30">
                        3 days
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-warm-green/10">
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-5 h-5 text-warm-green" />
                        <span className="text-sm font-medium">Exercise</span>
                      </div>
                      <Badge className="bg-warm-green/20 text-warm-green border-warm-green/30">
                        2 days
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-mood-red/10 to-sunny-orange/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="p-3 rounded-full bg-mood-red/20 w-fit mx-auto">
                      <AlertTriangle className="w-8 h-8 text-mood-red" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Need Immediate Help?</p>
                      <p className="text-xs text-muted-foreground mt-1">24/7 crisis support available</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSectionChange('crisis')}
                      className="w-full bg-mood-red/10 border-mood-red/30 text-mood-red hover:bg-mood-red/20"
                    >
                      Get Support Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}