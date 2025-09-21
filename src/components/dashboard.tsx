import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { SelfAssessment } from './self-assessment'; // Import the new component
import {
  Heart,
  Brain,
  TrendingUp,
  Target,
  Flame,
  BookOpen,
  Users,
  AlertTriangle,
  Moon,
  Dumbbell,
  TrendingDown
} from 'lucide-react';

interface DashboardProps {
  onSectionChange: (section: string) => void;
  userData: any;
}

const getStartOfWeek = (date: Date) => {
  const dt = new Date(date);
  const day = dt.getDay();
  const diff = dt.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(dt.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export function Dashboard({ onSectionChange, userData }: DashboardProps) {
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userData?.id) return;

    const savedHistoryStr = localStorage.getItem(`assessmentHistory_${userData.id}`);
    const savedHistory = savedHistoryStr ? JSON.parse(savedHistoryStr) : [];
    setAssessmentHistory(savedHistory);

    const startOfWeek = getStartOfWeek(new Date());
    
    const assessmentsThisWeek = savedHistory.filter((result: any) => {
      const resultDate = new Date(result.timestamp);
      return resultDate >= startOfWeek;
    });

    if (assessmentsThisWeek.length < 3) {
      setShowAssessment(true);
    } else {
      setShowAssessment(false);
    }
    setIsLoading(false);
  }, [userData]);

  // FIX: This function now reads the latest history directly from localStorage
  // before updating, preventing stale state issues.
  const handleAssessmentComplete = (results: any) => {
    // 1. Read the absolute latest history from storage
    const currentHistoryStr = localStorage.getItem(`assessmentHistory_${userData.id}`);
    const currentHistory = currentHistoryStr ? JSON.parse(currentHistoryStr) : [];
    
    // 2. Add the new result to it
    const updatedHistory = [results, ...currentHistory];

    // 3. Update the state for the current view and save back to storage
    setAssessmentHistory(updatedHistory);
    setShowAssessment(false);
    localStorage.setItem(`assessmentHistory_${userData.id}`, JSON.stringify(updatedHistory));
  };

  if (isLoading) {
    return <div className="min-h-screen bg-wellness-gradient flex items-center justify-center"><Brain className="w-12 h-12 text-primary animate-pulse" /></div>;
  }
  
  if (showAssessment) {
    return <SelfAssessment onComplete={handleAssessmentComplete} userData={userData} />;
  }
  
  const latestAssessment = assessmentHistory[0];
  const previousAssessment = assessmentHistory[1];

  const wellnessScore = latestAssessment
    ? Math.round(Math.max(10, 100 - (((latestAssessment.scores.depression.score / 27) * 50) + ((latestAssessment.scores.anxiety.score / 21) * 50))))
    : 72;
  
  const getTrend = () => {
    if (!latestAssessment || !previousAssessment) return { text: 'Stable', icon: TrendingUp };
    const latestTotal = latestAssessment.scores.depression.score + latestAssessment.scores.anxiety.score;
    const previousTotal = previousAssessment.scores.depression.score + previousAssessment.scores.anxiety.score;
    if (latestTotal < previousTotal) return { text: 'Improving', icon: TrendingUp };
    if (latestTotal > previousTotal) return { text: 'Declining', icon: TrendingDown };
    return { text: 'Stable', icon: TrendingUp };
  };

  const quickStats = [
    { 
      title: 'Wellness Score', 
      value: `${wellnessScore}%`,
      icon: Heart,
      color: wellnessScore > 70 ? 'text-warm-green' : wellnessScore > 50 ? 'text-sunny-orange' : 'text-mood-red',
    },
    { 
      title: 'Overall Trend', 
      value: getTrend().text,
      icon: getTrend().icon,
      color: 'text-calm-blue',
    },
    { 
      title: 'Current Streak', 
      value: '1 day',
      icon: Flame,
      color: 'text-sunny-orange',
    },
    { 
      title: 'Goals Completed', 
      value: '0/3',
      icon: Target,
      color: 'text-soft-purple',
    },
  ];
  
  const recentActivities = [
    { action: 'Completed wellness check-in', time: 'Just now', icon: Brain, color: 'text-soft-purple', bgColor: 'bg-soft-purple/10' },
    { action: 'Completed daily mood check', time: '2 hours ago', icon: Heart, color: 'text-gentle-pink', bgColor: 'bg-gentle-pink/10' },
    { action: 'Connected with study group', time: '1 day ago', icon: Users, color: 'text-calm-blue', bgColor: 'bg-calm-blue/10' },
  ];

  const upcomingGoals = [
    { title: 'Complete 10-minute meditation', category: 'Mindfulness', progress: 0, color: 'soft-purple' },
    { title: 'Exercise for 30 minutes', category: 'Physical', progress: 60, color: 'warm-green' },
    { title: 'Get 8 hours of sleep', category: 'Sleep', progress: 0, color: 'calm-blue' },
  ];

  const mentalHealthMetrics = latestAssessment ? [
    {
      title: 'Depression',
      score: latestAssessment.scores.depression.score,
      severity: latestAssessment.scores.depression.severity,
      color: latestAssessment.scores.depression.color,
      maxScore: 27, 
      icon: Brain,
    },
    {
      title: 'Anxiety',
      score: latestAssessment.scores.anxiety.score,
      severity: latestAssessment.scores.anxiety.severity,
      color: latestAssessment.scores.anxiety.color,
      maxScore: 21,
      icon: Heart,
    },
    {
      title: 'Academic Stress',
      score: latestAssessment.scores.academicStress.score,
      severity: latestAssessment.scores.academicStress.severity,
      color: latestAssessment.scores.academicStress.color,
      maxScore: 8,
      icon: BookOpen,
    }
  ] : [];

  return (
    <div className="min-h-screen bg-wellness-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <h1 className="text-3xl font-medium">Welcome back, {userData?.email?.split('@')[0] || 'Student'}!</h1>
          <p className="text-muted-foreground mt-2">Here's your mental health overview for today.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-medium mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-muted`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {latestAssessment && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Wellness Snapshot</CardTitle>
                    <p className="text-sm text-muted-foreground">Based on your latest assessment.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {mentalHealthMetrics.map(metric => (
                        <div key={metric.title} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">{metric.title}</span>
                          </div>
                          <Progress value={(metric.score / metric.maxScore) * 100} />
                          <div className="flex justify-between text-sm">
                            <span>Score: {metric.score}/{metric.maxScore}</span>
                             <Badge variant={metric.color === 'green' ? 'default' : metric.color === 'yellow' ? 'secondary' : 'destructive'}>
                              {metric.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Button variant="outline" className="h-20 flex-col" onClick={() => onSectionChange('mood')}><Heart/>Log Mood</Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => onSectionChange('chatbot')}><Brain/>AI Support</Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => onSectionChange('resources')}><BookOpen/>Resources</Button>
                            <Button variant="outline" className="h-20 flex-col" onClick={() => onSectionChange('community')}><Users/>Community</Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                        <div className={`p-2 rounded-full ${activity.bgColor}`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader><CardTitle className="text-lg">Today's Goals</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingGoals.map((goal) => (
                      <div key={goal.title}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{goal.title}</span>
                          <Badge variant="outline" className={`text-xs bg-${goal.color}/10 text-${goal.color}`}>{goal.category}</Badge>
                        </div>
                        <Progress value={goal.progress} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Card className="border-0 shadow-lg">
                  <CardHeader><CardTitle className="text-lg">Wellness Streaks</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex items-center justify-between p-3 rounded-lg bg-sunny-orange/10">
                        <div className="flex items-center gap-3"><Flame className="w-5 h-5 text-sunny-orange" /><span className="text-sm font-medium">Daily Check-ins</span></div>
                        <Badge className="bg-sunny-orange/20 text-sunny-orange">1 day</Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-calm-blue/10">
                        <div className="flex items-center gap-3"><Moon className="w-5 h-5 text-calm-blue" /><span className="text-sm font-medium">Good Sleep</span></div>
                        <Badge className="bg-calm-blue/20 text-calm-blue">0 days</Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-warm-green/10">
                        <div className="flex items-center gap-3"><Dumbbell className="w-5 h-5 text-warm-green" /><span className="text-sm font-medium">Exercise</span></div>
                        <Badge className="bg-warm-green/20 text-warm-green">0 days</Badge>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <Card className="border-0 shadow-lg bg-mood-red/5">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="w-8 h-8 text-mood-red mx-auto mb-3"/>
                    <h3 className="font-semibold">Need Immediate Help?</h3>
                    <p className="text-xs text-muted-foreground mb-4">24/7 crisis support is available.</p>
                    <Button size="sm" variant="destructive" onClick={() => onSectionChange('crisis')}>Get Support Now</Button>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}