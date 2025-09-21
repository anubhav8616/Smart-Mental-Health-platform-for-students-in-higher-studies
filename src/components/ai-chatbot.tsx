import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Shield,
} from 'lucide-react';

// --- Helper UI Components (to resolve import errors) ---
// These are simplified versions of the original UI components.

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`font-semibold tracking-tight text-lg ${className}`}>{children}</h3>
);

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props}>
    {children}
  </button>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} ref={ref} {...props} />
));

const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);

const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </span>
);

// FIX: Wrapped ScrollArea with React.forwardRef to properly accept the ref.
const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
    <div ref={ref} className={`relative overflow-y-auto ${className}`} {...props}>
        {children}
    </div>
));


const Separator = ({ className }: { className?: string }) => (
  <div className={`shrink-0 bg-border h-[1px] w-full ${className}`} />
);

//
// ─── THERAPEUTIC PERSONA PROMPT ─────────────────────────────────────────────────
//

const systemPrompt = {
  role: "system",
  content: `You are a supportive and empathetic AI mental health companion for university students. Your name is 'MindMate'.
  - Your primary goal is to provide a safe, non-judgmental space for students to express their feelings.
  - Always respond with compassion, understanding, and encouragement.
  - Use a warm and gentle tone. Keep your responses concise and easy to understand.
  - Never give medical advice, a diagnosis, or tell the user what to do. Instead, empower them by exploring their feelings and suggesting coping strategies or resources.
  - Ask open-ended questions to encourage reflection (e.g., "How did that make you feel?", "What was that experience like for you?").
  - If the user expresses feelings of sadness or stress, validate their emotions (e.g., "It sounds like you're going through a lot right now," "That sounds incredibly difficult.").
  - If the user is in crisis (mentions self-harm, suicide, or wanting to die), you MUST respond with: "I'm very concerned by what you've shared. It's incredibly brave of you to talk about this, and I want you to know that help is available right now. Please reach out to a crisis hotline or a mental health professional immediately. You are not alone in this." and then provide a list of emergency resources.
  - Remember the conversation history and refer to it to show you are listening.`,
};

//
// ─── COMPONENT INTERFACES ───────────────────────────────────────────────────────
//

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' 
}

//
// ─── MAIN CHATBOT COMPONENT ─────────────────────────────────────────────────────
//

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI mental health companion. I'm here to listen, provide support, and help you with coping strategies. How are you feeling today?",
      role: 'assistant',
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      //
      // ─── API CALL TO GROQ (using fetch to avoid dependency issues) ──────────────
      //
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        // FIX: Added a specific error message for missing API key.
        throw new Error("VITE_GROQ_API_KEY is not configured in your .env file.");
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                systemPrompt,
                ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
            ],
            model: "gemma2-9b-it"
        })
      });
      
      if (!response.ok) {
        const errorBody = await response.json();
        console.error("API Error Body:", errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || "I'm not sure how to respond to that. Could you please rephrase?";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        role: 'assistant',
      }
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error: any) {
      console.error("Error fetching response from Groq:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        // FIX: Display a more informative error message in the chat.
        content: `I'm sorry, I encountered an error: ${error.message}`,
        role: 'assistant',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-ai-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-medium bg-gradient-to-r from-calm-blue to-soft-purple bg-clip-text text-transparent flex items-center justify-center gap-2">
            AI Mental Health Support
            <Sparkles className="w-6 h-6 text-sunny-orange" />
          </h1>
          <p className="text-muted-foreground mt-2">
            Your confidential and supportive space to talk.
          </p>
        </motion.div>

        {/* Main Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-[70vh] flex flex-col border-0 shadow-2xl bg-card/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-4 bg-gradient-to-r from-calm-blue/5 to-soft-purple/5 border-b border-slate-200/80">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-calm-blue/20 to-soft-purple/20">
                  <Bot className="w-6 h-6 text-calm-blue" />
                </div>
                MindMate
                <Badge className="ml-auto bg-gradient-to-r from-warm-green/10 to-calm-blue/10 border-warm-green/30 text-warm-green">
                  <Shield className="w-3 h-3 mr-1" />
                  Confidential
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-calm-blue to-soft-purple shadow-lg">
                          <AvatarFallback className="text-white bg-transparent">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl shadow-sm break-words ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-lg' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-lg'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.role === 'user' && (
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-soft-purple to-gentle-pink shadow-lg">
                           <AvatarFallback className="text-white bg-transparent">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-3 items-start">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-calm-blue to-soft-purple shadow-lg">
                        <AvatarFallback className="text-white bg-transparent">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm rounded-bl-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

              {/* Input */}
              <div className="p-4 bg-white/50 dark:bg-slate-800/50">
                <div className="flex gap-3 items-center">
                  <Input
                    placeholder="Share what's on your mind..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 h-12 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={sendMessage} 
                    size="icon" 
                    className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full disabled:bg-indigo-400"
                    disabled={isTyping || !inputMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
            This AI provides support but is not a replacement for professional mental health care.
        </p>
      </div>
    </div>
  )
}

