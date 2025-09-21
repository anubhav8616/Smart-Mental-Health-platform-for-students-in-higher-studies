import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { useAuth } from '../context/AuthContext';
import { User, Edit3, Bell, Users, Save, X, CheckCircle } from 'lucide-react';

// A helper hook to keep state in sync with localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [value, setStoredValue];
}


export function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id || 'guest';

  const [moodReminders, setMoodReminders] = useLocalStorageState(`moodReminders_${userId}`, true);
  const [communityUpdates, setCommunityUpdates] = useLocalStorageState(`communityUpdates_${userId}`, false);

  // Load username from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem(`username_${userId}`);
    const initialUsername = savedUsername || user?.email?.split('@')[0] || 'User';
    setUsername(initialUsername);
    setOriginalUsername(initialUsername);
  }, [user, userId]);

  const handleEditClick = () => {
    setOriginalUsername(username);
    setIsEditing(true);
    // Focus the input field on the next render cycle
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveUsername = useCallback(() => {
    if (!username.trim()) return; // Prevent saving empty username
    
    localStorage.setItem(`username_${userId}`, username.trim());
    setIsEditing(false);
    setSaveStatus('success');
    
    // Show success message for 3 seconds
    setTimeout(() => setSaveStatus('idle'), 3000);
    // Here you would also update it in your Supabase 'profiles' table
  }, [username, userId]);

  const handleCancelEdit = () => {
    setUsername(originalUsername);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-10"
        >
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Manage your account settings, notifications, and personal details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Summary Card (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <Card className="rounded-2xl border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 dark:border-slate-700">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                   <Avatar className="w-24 h-24" title={username}>
                    <AvatarFallback className="text-4xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200" aria-hidden="true">
                      {username ? username.charAt(0).toUpperCase() : <User />}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-semibold mt-4 text-slate-800 dark:text-slate-100 truncate w-full">{username}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate w-full">{user?.email}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="rounded-2xl border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 dark:border-slate-700">
              <CardHeader className="p-8 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-lg font-medium text-slate-800 dark:text-slate-100">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Username Section */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-medium text-slate-700 dark:text-slate-300">Display Name</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="username"
                      ref={inputRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      disabled={!isEditing}
                      className="disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:bg-slate-900"
                    />
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveUsername} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!username.trim()}>
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="ghost" size="icon"><X className="w-4 h-4 text-slate-500" /></Button>
                      </>
                    ) : (
                      <Button onClick={handleEditClick} variant="outline" size="sm" className="dark:border-slate-600">
                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    )}
                  </div>
                  <AnimatePresence>
                    {saveStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        aria-live="polite"
                        className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Username saved successfully.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notifications Section */}
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Notifications</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage how you receive updates from the platform.</p>
                  <div className="space-y-3 pt-2">
                    <Label
                      htmlFor="mood-reminders"
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Mood Check-in Reminders</span>
                      </div>
                      <Switch 
                        id="mood-reminders" 
                        checked={moodReminders}
                        onCheckedChange={setMoodReminders}
                        aria-label="Toggle mood check-in reminders"
                      />
                    </Label>
                    <Label
                      htmlFor="community-updates"
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <Users className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">Community Updates</span>
                      </div>
                      <Switch 
                        id="community-updates" 
                        checked={communityUpdates}
                        onCheckedChange={setCommunityUpdates}
                        aria-label="Toggle community updates"
                      />
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}