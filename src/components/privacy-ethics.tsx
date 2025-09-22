import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  Shield, 
  Lock, 
  Eye, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  Users,
  Database,
  Key,
  FileText,
  Clock,
  Globe
} from 'lucide-react'

export function PrivacyEthics() {
  const privacyPrinciples = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All personal data is encrypted both in transit and at rest using industry-standard AES-256 encryption.'
    },
    {
      icon: Eye,
      title: 'Data Minimization',
      description: 'We collect only the minimum data necessary for mental health support and delete it after the retention period.'
    },
    {
      icon: Users,
      title: 'Anonymization',
      description: 'Personal identifiers are removed from analytics data to protect individual privacy while enabling research.'
    },
    {
      icon: Key,
      title: 'User Control',
      description: 'You have complete control over your data - view, export, or delete your information at any time.'
    }
  ]

  const ethicalGuidelines = [
    {
      icon: Heart,
      title: 'Not a Replacement for Professional Care',
      description: 'This platform supplements but never replaces professional mental health treatment.',
      level: 'critical'
    },
    {
      icon: AlertTriangle,
      title: 'Crisis Detection & Response',
      description: 'Automated systems detect crisis indicators and immediately connect users to emergency resources.',
      level: 'important'
    },
    {
      icon: Shield,
      title: 'Bias-Free AI',
      description: 'Our AI models are trained on diverse datasets and regularly audited for bias and fairness.',
      level: 'standard'
    },
    {
      icon: FileText,
      title: 'Transparent Algorithms',
      description: 'AI recommendations are explainable and users can understand how suggestions are generated.',
      level: 'standard'
    }
  ]

  const dataHandling = [
    {
      category: 'Assessment Data',
      retention: '2 years',
      purpose: 'Track progress and provide insights',
      sharing: 'Anonymized research only'
    },
    {
      category: 'Mood Entries',
      retention: '1 year',
      purpose: 'Personalized recommendations',
      sharing: 'Not shared'
    },
    {
      category: 'Chat Logs',
      retention: '6 months',
      purpose: 'Improve AI responses',
      sharing: 'Anonymized training data'
    },
    {
      category: 'Usage Analytics',
      retention: '90 days',
      purpose: 'Platform improvement',
      sharing: 'Aggregated statistics only'
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-600/20 bg-red-600/10 text-red-600 dark:text-red-400'
      case 'important': return 'border-yellow-600/20 bg-yellow-600/10 text-yellow-600 dark:text-yellow-400'
      default: return 'border-blue-600/20 bg-blue-600/10 text-blue-600 dark:text-blue-400'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-2xl font-medium text-foreground mb-2">Privacy & Ethics</h1>
            <p className="text-muted-foreground">
              Your privacy and ethical treatment are our highest priorities
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Privacy Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Protection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  How we safeguard your personal and mental health data
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {privacyPrinciples.map((principle, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <principle.icon className="w-4 h-4 text-primary" />
                        <h3 className="font-medium">{principle.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ethical Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Ethical AI & Mental Health
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Responsible approach to AI-powered mental health support
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ethicalGuidelines.map((guideline, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border-l-4 ${getLevelColor(guideline.level)}`}
                    >
                      <div className="flex items-start gap-3">
                        <guideline.icon className="w-5 h-5 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{guideline.title}</h3>
                          <p className="text-sm opacity-90">{guideline.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Handling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Handling Transparency
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed breakdown of how different types of data are managed
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-medium">Data Type</th>
                        <th className="text-left py-3 font-medium">Retention</th>
                        <th className="text-left py-3 font-medium">Purpose</th>
                        <th className="text-left py-3 font-medium">Sharing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataHandling.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {item.retention}
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {item.purpose}
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {item.sharing}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Legal Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium mb-1">FERPA</h3>
                    <p className="text-xs text-muted-foreground">
                      Educational privacy rights protected
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium mb-1">HIPAA</h3>
                    <p className="text-xs text-muted-foreground">
                      Health information privacy standards
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium mb-1">GDPR</h3>
                    <p className="text-xs text-muted-foreground">
                      European data protection compliance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Protocols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="border shadow-sm bg-gradient-to-br from-red-600/5 to-red-600/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Crisis Response Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <h3 className="font-medium mb-2">Automated Crisis Detection</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our AI monitors for crisis indicators in assessments and interactions:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Expressions of self-harm or suicidal thoughts</li>
                      <li>• Severe depression or anxiety scores</li>
                      <li>• Sudden dramatic mood changes</li>
                      <li>• Requests for immediate help</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-background border">
                    <h3 className="font-medium mb-2">Immediate Response Actions</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      When crisis indicators are detected, the system automatically:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Displays emergency contact information</li>
                      <li>• Offers immediate connection to crisis counselors</li>
                      <li>• Notifies campus mental health services (with consent)</li>
                      <li>• Provides de-escalation resources and techniques</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-red-600/10 border border-red-600/20">
                    <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">Important Disclaimer</h3>
                    <p className="text-sm text-red-800 dark:text-red-400">
                      This platform is designed to support mental wellness but is not a substitute for professional 
                      mental health care. In emergencies, always call 112 or your local emergency services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <h3 className="font-medium">Questions about Privacy or Ethics?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our Data Protection Officer at privacy@mindsupport.edu
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Version 1.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}