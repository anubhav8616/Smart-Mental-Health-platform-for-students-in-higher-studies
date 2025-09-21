import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Progress } from './ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Calendar, Download, FileText, TrendingUp, TrendingDown, Activity, Heart, Brain, Clock } from 'lucide-react'

interface StudentReportsProps {
  userData?: any
}

interface MoodEntry {
  timestamp: string
  mood: number
  anxiety: number
  stress: number
  sleep_quality: number
}

interface AssessmentResult {
    timestamp: string;
    scores: {
        depression: { score: number; severity: string };
        anxiety: { score: number; severity: string };
        academicStress: { score: number; severity: string };
    };
}

export function StudentReports({ userData }: StudentReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    if (userData?.id) {
        const moodHistoryStr = localStorage.getItem('moodHistory');
        const assessmentHistoryStr = localStorage.getItem(`assessmentHistory_${userData.id}`);
        
        if (moodHistoryStr) setMoodHistory(JSON.parse(moodHistoryStr));
        if (assessmentHistoryStr) setAssessmentHistory(JSON.parse(assessmentHistoryStr));
    }
  }, [userData]);
  
  const filteredMoodData = moodHistory.filter(entry => entry.timestamp.startsWith(selectedMonth));
  const filteredAssessmentData = assessmentHistory.filter(entry => entry.timestamp.startsWith(selectedMonth));

  const monthlyStats = {
    averageMood: filteredMoodData.length ? (filteredMoodData.reduce((sum, entry) => sum + entry.mood, 0) / filteredMoodData.length).toFixed(1) : 'N/A',
    moodTrend: (() => {
        if (assessmentHistory.length < 2) return 'stable';
        const last = assessmentHistory[0].scores.depression.score + assessmentHistory[0].scores.anxiety.score;
        const prev = assessmentHistory[1].scores.depression.score + assessmentHistory[1].scores.anxiety.score;
        return last < prev ? 'up' : 'down';
    })(),
    sessionsCompleted: 14, // This seems to be external data
    goalsAchieved: 18, // This seems to be external data
    totalGoals: 22, // This seems to be external data
    sleepAverage: filteredMoodData.length ? (filteredMoodData.reduce((sum, entry) => sum + entry.sleep_quality, 0) / filteredMoodData.length).toFixed(1) : 'N/A',
  };

  const getRecommendations = (result: AssessmentResult) => {
      const recs = [];
      if (result.scores.depression.score > 9) recs.push('Consider CBT for depression');
      if (result.scores.anxiety.score > 9) recs.push('Practice mindfulness for anxiety');
      if (result.scores.academicStress.score > 5) recs.push('Utilize time management resources');
      if (recs.length === 0) recs.push('Maintain current wellness practices');
      return recs;
  }
  
  const medicalReports = filteredAssessmentData.map((result, index) => ({
      id: index,
      date: result.timestamp,
      type: 'Mental Health Assessment',
      provider: 'Self-Assessment System',
      status: 'Complete',
      summary: `Assessment shows ${result.scores.depression.severity.toLowerCase()} depression, ${result.scores.anxiety.severity.toLowerCase()} anxiety, and ${result.scores.academicStress.severity.toLowerCase()} academic stress.`,
      recommendations: getRecommendations(result),
  }));

  const goalDistribution = (() => {
    const latestAssessment = assessmentHistory[0];
    if (!latestAssessment) return [];
    
    const { depression, anxiety, academicStress } = latestAssessment.scores;
    const total = depression.score + anxiety.score + academicStress.score;
    
    if (total === 0) return [{ name: 'Overall Wellness', value: 100, color: '#82ca9d' }];

    return [
      { name: 'Depression', value: (depression.score / total) * 100, color: '#8884d8' },
      { name: 'Anxiety', value: (anxiety.score / total) * 100, color: '#ffc658' },
      { name: 'Stress', value: (academicStress.score / total) * 100, color: '#ff7300' },
    ];
  })();

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: d.toISOString().slice(0, 7),
      label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 bg-pattern-dots gradient-mesh py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent mb-2">
                My Reports & Records
              </h1>
              <p className="text-muted-foreground">Track your mental health journey and progress over time</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
              <TabsTrigger value="medical">Medical Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Mood</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">{monthlyStats.averageMood}</p>
                          {monthlyStats.moodTrend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <Brain className="w-8 h-8 text-violet-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sessions Completed</p>
                        <p className="text-2xl font-bold">{monthlyStats.sessionsCompleted}</p>
                      </div>
                      <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Goals Progress</p>
                        <p className="text-2xl font-bold">{Math.round((monthlyStats.goalsAchieved / monthlyStats.totalGoals) * 100)}%</p>
                        <Progress value={(monthlyStats.goalsAchieved / monthlyStats.totalGoals) * 100} className="mt-2" />
                      </div>
                      <Heart className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Sleep Average</p>
                        <p className="text-2xl font-bold">{monthlyStats.sleepAverage}h</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Mood Tracking</CardTitle>
                  <CardDescription>Your mood, anxiety, stress, and sleep patterns from daily logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {filteredMoodData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredMoodData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="timestamp" 
                            tickFormatter={(value) => new Date(value).getDate().toString()}
                          />
                          <YAxis domain={[0, 10]} />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} name="Mood" />
                          <Line type="monotone" dataKey="anxiety" stroke="#ff7300" strokeWidth={2} name="Anxiety" />
                          <Line type="monotone" dataKey="stress" stroke="#ffc658" strokeWidth={2} name="Stress" />
                          <Line type="monotone" dataKey="sleep_quality" stroke="#82ca9d" strokeWidth={2} name="Sleep" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">No daily mood data for this month.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Focus Areas</CardTitle>
                    <CardDescription>Distribution based on your latest assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={goalDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {goalDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="medical" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Reports</CardTitle>
                  <CardDescription>Your complete assessment history and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalReports.length > 0 ? medicalReports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: report.id * 0.1 }}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-primary" />
                              <h3 className="font-medium">{report.type}</h3>
                              <Badge variant="outline">{report.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(report.date).toLocaleDateString()}
                                </span>
                                <span>Provider: {report.provider}</span>
                              </div>
                            </div>
                            <p className="text-sm mb-3">{report.summary}</p>
                            <div>
                              <p className="text-sm font-medium mb-1">Recommendations:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {report.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground">No assessment reports for this month.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}