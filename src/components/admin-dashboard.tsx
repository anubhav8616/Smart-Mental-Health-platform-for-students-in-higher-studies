import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  Shield,
  Activity,
  CheckCircle
} from 'lucide-react'

interface AdminDashboardProps {
  onSectionChange: (section: string) => void
}

export function AdminDashboard({ onSectionChange }: AdminDashboardProps) {
  const stats = [
    { title: 'Active Students', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
    { title: 'Crisis Alerts', value: '3', change: 'This week', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
    { title: 'Counseling Sessions', value: '156', change: 'This month', icon: Calendar, color: 'text-green-600 dark:text-green-400' },
    { title: 'Avg. Mood Score', value: '7.2/10', change: '+0.3', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
  ]

  const alerts = [
    { type: 'crisis', message: 'Student requires immediate attention', time: '5 min ago', severity: 'high' },
    { type: 'system', message: 'AI chatbot usage increased 25%', time: '2 hours ago', severity: 'medium' },
    { type: 'appointment', message: '12 counseling sessions scheduled today', time: '3 hours ago', severity: 'low' },
  ]

  const recentActivity = [
    { action: 'Crisis intervention completed', user: 'Dr. Smith', time: '1 hour ago' },
    { action: 'Monthly report generated', user: 'System', time: '2 hours ago' },
    { action: 'New counselor onboarded', user: 'HR Department', time: '1 day ago' },
    { action: 'Student welfare check', user: 'Dr. Johnson', time: '1 day ago' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium text-foreground">
                Administrative Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Monitor student mental health and system performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-600/20 bg-green-600/10 text-green-600 dark:text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                      <p className="text-xl font-medium mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-16 flex flex-col items-center justify-center space-y-1"
                      onClick={() => onSectionChange('analytics')}
                    >
                      <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs">Analytics</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 flex flex-col items-center justify-center space-y-1"
                      onClick={() => onSectionChange('crisis')}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-xs">Crisis Management</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 flex flex-col items-center justify-center space-y-1"
                      onClick={() => onSectionChange('students')}
                    >
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-xs">Student Overview</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-4 h-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">by {activity.user}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="w-4 h-4" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.severity === 'high'
                            ? 'bg-red-600/10 border-red-600/50 text-red-800 dark:text-red-400'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-600/10 border-yellow-600/50 text-yellow-800 dark:text-yellow-400'
                            : 'bg-blue-600/10 border-blue-600/50 text-blue-800 dark:text-blue-400'
                        }`}
                      >
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Staff on Duty */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4" />
                    Staff on Duty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Dr. Sarah Johnson', role: 'Crisis Counselor', status: 'Available' },
                      { name: 'Dr. Michael Chen', role: 'Therapist', status: 'In Session' },
                      { name: 'Lisa Rodriguez', role: 'Peer Counselor', status: 'Available' },
                    ].map((staff, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="w-7 h-7 bg-gradient-to-br from-primary to-primary/70">
                          <AvatarFallback className="text-primary-foreground text-xs">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.role}</p>
                        </div>
                        <Badge 
                          variant={staff.status === 'Available' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            staff.status === 'Available' 
                              ? 'bg-green-600/10 text-green-600 dark:text-green-400 hover:bg-green-600/20 border-green-600/20' 
                              : ''
                          }`}
                        >
                          {staff.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="border shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <CheckCircle className="w-8 h-8 mx-auto text-primary" />
                    <div>
                      <p className="text-lg font-medium">94.2%</p>
                      <p className="text-sm text-muted-foreground">System Uptime</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}