import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Home,
  Heart,
  Bot,
  BookOpen,
  Users,
  AlertTriangle,
  BarChart3,
  Shield,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  FileText,
  User as UserIcon, // Renamed to avoid conflict
  Globe
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'student' | 'admin';
  userData: any;
  onLogout: () => void;
}

export function Navigation({ activeSection, onSectionChange, userRole, userData, onLogout }: NavigationProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem(`username_${userData?.id}`);
    if (savedUsername) {
      setUsername(savedUsername);
    } else if (userData?.email) {
      setUsername(userData.email.split('@')[0]);
    }
  }, [userData]);


  const studentNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'mood', label: t('nav.mood'), icon: Heart },
    { id: 'chatbot', label: t('nav.chatbot'), icon: Bot },
    { id: 'resources', label: t('nav.resources'), icon: BookOpen },
    { id: 'community', label: t('nav.community'), icon: Users },
    { id: 'reports', label: t('nav.reports'), icon: FileText },
    { id: 'crisis', label: t('nav.crisis'), icon: AlertTriangle },
    { id: 'profile', label: t('nav.profile'), icon: UserIcon },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart3 },
    { id: 'students', label: t('nav.students'), icon: Users },
    { id: 'reports', label: t('nav.reports'), icon: FileText },
    { id: 'crisis', label: t('nav.crisis'), icon: AlertTriangle },
    { id: 'resources', label: t('nav.resources'), icon: BookOpen },
    { id: 'profile', label: t('nav.profile'), icon: UserIcon },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleNavItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Card className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border shadow-sm m-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium">MindSupport</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavItemClick(item.id)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-20 h-8">
                <Globe className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">हि</SelectItem>
                <SelectItem value="de">DE</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="ks">ک</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {/* Desktop User Info */}
            <div className="hidden sm:flex items-center gap-2 cursor-pointer" onClick={() => onSectionChange('profile')}>
              <Avatar>
                <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} className="hidden sm:flex">
              <LogOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

       {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
          {isMobileMenuOpen && (
              <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 right-0 h-full w-80 bg-background z-50 border-l shadow-2xl md:hidden"
              >
                <div className="p-6 pt-20">
                  <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="w-12 h-12"><AvatarFallback className="text-xl">{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium">{username}</p>
                      <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-2">
                      {navItems.map((item) => (
                          <Button key={item.id} variant={activeSection === item.id ? "default" : "ghost"} onClick={() => handleNavItemClick(item.id)} className="w-full justify-start h-12">
                              <item.icon className="w-5 h-5 mr-3" />
                              {item.label}
                          </Button>
                      ))}
                  </nav>
                  <div className="absolute bottom-6 left-6 right-6">
                      <Button variant="outline" onClick={onLogout} className="w-full justify-start h-12"><LogOut className="w-5 h-5 mr-3" />{t('nav.signOut')}</Button>
                  </div>
                </div>
              </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
