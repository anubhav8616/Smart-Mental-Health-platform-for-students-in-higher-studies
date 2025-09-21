import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, GraduationCap, Building2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthAction = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simple password validation
    if (isSignUp && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: activeTab },
          },
        });
        if (error) throw error;
        setSuccessMessage('Success! Please check your email to verify your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wellness-gradient flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements from original component */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 180, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 left-20 w-32 h-32 bg-soft-purple/20 rounded-full blur-xl" />
            <motion.div animate={{ x: [0, -120, 0], y: [0, 80, 0], rotate: [0, -180, -360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-20 right-20 w-40 h-40 bg-gentle-pink/20 rounded-full blur-xl" />
        </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-warm-green to-calm-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-foreground mb-2">MindSupport</h1>
            <p className="text-muted-foreground text-sm">Mental Health Support System</p>
        </div>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'student' | 'admin')} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                <TabsTrigger value="student" className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4" /> Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" /> Admin
                </TabsTrigger>
              </TabsList>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">University Email</Label>
                    <Input id="email" type="email" placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>

                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                {successMessage && <p className="text-sm text-center text-green-500">{successMessage}</p>}

                <Button onClick={handleAuthAction} disabled={loading} className="w-full h-12 bg-gradient-to-r from-calm-blue to-warm-green text-white shadow-lg">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>

                <div className="text-center">
                    <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-xs">
                        {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up here"}
                    </Button>
                </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
