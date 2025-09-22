import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'de' | 'es' | 'ks';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.students': 'Students',
    'nav.reports': 'Reports',
    'nav.crisis': 'Crisis',
    'nav.resources': 'Resources',
    'nav.profile': 'Profile',
    'nav.mood': 'Mood',
    'nav.chatbot': 'AI Chat',
    'nav.community': 'Community',
    'nav.signOut': 'Sign Out',
    'nav.language': 'Language',
    
    // Admin Dashboard
    'admin.title': 'Administrative Dashboard',
    'admin.subtitle': 'Monitor student mental health and system performance',
    'admin.systemHealthy': 'System Healthy',
    'admin.scheduleMeeting': 'Schedule Meeting',
    'admin.activeStudents': 'Active Students',
    'admin.crisisAlerts': 'Crisis Alerts',
    'admin.counselingSessions': 'Counseling Sessions',
    'admin.avgMoodScore': 'Avg. Mood Score',
    'admin.quickActions': 'Quick Actions',
    'admin.recentActivity': 'Recent Activity',
    'admin.systemAlerts': 'System Alerts',
    'admin.staffOnDuty': 'Staff on Duty',
    'admin.systemUptime': 'System Uptime',
    
    // Schedule Meeting
    'meeting.title': 'Schedule Meeting',
    'meeting.student': 'Student',
    'meeting.counselor': 'Counselor',
    'meeting.date': 'Date',
    'meeting.time': 'Time',
    'meeting.duration': 'Duration',
    'meeting.type': 'Meeting Type',
    'meeting.notes': 'Notes',
    'meeting.schedule': 'Schedule Meeting',
    'meeting.cancel': 'Cancel',
    'meeting.success': 'Meeting scheduled successfully!',
    'meeting.error': 'Failed to schedule meeting. Please try again.',
    'meeting.selectStudent': 'Select a student',
    'meeting.selectCounselor': 'Select a counselor',
    'meeting.selectType': 'Select meeting type',
    
    // Meeting Types
    'meetingType.counseling': 'Counseling Session',
    'meetingType.crisis': 'Crisis Intervention',
    'meetingType.followup': 'Follow-up Session',
    'meetingType.assessment': 'Assessment',
    'meetingType.group': 'Group Session',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.analytics': 'विश्लेषण',
    'nav.students': 'छात्र',
    'nav.reports': 'रिपोर्ट',
    'nav.crisis': 'संकट',
    'nav.resources': 'संसाधन',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.mood': 'मनोदशा',
    'nav.chatbot': 'AI चैट',
    'nav.community': 'समुदाय',
    'nav.signOut': 'साइन आउट',
    'nav.language': 'भाषा',
    
    // Admin Dashboard
    'admin.title': 'प्रशासनिक डैशबोर्ड',
    'admin.subtitle': 'छात्र मानसिक स्वास्थ्य और सिस्टम प्रदर्शन की निगरानी करें',
    'admin.systemHealthy': 'सिस्टम स्वस्थ',
    'admin.scheduleMeeting': 'मीटिंग शेड्यूल करें',
    'admin.activeStudents': 'सक्रिय छात्र',
    'admin.crisisAlerts': 'संकट अलर्ट',
    'admin.counselingSessions': 'परामर्श सत्र',
    'admin.avgMoodScore': 'औसत मनोदशा स्कोर',
    'admin.quickActions': 'त्वरित कार्य',
    'admin.recentActivity': 'हाल की गतिविधि',
    'admin.systemAlerts': 'सिस्टम अलर्ट',
    'admin.staffOnDuty': 'ड्यूटी पर स्टाफ',
    'admin.systemUptime': 'सिस्टम अपटाइम',
    
    // Schedule Meeting
    'meeting.title': 'मीटिंग शेड्यूल करें',
    'meeting.student': 'छात्र',
    'meeting.counselor': 'परामर्शदाता',
    'meeting.date': 'तारीख',
    'meeting.time': 'समय',
    'meeting.duration': 'अवधि',
    'meeting.type': 'मीटिंग प्रकार',
    'meeting.notes': 'नोट्स',
    'meeting.schedule': 'मीटिंग शेड्यूल करें',
    'meeting.cancel': 'रद्द करें',
    'meeting.success': 'मीटिंग सफलतापूर्वक शेड्यूल हो गई!',
    'meeting.error': 'मीटिंग शेड्यूल करने में विफल। कृपया पुनः प्रयास करें।',
    'meeting.selectStudent': 'एक छात्र चुनें',
    'meeting.selectCounselor': 'एक परामर्शदाता चुनें',
    'meeting.selectType': 'मीटिंग प्रकार चुनें',
    
    // Meeting Types
    'meetingType.counseling': 'परामर्श सत्र',
    'meetingType.crisis': 'संकट हस्तक्षेप',
    'meetingType.followup': 'फॉलो-अप सत्र',
    'meetingType.assessment': 'मूल्यांकन',
    'meetingType.group': 'समूह सत्र',
    
    // Common
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytik',
    'nav.students': 'Studenten',
    'nav.reports': 'Berichte',
    'nav.crisis': 'Krise',
    'nav.resources': 'Ressourcen',
    'nav.profile': 'Profil',
    'nav.mood': 'Stimmung',
    'nav.chatbot': 'KI-Chat',
    'nav.community': 'Gemeinschaft',
    'nav.signOut': 'Abmelden',
    'nav.language': 'Sprache',
    
    // Admin Dashboard
    'admin.title': 'Administratives Dashboard',
    'admin.subtitle': 'Überwachen Sie die psychische Gesundheit der Studenten und die Systemleistung',
    'admin.systemHealthy': 'System Gesund',
    'admin.scheduleMeeting': 'Meeting Planen',
    'admin.activeStudents': 'Aktive Studenten',
    'admin.crisisAlerts': 'Krisen-Alerts',
    'admin.counselingSessions': 'Beratungssitzungen',
    'admin.avgMoodScore': 'Durchschnittliche Stimmung',
    'admin.quickActions': 'Schnellaktionen',
    'admin.recentActivity': 'Letzte Aktivität',
    'admin.systemAlerts': 'System-Alerts',
    'admin.staffOnDuty': 'Diensthabendes Personal',
    'admin.systemUptime': 'System-Verfügbarkeit',
    
    // Schedule Meeting
    'meeting.title': 'Meeting Planen',
    'meeting.student': 'Student',
    'meeting.counselor': 'Berater',
    'meeting.date': 'Datum',
    'meeting.time': 'Zeit',
    'meeting.duration': 'Dauer',
    'meeting.type': 'Meeting-Typ',
    'meeting.notes': 'Notizen',
    'meeting.schedule': 'Meeting Planen',
    'meeting.cancel': 'Abbrechen',
    'meeting.success': 'Meeting erfolgreich geplant!',
    'meeting.error': 'Meeting konnte nicht geplant werden. Bitte versuchen Sie es erneut.',
    'meeting.selectStudent': 'Student auswählen',
    'meeting.selectCounselor': 'Berater auswählen',
    'meeting.selectType': 'Meeting-Typ auswählen',
    
    // Meeting Types
    'meetingType.counseling': 'Beratungssitzung',
    'meetingType.crisis': 'Krisenintervention',
    'meetingType.followup': 'Nachfolgesitzung',
    'meetingType.assessment': 'Bewertung',
    'meetingType.group': 'Gruppensitzung',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.analytics': 'Análisis',
    'nav.students': 'Estudiantes',
    'nav.reports': 'Informes',
    'nav.crisis': 'Crisis',
    'nav.resources': 'Recursos',
    'nav.profile': 'Perfil',
    'nav.mood': 'Estado de Ánimo',
    'nav.chatbot': 'Chat IA',
    'nav.community': 'Comunidad',
    'nav.signOut': 'Cerrar Sesión',
    'nav.language': 'Idioma',
    
    // Admin Dashboard
    'admin.title': 'Panel Administrativo',
    'admin.subtitle': 'Monitorear la salud mental de los estudiantes y el rendimiento del sistema',
    'admin.systemHealthy': 'Sistema Saludable',
    'admin.scheduleMeeting': 'Programar Reunión',
    'admin.activeStudents': 'Estudiantes Activos',
    'admin.crisisAlerts': 'Alertas de Crisis',
    'admin.counselingSessions': 'Sesiones de Consejería',
    'admin.avgMoodScore': 'Puntuación Promedio de Estado de Ánimo',
    'admin.quickActions': 'Acciones Rápidas',
    'admin.recentActivity': 'Actividad Reciente',
    'admin.systemAlerts': 'Alertas del Sistema',
    'admin.staffOnDuty': 'Personal de Guardia',
    'admin.systemUptime': 'Tiempo de Actividad del Sistema',
    
    // Schedule Meeting
    'meeting.title': 'Programar Reunión',
    'meeting.student': 'Estudiante',
    'meeting.counselor': 'Consejero',
    'meeting.date': 'Fecha',
    'meeting.time': 'Hora',
    'meeting.duration': 'Duración',
    'meeting.type': 'Tipo de Reunión',
    'meeting.notes': 'Notas',
    'meeting.schedule': 'Programar Reunión',
    'meeting.cancel': 'Cancelar',
    'meeting.success': '¡Reunión programada exitosamente!',
    'meeting.error': 'Error al programar la reunión. Por favor, inténtelo de nuevo.',
    'meeting.selectStudent': 'Seleccionar estudiante',
    'meeting.selectCounselor': 'Seleccionar consejero',
    'meeting.selectType': 'Seleccionar tipo de reunión',
    
    // Meeting Types
    'meetingType.counseling': 'Sesión de Consejería',
    'meetingType.crisis': 'Intervención de Crisis',
    'meetingType.followup': 'Sesión de Seguimiento',
    'meetingType.assessment': 'Evaluación',
    'meetingType.group': 'Sesión Grupal',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
  },
  ks: {
    // Navigation
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.analytics': 'تجزیہ',
    'nav.students': 'طالب علم',
    'nav.reports': 'رپورٹس',
    'nav.crisis': 'بحران',
    'nav.resources': 'وسائل',
    'nav.profile': 'پروفائل',
    'nav.mood': 'موڈ',
    'nav.chatbot': 'AI چیٹ',
    'nav.community': 'کمیونٹی',
    'nav.signOut': 'سائن آؤٹ',
    'nav.language': 'زبان',
    
    // Admin Dashboard
    'admin.title': 'انتظامی ڈیش بورڈ',
    'admin.subtitle': 'طالب علموں کی ذہنی صحت اور سسٹم کی کارکردگی کی نگرانی کریں',
    'admin.systemHealthy': 'سسٹم صحت مند',
    'admin.scheduleMeeting': 'میٹنگ شیڈول کریں',
    'admin.activeStudents': 'فعال طالب علم',
    'admin.crisisAlerts': 'بحران کے الارم',
    'admin.counselingSessions': 'کونسلنگ سیشن',
    'admin.avgMoodScore': 'اوسط موڈ سکور',
    'admin.quickActions': 'فوری اقدامات',
    'admin.recentActivity': 'حالیہ سرگرمی',
    'admin.systemAlerts': 'سسٹم الارم',
    'admin.staffOnDuty': 'ڈیوٹی پر عملہ',
    'admin.systemUptime': 'سسٹم اپ ٹائم',
    
    // Schedule Meeting
    'meeting.title': 'میٹنگ شیڈول کریں',
    'meeting.student': 'طالب علم',
    'meeting.counselor': 'کونسلر',
    'meeting.date': 'تاریخ',
    'meeting.time': 'وقت',
    'meeting.duration': 'دورانیہ',
    'meeting.type': 'میٹنگ کی قسم',
    'meeting.notes': 'نوٹس',
    'meeting.schedule': 'میٹنگ شیڈول کریں',
    'meeting.cancel': 'منسوخ کریں',
    'meeting.success': 'میٹنگ کامیابی سے شیڈول ہو گئی!',
    'meeting.error': 'میٹنگ شیڈول کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔',
    'meeting.selectStudent': 'طالب علم منتخب کریں',
    'meeting.selectCounselor': 'کونسلر منتخب کریں',
    'meeting.selectType': 'میٹنگ کی قسم منتخب کریں',
    
    // Meeting Types
    'meetingType.counseling': 'کونسلنگ سیشن',
    'meetingType.crisis': 'بحران مداخلت',
    'meetingType.followup': 'فالو اپ سیشن',
    'meetingType.assessment': 'تشخیص',
    'meetingType.group': 'گروپ سیشن',
    
    // Common
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ کریں',
    'common.close': 'بند کریں',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'خرابی',
    'common.success': 'کامیابی',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
