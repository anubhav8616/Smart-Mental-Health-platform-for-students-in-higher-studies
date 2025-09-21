import { motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Brain, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageCircle,
  Clock,
  Shield,
  Lightbulb,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
  sentiment?: 'positive' | 'neutral' | 'negative' | 'crisis'
  confidence?: number
  suggestions?: string[]
  resources?: Array<{
    title: string
    type: 'technique' | 'resource' | 'emergency'
    action: string
  }>
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI mental health companion. I'm here to listen, provide support, and help you with coping strategies. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
      sentiment: 'positive'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationContext, setConversationContext] = useState<{
    userMood: string
    topics: string[]
    riskLevel: 'low' | 'medium' | 'high'
    sessionDuration: number
  }>({
    userMood: 'neutral',
    topics: [],
    riskLevel: 'low',
    sessionDuration: 0
  })
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Track session duration
    const interval = setInterval(() => {
      setConversationContext(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const analyzeSentiment = (text: string): { sentiment: 'positive' | 'neutral' | 'negative' | 'crisis', confidence: number } => {
    const lowerText = text.toLowerCase()
    
    // Crisis indicators
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'no point', 'hurt myself', 'die', 'worthless']
    const hasCrisisIndicators = crisisKeywords.some(keyword => lowerText.includes(keyword))
    
    if (hasCrisisIndicators) {
      return { sentiment: 'crisis', confidence: 0.9 }
    }

    // Negative sentiment
    const negativeKeywords = ['sad', 'depressed', 'anxious', 'overwhelmed', 'stressed', 'lonely', 'frustrated', 'hopeless', 'tired', 'angry']
    const negativeCount = negativeKeywords.filter(keyword => lowerText.includes(keyword)).length

    // Positive sentiment
    const positiveKeywords = ['happy', 'good', 'great', 'excited', 'grateful', 'better', 'accomplished', 'proud', 'calm', 'peaceful']
    const positiveCount = positiveKeywords.filter(keyword => lowerText.includes(keyword)).length

    if (negativeCount > positiveCount && negativeCount > 0) {
      return { sentiment: 'negative', confidence: Math.min(0.8, negativeCount * 0.2) }
    } else if (positiveCount > negativeCount && positiveCount > 0) {
      return { sentiment: 'positive', confidence: Math.min(0.8, positiveCount * 0.2) }
    }

    return { sentiment: 'neutral', confidence: 0.5 }
  }

  const generateResponse = (userMessage: string, sentiment: string): { content: string, suggestions?: string[], resources?: any[] } => {
    const responses = {
      crisis: {
        content: "I'm very concerned about what you've shared. Your feelings are valid, but I want you to know that help is available. Please consider reaching out to a crisis counselor immediately. You don't have to go through this alone.",
        suggestions: ['Talk to crisis counselor', 'Call emergency services', 'Contact trusted friend'],
        resources: [
          { title: 'Crisis Text Line', type: 'emergency', action: 'Text HOME to 741741' },
          { title: 'National Suicide Prevention Lifeline', type: 'emergency', action: 'Call 988' },
          { title: 'Campus Counseling Center', type: 'emergency', action: 'Call (555) 123-4568' }
        ]
      },
      negative: {
        content: "I hear that you're going through a difficult time. It's completely normal to have these feelings, and I'm here to support you. Would you like to try a coping technique or talk more about what's bothering you?",
        suggestions: ['Try breathing exercise', 'Explore feelings', 'Find campus resources'],
        resources: [
          { title: '4-7-8 Breathing Technique', type: 'technique', action: 'Practice now' },
          { title: 'Mindfulness Exercise', type: 'technique', action: 'Start guided session' },
          { title: 'Counseling Services', type: 'resource', action: 'Learn more' }
        ]
      },
      positive: {
        content: "It's wonderful to hear that you're feeling good! Positive emotions are just as important to acknowledge. What's contributing to these good feelings? Sharing positive experiences can help reinforce them.",
        suggestions: ['Share what\'s working', 'Set new goals', 'Help others'],
        resources: [
          { title: 'Gratitude Practice', type: 'technique', action: 'Start journaling' },
          { title: 'Goal Setting', type: 'technique', action: 'Create wellness goals' }
        ]
      },
      neutral: {
        content: "Thank you for sharing. I'm here to listen and support you in whatever way you need. Would you like to explore how you're feeling in more detail, or is there something specific you'd like to talk about?",
        suggestions: ['Explore feelings', 'Daily check-in', 'Stress management'],
        resources: [
          { title: 'Mood Assessment', type: 'resource', action: 'Take quick assessment' },
          { title: 'Stress Relief Techniques', type: 'technique', action: 'Browse options' }
        ]
      }
    }

    return responses[sentiment as keyof typeof responses] || responses.neutral
  }

  const updateConversationContext = (userMessage: string, sentiment: string) => {
    const topics = conversationContext.topics
    const messageWords = userMessage.toLowerCase().split(' ')
    
    // Extract topics
    const topicKeywords = ['study', 'exam', 'relationship', 'family', 'sleep', 'anxiety', 'depression', 'stress', 'work']
    const newTopics = topicKeywords.filter(topic => 
      messageWords.some(word => word.includes(topic)) && !topics.includes(topic)
    )

    // Update risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (sentiment === 'crisis') riskLevel = 'high'
    else if (sentiment === 'negative') riskLevel = 'medium'

    setConversationContext(prev => ({
      ...prev,
      userMood: sentiment,
      topics: [...topics, ...newTopics].slice(-5), // Keep last 5 topics
      riskLevel
    }))
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Analyze sentiment
    const { sentiment, confidence } = analyzeSentiment(inputMessage)
    
    // Update conversation context
    updateConversationContext(inputMessage, sentiment)

    // Simulate AI processing time
    setTimeout(() => {
      const response = generateResponse(inputMessage, sentiment)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        sentiment: sentiment as any,
        confidence,
        suggestions: response.suggestions,
        resources: response.resources
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-warm-green'
      case 'negative': return 'text-sunny-orange'
      case 'crisis': return 'text-mood-red'
      default: return 'text-calm-blue'
    }
  }

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return ThumbsUp
      case 'negative': return ThumbsDown
      case 'crisis': return AlertTriangle
      default: return MessageCircle
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-gradient-to-r from-mood-red/10 to-sunny-orange/10 text-mood-red border-mood-red/30'
      case 'medium': return 'bg-gradient-to-r from-sunny-orange/10 to-gentle-pink/10 text-sunny-orange border-sunny-orange/30'
      default: return 'bg-gradient-to-r from-warm-green/10 to-calm-blue/10 text-warm-green border-warm-green/30'
    }
  }

  const getSentimentBadgeColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-gradient-to-r from-warm-green/10 to-calm-blue/10 text-warm-green border-warm-green/30'
      case 'negative': return 'bg-gradient-to-r from-sunny-orange/10 to-gentle-pink/10 text-sunny-orange border-sunny-orange/30'
      case 'crisis': return 'bg-gradient-to-r from-mood-red/10 to-sunny-orange/10 text-mood-red border-mood-red/30'
      default: return 'bg-gradient-to-r from-calm-blue/10 to-soft-purple/10 text-calm-blue border-calm-blue/30'
    }
  }

  return (
    <div className="min-h-screen bg-ai-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium bg-gradient-to-r from-calm-blue to-soft-purple bg-clip-text text-transparent flex items-center gap-2">
                AI Mental Health Support
                <Sparkles className="w-6 h-6 text-sunny-orange" />
              </h1>
              <p className="text-muted-foreground mt-2">
                24/7 AI companion with sentiment analysis and crisis detection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getRiskLevelColor(conversationContext.riskLevel)}>
                <Shield className="w-3 h-3 mr-1" />
                Risk: {conversationContext.riskLevel}
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-gentle-pink/10 to-sunny-orange/10 border-gentle-pink/30">
                <Clock className="w-3 h-3 mr-1" />
                {conversationContext.sessionDuration}m
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-[600px] flex flex-col border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4 bg-gradient-to-r from-calm-blue/5 to-soft-purple/5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-calm-blue/20 to-soft-purple/20">
                      <Bot className="w-6 h-6 text-calm-blue" />
                    </div>
                    AI Companion
                    <Badge variant="outline" className="ml-auto bg-gradient-to-r from-warm-green/10 to-calm-blue/10 border-warm-green/30 text-warm-green">
                      <Shield className="w-3 h-3 mr-1" />
                      Confidential
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
                    <div className="space-y-4 pb-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-3">
                          <div className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender === 'bot' && (
                              <Avatar className="w-10 h-10 bg-gradient-to-br from-calm-blue to-soft-purple shadow-lg">
                                <AvatarFallback className="text-white">
                                  <Bot className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-1' : ''}`}>
                              <div className={`p-4 rounded-2xl shadow-sm ${
                                message.sender === 'user' 
                                  ? 'bg-gradient-to-br from-gentle-pink to-sunny-orange text-white' 
                                  : 'bg-gradient-to-br from-muted/80 to-muted/60 backdrop-blur-sm'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-2 px-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                                {message.sentiment && message.sender === 'user' && (
                                  <Badge variant="outline" className={`text-xs ${getSentimentBadgeColor(message.sentiment)}`}>
                                    {(() => {
                                      const SentimentIcon = getSentimentIcon(message.sentiment)
                                      return (
                                        <>
                                          <SentimentIcon className={`w-3 h-3 mr-1 ${getSentimentColor(message.sentiment)}`} />
                                          {message.sentiment}
                                        </>
                                      )
                                    })()}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {message.sender === 'user' && (
                              <Avatar className="w-10 h-10 bg-gradient-to-br from-soft-purple to-gentle-pink shadow-lg">
                                <AvatarFallback className="text-white">
                                  <User className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>

                          {/* Bot suggestions and resources */}
                          {message.sender === 'bot' && (message.suggestions || message.resources) && (
                            <div className="ml-13 space-y-4">
                              {message.suggestions && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Quick Actions:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Button key={index} variant="outline" size="sm" className="h-8 bg-gradient-to-r from-calm-blue/10 to-soft-purple/10 border-calm-blue/30 text-calm-blue hover:from-calm-blue/20 hover:to-soft-purple/20">
                                        {suggestion}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {message.resources && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                    <Lightbulb className="w-3 h-3" />
                                    Resources:
                                  </p>
                                  <div className="space-y-2">
                                    {message.resources.map((resource, index) => (
                                      <div 
                                        key={index} 
                                        className={`p-3 rounded-lg border-2 text-sm shadow-sm ${
                                          resource.type === 'emergency' ? 'bg-gradient-to-r from-mood-red/10 to-sunny-orange/10 border-mood-red/30' :
                                          resource.type === 'technique' ? 'bg-gradient-to-r from-calm-blue/10 to-soft-purple/10 border-calm-blue/30' :
                                          'bg-gradient-to-r from-warm-green/10 to-calm-blue/10 border-warm-green/30'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">{resource.title}</span>
                                          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-soft-purple hover:text-soft-purple/80">
                                            {resource.action} →
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-calm-blue to-soft-purple shadow-lg">
                            <AvatarFallback className="text-white">
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gradient-to-br from-muted/80 to-muted/60 p-4 rounded-2xl backdrop-blur-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-soft-purple rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-soft-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-soft-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Input */}
                  <div className="p-6 bg-gradient-to-r from-calm-blue/5 to-soft-purple/5">
                    <div className="flex gap-3">
                      <Input
                        ref={inputRef}
                        placeholder="Share what's on your mind..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 h-12 bg-gradient-to-r from-card to-card/80 border-2 border-primary/20 focus:border-primary/50"
                      />
                      <Button 
                        onClick={sendMessage} 
                        size="sm" 
                        className="h-12 px-6 bg-gradient-to-r from-gentle-pink to-sunny-orange hover:from-gentle-pink/90 hover:to-sunny-orange/90 text-white shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      This AI provides support but is not a replacement for professional mental health care.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-soft-purple/20 to-calm-blue/20">
                      <Brain className="w-5 h-5 text-soft-purple" />
                    </div>
                    Session Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20">
                      <span className="text-sm font-medium">Current Mood</span>
                      <Badge variant="outline" className={getSentimentBadgeColor(conversationContext.userMood)}>
                        {conversationContext.userMood}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge className={getRiskLevelColor(conversationContext.riskLevel)}>
                        {conversationContext.riskLevel}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20">
                      <span className="text-sm font-medium">Session Time</span>
                      <span className="text-sm font-medium text-calm-blue">
                        {conversationContext.sessionDuration}min
                      </span>
                    </div>
                  </div>

                  {conversationContext.topics.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-soft-purple/10 to-gentle-pink/10">
                      <p className="text-sm font-medium mb-2">Discussion Topics</p>
                      <div className="flex flex-wrap gap-1">
                        {conversationContext.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-white/70">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-sunny-orange/20 to-gentle-pink/20">
                      <Lightbulb className="w-5 h-5 text-sunny-orange" />
                    </div>
                    Quick Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-gentle-pink/10 to-mood-red/5 border-gentle-pink/30 hover:from-gentle-pink/20 hover:to-mood-red/10">
                    <Heart className="w-4 h-4 mr-2 text-gentle-pink" />
                    Breathing Exercise
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-soft-purple/10 to-calm-blue/5 border-soft-purple/30 hover:from-soft-purple/20 hover:to-calm-blue/10">
                    <Brain className="w-4 h-4 mr-2 text-soft-purple" />
                    Mindfulness Guide
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-warm-green/10 to-calm-blue/5 border-warm-green/30 hover:from-warm-green/20 hover:to-calm-blue/10">
                    <MessageCircle className="w-4 h-4 mr-2 text-warm-green" />
                    Campus Counseling
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-gradient-to-r from-mood-red/10 to-sunny-orange/5 border-mood-red/30 hover:from-mood-red/20 hover:to-sunny-orange/10">
                    <AlertTriangle className="w-4 h-4 mr-2 text-mood-red" />
                    Crisis Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-warm-green/10 to-calm-blue/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="p-3 rounded-full bg-gradient-to-br from-warm-green/20 to-calm-blue/20 w-fit mx-auto">
                      <Shield className="w-6 h-6 text-warm-green" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your conversations are confidential and encrypted. Data is used only to improve support quality.
                    </p>
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