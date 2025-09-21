import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'
import { 
  Heart, 
  Brain, 
  Smile, 
  Frown, 
  Meh,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Zap,
  Coffee,
  Users,
  BookOpen,
  Home,
  Sun,
  Moon,
  Activity,
  Target,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react'

interface MoodEntry {
  id: string
  timestamp: string
  mood: number
  energy: number
  stress: number
  anxiety: number
  sleep_quality: number
  social_interaction: number
  academic_pressure: number
  physical_activity: number
  note: string
  tags: string[]
  context: {
    location: string
    time_of_day: string
    activities: string[]
    triggers: string[]
  }
}

export function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<number>(5)
  const [energy, setEnergy] = useState<number>(5)
  const [stress, setStress] = useState<number>(3)
  const [anxiety, setAnxiety] = useState<number>(3)
  const [sleepQuality, setSleepQuality] = useState<number>(7)
  const [socialInteraction, setSocialInteraction] = useState<number>(5)
  const [academicPressure, setAcademicPressure] = useState<number>(5)
  const [physicalActivity, setPhysicalActivity] = useState<number>(3)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState('campus')
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    // Load mood history from localStorage
    const savedHistory = localStorage.getItem('moodHistory')
    if (savedHistory) {
      setMoodHistory(JSON.parse(savedHistory))
    }
    
    // Calculate current streak
    calculateStreak()
  }, [])

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😁', '🤩', '🥳', '😍', '🚀']
  const energyLevels = ['😴', '😪', '😑', '🙂', '😊', '😃', '🤩', '⚡', '🚀', '💥']

  const moodTags = [
    { tag: 'Happy', color: 'warm-green' },
    { tag: 'Sad', color: 'mood-red' },
    { tag: 'Anxious', color: 'sunny-orange' },
    { tag: 'Excited', color: 'gentle-pink' },
    { tag: 'Frustrated', color: 'mood-red' },
    { tag: 'Calm', color: 'calm-blue' },
    { tag: 'Overwhelmed', color: 'sunny-orange' },
    { tag: 'Confident', color: 'warm-green' },
    { tag: 'Lonely', color: 'soft-purple' },
    { tag: 'Grateful', color: 'warm-green' },
    { tag: 'Motivated', color: 'gentle-pink' },
    { tag: 'Tired', color: 'calm-blue' },
    { tag: 'Stressed', color: 'mood-red' },
    { tag: 'Relaxed', color: 'calm-blue' }
  ]

  const activities = [
    { id: 'studying', label: 'Studying', icon: BookOpen, color: 'soft-purple' },
    { id: 'socializing', label: 'Socializing', icon: Users, color: 'gentle-pink' },
    { id: 'exercising', label: 'Exercising', icon: Activity, color: 'warm-green' },
    { id: 'resting', label: 'Resting', icon: Home, color: 'calm-blue' },
    { id: 'eating', label: 'Eating', icon: Coffee, color: 'sunny-orange' },
    { id: 'commuting', label: 'Commuting', icon: Clock, color: 'mood-red' }
  ]

  const locations = [
    { id: 'campus', label: 'On Campus', color: 'soft-purple' },
    { id: 'home', label: 'At Home', color: 'warm-green' },
    { id: 'library', label: 'Library', color: 'calm-blue' },
    { id: 'gym', label: 'Gym', color: 'sunny-orange' },
    { id: 'outdoors', label: 'Outdoors', color: 'gentle-pink' },
    { id: 'social', label: 'Social Space', color: 'mood-red' }
  ]

  const calculateStreak = () => {
    const today = new Date().toDateString()
    const savedHistory = localStorage.getItem('moodHistory')
    if (!savedHistory) return
    
    const history: MoodEntry[] = JSON.parse(savedHistory)
    let streak = 0
    let currentDate = new Date()
    
    // Check consecutive days with mood entries
    while (true) {
      const dateString = currentDate.toDateString()
      const hasEntry = history.some(entry => 
        new Date(entry.timestamp).toDateString() === dateString
      )
      
      if (hasEntry) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (streak === 0 && dateString !== today) {
        // If no entry today, don't count it against streak
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    setCurrentStreak(streak)
  }

  const getMoodDescription = (mood: number) => {
    if (mood <= 2) return 'Very Low'
    if (mood <= 4) return 'Low'
    if (mood <= 6) return 'Moderate'
    if (mood <= 8) return 'Good'
    return 'Excellent'
  }

  const getStressLevel = (stress: number) => {
    if (stress <= 2) return 'Very Low'
    if (stress <= 4) return 'Low'
    if (stress <= 6) return 'Moderate'
    if (stress <= 8) return 'High'
    return 'Very High'
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'text-mood-red'
    if (mood <= 6) return 'text-sunny-orange'
    return 'text-warm-green'
  }

  const getMoodGradient = (mood: number) => {
    if (mood <= 3) return 'from-mood-red/20 to-sunny-orange/20'
    if (mood <= 6) return 'from-sunny-orange/20 to-gentle-pink/20'
    return 'from-warm-green/20 to-calm-blue/20'
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 6) return 'night'
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood: currentMood,
      energy: energy,
      stress: stress,
      anxiety: anxiety,
      sleep_quality: sleepQuality,
      social_interaction: socialInteraction,
      academic_pressure: academicPressure,
      physical_activity: physicalActivity,
      note: note,
      tags: selectedTags,
      context: {
        location: selectedLocation,
        time_of_day: getTimeOfDay(),
        activities: selectedActivities,
        triggers: []
      }
    }

    const updatedHistory = [newEntry, ...moodHistory].slice(0, 30) // Keep last 30 entries
    setMoodHistory(updatedHistory)
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory))
    
    // Reset form
    setCurrentMood(5)
    setEnergy(5)
    setStress(3)
    setAnxiety(3)
    setSleepQuality(7)
    setSocialInteraction(5)
    setAcademicPressure(5)
    setPhysicalActivity(3)
    setNote('')
    setSelectedTags([])
    setSelectedActivities([])
    setSelectedLocation('campus')
    
    calculateStreak()
    toast.success('Mood entry saved successfully!')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    )
  }

  const getWeeklyAverage = () => {
    const lastWeek = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return entryDate >= weekAgo
    })
    
    if (lastWeek.length === 0) return 0
    
    const average = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length
    return Math.round(average * 10) / 10
  }

  const getTodaysEntries = () => {
    const today = new Date().toDateString()
    return moodHistory.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    )
  }

  return (
    <div className="min-h-screen bg-mood-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium bg-gradient-to-r from-gentle-pink to-sunny-orange bg-clip-text text-transparent flex items-center gap-2">
                Mood Tracker
                <Sparkles className="w-6 h-6 text-sunny-orange" />
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your daily emotional well-being and identify patterns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-sunny-orange/10 to-mood-red/10 text-sunny-orange border-sunny-orange/30">
                {currentStreak} day streak
              </Badge>
              {getWeeklyAverage() > 0 && (
                <Badge variant="outline" className="bg-gradient-to-r from-warm-green/10 to-calm-blue/10 border-warm-green/30">
                  Weekly avg: {getWeeklyAverage()}/10
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Today's Summary */}
        {getTodaysEntries().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-warm-green/10 to-calm-blue/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warm-green/20">
                      <CheckCircle className="w-6 h-6 text-warm-green" />
                    </div>
                    <span className="font-medium">
                      You've logged {getTodaysEntries().length} mood {getTodaysEntries().length === 1 ? 'entry' : 'entries'} today
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sunny-orange" />
                    Keep up the great work!
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tracking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Mood */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gentle-pink/20 to-mood-red/20">
                      <Heart className="w-6 h-6 text-gentle-pink" />
                    </div>
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Mood Scale */}
                  <div className="space-y-6">
                    <Label className="text-base font-medium">Current Mood</Label>
                    <div className="text-center space-y-6">
                      <div className="text-8xl">
                        {moodEmojis[currentMood - 1]}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Very Low</span>
                          <span className={`font-medium text-lg ${getMoodColor(currentMood)}`}>
                            {getMoodDescription(currentMood)} ({currentMood}/10)
                          </span>
                          <span>Excellent</span>
                        </div>
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${getMoodGradient(currentMood)}`}>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={currentMood}
                            onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                            className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Zap className="w-5 h-5 text-sunny-orange" />
                        Energy Level: {energy}/10
                      </Label>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-sunny-orange/10 to-gentle-pink/10">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={energy}
                          onChange={(e) => setEnergy(parseInt(e.target.value))}
                          className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Brain className="w-5 h-5 text-soft-purple" />
                        Stress Level: {getStressLevel(stress)}
                      </Label>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-soft-purple/10 to-calm-blue/10">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={stress}
                          onChange={(e) => setStress(parseInt(e.target.value))}
                          className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Anxiety Level: {anxiety}/10</Label>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-mood-red/10 to-sunny-orange/10">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={anxiety}
                          onChange={(e) => setAnxiety(parseInt(e.target.value))}
                          className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-2 text-base font-medium">
                        <Moon className="w-5 h-5 text-calm-blue" />
                        Sleep Quality: {sleepQuality}/10
                      </Label>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-calm-blue/10 to-warm-green/10">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={sleepQuality}
                          onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                          className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Context & Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-warm-green/20 to-calm-blue/20">
                      <Target className="w-6 h-6 text-warm-green" />
                    </div>
                    Context & Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Location */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Where are you?</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {locations.map((location) => (
                        <Button
                          key={location.id}
                          variant={selectedLocation === location.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLocation(location.id)}
                          className={`justify-center h-12 ${
                            selectedLocation === location.id 
                              ? `bg-${location.color} text-white hover:bg-${location.color}/90` 
                              : `bg-${location.color}/10 border-${location.color}/30 text-${location.color} hover:bg-${location.color}/20`
                          }`}
                        >
                          {location.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">What are you doing?</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activities.map((activity) => (
                        <Button
                          key={activity.id}
                          variant={selectedActivities.includes(activity.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleActivity(activity.id)}
                          className={`justify-start h-12 ${
                            selectedActivities.includes(activity.id)
                              ? `bg-${activity.color} text-white hover:bg-${activity.color}/90`
                              : `bg-${activity.color}/10 border-${activity.color}/30 text-${activity.color} hover:bg-${activity.color}/20`
                          }`}
                        >
                          <activity.icon className="w-4 h-4 mr-2" />
                          {activity.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Tags */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">How would you describe your mood?</Label>
                    <div className="flex flex-wrap gap-3">
                      {moodTags.map((tagObj) => (
                        <Badge
                          key={tagObj.tag}
                          variant={selectedTags.includes(tagObj.tag) ? "default" : "outline"}
                          className={`cursor-pointer py-2 px-4 text-sm transition-all duration-200 ${
                            selectedTags.includes(tagObj.tag)
                              ? `bg-${tagObj.color} text-white hover:bg-${tagObj.color}/90`
                              : `bg-${tagObj.color}/10 border-${tagObj.color}/30 text-${tagObj.color} hover:bg-${tagObj.color}/20`
                          }`}
                          onClick={() => toggleTag(tagObj.tag)}
                        >
                          {tagObj.tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Additional Notes (Optional)</Label>
                    <Textarea
                      placeholder="What's on your mind? Any specific thoughts or events affecting your mood today?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-24 bg-gradient-to-r from-muted/50 to-muted/30 border-primary/20"
                    />
                  </div>

                  <Button 
                    onClick={saveMoodEntry}
                    className="w-full h-14 bg-gradient-to-r from-gentle-pink to-sunny-orange hover:from-gentle-pink/90 hover:to-sunny-orange/90 text-white text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Save Mood Entry
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-soft-purple/20 to-gentle-pink/20">
                      <TrendingUp className="w-5 h-5 text-soft-purple" />
                    </div>
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warm-green/10">
                    <span className="text-sm font-medium">Average Mood</span>
                    <span className="font-medium text-warm-green">{getWeeklyAverage()}/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-calm-blue/10">
                    <span className="text-sm font-medium">Entries Logged</span>
                    <span className="font-medium text-calm-blue">{moodHistory.filter(entry => {
                      const entryDate = new Date(entry.timestamp)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return entryDate >= weekAgo
                    }).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-sunny-orange/10">
                    <span className="text-sm font-medium">Current Streak</span>
                    <Badge className="bg-sunny-orange/20 text-sunny-orange border-sunny-orange/30">
                      {currentStreak} days
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Entries */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gentle-pink/20 to-sunny-orange/20">
                      <Calendar className="w-5 h-5 text-gentle-pink" />
                    </div>
                    Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moodHistory.slice(0, 5).map((entry) => (
                      <div key={entry.id} className={`p-4 rounded-xl bg-gradient-to-r ${getMoodGradient(entry.mood)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                            <span className={`font-medium ${getMoodColor(entry.mood)}`}>{entry.mood}/10</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-white/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {moodHistory.length === 0 && (
                      <div className="text-center py-8">
                        <div className="p-4 rounded-full bg-gradient-to-br from-gentle-pink/20 to-sunny-orange/20 w-fit mx-auto mb-4">
                          <Heart className="w-8 h-8 text-gentle-pink" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No entries yet. Start tracking your mood!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-calm-blue/10 to-soft-purple/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-calm-blue/20 to-soft-purple/20">
                      <Sparkles className="w-5 h-5 text-calm-blue" />
                    </div>
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-calm-blue/10 to-soft-purple/10">
                      <p className="text-sm">
                        Regular mood tracking helps identify patterns and triggers for better emotional awareness.
                      </p>
                    </div>
                    {currentStreak >= 7 && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-warm-green/10 to-calm-blue/10">
                        <p className="text-sm">
                          🎉 Great job maintaining your {currentStreak}-day streak! Consistency is key to understanding your emotional patterns.
                        </p>
                      </div>
                    )}
                    {getWeeklyAverage() > 0 && getWeeklyAverage() < 4 && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-sunny-orange/10 to-gentle-pink/10">
                        <p className="text-sm">
                          Your mood has been lower this week. Consider reaching out to friends or counseling services if you need support.
                        </p>
                      </div>
                    )}
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