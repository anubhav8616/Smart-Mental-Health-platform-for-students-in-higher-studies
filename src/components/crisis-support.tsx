import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Phone, MessageCircle, Shield, Wind, University } from 'lucide-react';

// Data for resources can be managed here or fetched from a CMS
const immediateHelp = [
  {
    title: 'Emergency Services',
    description: 'For immediate danger to yourself or to others.',
    contact: '112',
    icon: Phone,
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    title: 'National Crisis & Suicide Hotline',
    description: '24/7, free and confidential support.',
    contact: '9152987821',
    icon: Phone,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 from anywhere in the India.',
    contact: '741741',
    icon: MessageCircle,
    color: 'bg-green-500 hover:bg-green-600',
  },
];

const universityResources = [
    { name: 'Campus Counseling Services', hours: 'M-F, 9am-5pm', phone: '800-103-8484' },
    { name: 'University Police (Non-Emergency)', hours: '24/7', phone: '1800 103 8484' },
    { name: 'Dean of Students Office', hours: 'M-F, 9am-5pm', phone: '0120-7199360' },
];

const groundingTechniques = [
  {
    title: '5-4-3-2-1 Method',
    steps: [
      'Acknowledge 5 things you can see.',
      'Acknowledge 4 things you can touch.',
      'Acknowledge 3 things you can hear.',
      'Acknowledge 2 things you can smell.',
      'Acknowledge 1 thing you can taste.',
    ],
  },
  {
    title: 'Box Breathing',
    steps: [
      'Breathe in for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Breathe out for 4 seconds.',
      'Hold your breath for 4 seconds.',
      'Repeat until you feel calmer.',
    ],
  },
];

export function CrisisSupport() {
  return (
    <div className="min-h-screen bg-wellness-gradient p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Crisis Support</h1>
          <p className="text-muted-foreground mt-2">
            If you are in immediate danger, please use the resources below. You are not alone.
          </p>
        </motion.div>

        {/* Immediate Help Section */}
        <Card className="mb-8 border-red-500/20 bg-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400 text-center text-2xl">
              Are you in immediate danger?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {immediateHelp.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <a href={`tel:${item.contact}`} className="block h-full">
                  <Button className={`w-full h-full p-6 flex flex-col justify-center text-white shadow-lg ${item.color}`}>
                    <item.icon className="w-8 h-8 mb-2" />
                    <span className="font-semibold text-lg">{item.title}</span>
                    <span className="font-bold text-2xl my-1">{item.contact}</span>
                    <span className="text-xs opacity-90">{item.description}</span>
                  </Button>
                </a>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grounding Techniques */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card className="h-full bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wind className="text-primary"/>Grounding Techniques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {groundingTechniques.map(technique => (
                            <div key={technique.title}>
                                <h3 className="font-semibold mb-2">{technique.title}</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {technique.steps.map(step => <li key={step}>{step}</li>)}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* University Resources */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="h-full bg-card/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><University className="text-primary"/>University Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {universityResources.map(resource => (
                            <div key={resource.name} className="p-3 bg-muted/50 rounded-lg">
                                <p className="font-semibold">{resource.name}</p>
                                <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                    <span>{resource.hours}</span>
                                    <a href={`tel:${resource.phone}`} className="font-medium text-primary hover:underline">
                                        {resource.phone}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
      </div>
    </div>
  );
}

