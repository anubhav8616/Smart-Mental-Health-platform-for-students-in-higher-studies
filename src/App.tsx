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
import { useAuth } from './context/AuthContext'; // Import the useAuth hook

export default function App() {
  // Get everything needed from the global AuthContext
  const { isAuthenticated, user, role, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isAuthenticated) {
    // The onLogin prop is no longer needed as the context handles it
    return <Auth />;
  }

  const renderSection = () => {
    // This rendering logic remains the same
    if (role === 'admin') {
      switch (activeSection) {
        case 'dashboard': return <AdminDashboard onSectionChange={setActiveSection} />;
        case 'reports': return <AdminReports />;
        // Add other admin sections here as needed
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
        onLogout={logout} // Use the logout function from the context
      />
      <div className="pt-24">
        {renderSection()}
      </div>
    </div>
  );
}

