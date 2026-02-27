import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Auth() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthAction = () => {
    if (!email || !password) return;

    const fakeUser = {
      id: Date.now().toString(),
      email,
      role: activeTab,
    };

    login(fakeUser);
  };

  return (
    <div className="min-h-screen bg-wellness-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-warm-green to-calm-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-foreground mb-2">
            MindSupport
          </h1>
          <p className="text-muted-foreground text-sm">
            Mental Health Support System
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'student' | 'admin')
              }
              className="space-y-6"
            >
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleAuthAction}
                className="w-full h-12 bg-gradient-to-r from-calm-blue to-warm-green text-white shadow-lg"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs"
                >
                  {isSignUp
                    ? 'Already have an account? Sign In'
                    : 'New user? Sign Up here'}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}