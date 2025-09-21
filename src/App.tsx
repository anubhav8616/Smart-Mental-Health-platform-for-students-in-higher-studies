// src/App.tsx

import { useState } from 'react';
import { Auth } from './components/auth';
import { Navigation } from './components/navigation';
import { Dashboard } from './components/dashboard';
import { AdminDashboard } from './components/admin-dashboard';
import { SelfAssessment } from './components/self-assessment';
import { MoodTracker } from './components/mood-tracker';
import { AIChatbot } from './components/ai-chatbot';
import { Resources } from './components/resources';
import { Community } from './components/community';
import { StudentReports } from './components/student-reports';
import { AdminReports } from './components/admin-reports';
import { CrisisSupport } from './components/crisis-support';
import  Profile  from './components/profile';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isAuthenticated) {
    return <Auth />;
  }

  const renderSection = () => {
    if (role === 'admin') {
      switch (activeSection) {
        case 'dashboard': return <AdminDashboard onSectionChange={setActiveSection} />;
        case 'reports': return <AdminReports />;
        case 'profile': return <Profile />; // ✨ 2. ADD PROFILE CASE FOR ADMIN
        default: return <AdminDashboard onSectionChange={setActiveSection} />;
      }
    } else {
      // Student sections
      switch (activeSection) {
        case 'dashboard': return <Dashboard onSectionChange={setActiveSection} userData={user} />;
        case 'assessment': return <SelfAssessment onComplete={() => setActiveSection('dashboard')} userData={user} />;
        case 'mood': return <MoodTracker />;
        case 'chatbot': return <AIChatbot />;
        case 'resources': return <Resources />;
        case 'community': return <Community />;
        case 'reports': return <StudentReports userData={user} />;
        case 'crisis': return <CrisisSupport />;
        case 'profile': return <Profile />; // ✨ 2. ADD PROFILE CASE FOR STUDENT
        default: return <Dashboard onSectionChange={setActiveSection} userData={user} />;
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userRole={role || 'student'}
        userData={user}
        onLogout={logout}
      />
      <div className="pt-24">
        {renderSection()}
      </div>
    </div>
  );
}