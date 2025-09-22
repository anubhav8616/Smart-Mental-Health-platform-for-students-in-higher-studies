import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Search, Download, Users, AlertTriangle, Eye, Phone } from 'lucide-react';

// --- MOCK DATA & CONSTANTS (Moved outside the component for clarity) ---

const studentRecords = [
  { id: 'STU001', name: 'Emma Thompson', department: 'Computer Science', year: '3rd Year', riskLevel: 'Low', status: 'Active', condition: 'Minimal Anxiety', recentMood: 7.2, totalSessions: 12, nextAppointment: '2025-10-05' },
  { id: 'STU002', name: 'James Rodriguez', department: 'Psychology', year: '2nd Year', riskLevel: 'Medium', status: 'Monitoring', condition: 'Moderate Depression', recentMood: 5.5, totalSessions: 8, nextAppointment: '2025-10-02' },
  { id: 'STU003', name: 'Sarah Chen', department: 'Biology', year: '4th Year', riskLevel: 'High', status: 'Critical', condition: 'Severe Depression, Severe Anxiety', recentMood: 3.8, totalSessions: 18, nextAppointment: '2025-09-28' },
  { id: 'STU004', name: 'Michael Johnson', department: 'Engineering', year: '1st Year', riskLevel: 'Low', status: 'Active', condition: 'Mild Academic Stress', recentMood: 6.9, totalSessions: 5, nextAppointment: '2025-10-08' },
  { id: 'STU005', name: 'Lisa Wang', department: 'Business', year: '3rd Year', riskLevel: 'Medium', status: 'Monitoring', condition: 'Moderate Anxiety', recentMood: 6.1, totalSessions: 15, nextAppointment: '2025-10-10' },
  { id: 'STU006', name: 'David Park', department: 'Art', year: '2nd Year', riskLevel: 'Low', status: 'Active', condition: 'Minimal Depression', recentMood: 7.8, totalSessions: 7, nextAppointment: '2025-10-15' }
];

const monthlyTrends = [
  { month: 'Apr', newCases: 28, resolved: 10, active: 76 },
  { month: 'May', newCases: 25, resolved: 18, active: 83 },
  { month: 'Jun', newCases: 32, resolved: 20, active: 95 },
  { month: 'Jul', newCases: 28, resolved: 25, active: 98 },
  { month: 'Aug', newCases: 35, resolved: 22, active: 111 },
  { month: 'Sep', newCases: 30, resolved: 30, active: 111 }
];

const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#82ca9d' },
  { name: 'Medium Risk', value: 35, color: '#ffc658' },
  { name: 'High Risk', value: 15, color: '#ff7300' },
  { name: 'Critical', value: 5, color: '#d4183d' }
];

const departmentStats = [
  { department: 'Computer Science', students: 28, avgMood: 6.2, sessions: 156 },
  { department: 'Psychology', students: 22, avgMood: 6.8, sessions: 134 },
  { department: 'Engineering', students: 35, avgMood: 5.9, sessions: 198 },
  { department: 'Biology', students: 18, avgMood: 6.5, sessions: 98 },
  { department: 'Business', students: 25, avgMood: 6.1, sessions: 145 },
  { department: 'Art', students: 15, avgMood: 7.1, sessions: 89 }
];

const overallStats = {
  totalStudents: 143,
  activeStudents: 95,
  criticalCases: 7,
  avgMoodScore: 6.4,
  monthlyIncrease: 12
};

// --- HELPER FUNCTIONS ---

const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'Monitoring': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

// --- SUB-COMPONENTS for each TAB ---

function OverviewTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>New cases, resolved cases, and active students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="active" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="newCases" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="resolved" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution</CardTitle>
          <CardDescription>Current risk assessment of all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentRecordsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredRecords = studentRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Medical Records</CardTitle>
        <CardDescription>Comprehensive view of all student mental health records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder='Search by name, ID, or department...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Monitoring">Monitoring</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder='Department' /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {[...new Set(studentRecords.map(r => r.department))].map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recent Mood</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium">{record.name}</div>
                    <div className="text-sm text-muted-foreground">{record.id} • {record.year}</div>
                  </TableCell>
                  <TableCell>{record.condition}</TableCell>
                  <TableCell><Badge className={getRiskBadgeColor(record.riskLevel)}>{record.riskLevel}</Badge></TableCell>
                  <TableCell><Badge className={getStatusBadgeColor(record.status)}>{record.status}</Badge></TableCell>
                  <TableCell>{record.recentMood}/10</TableCell>
                  <TableCell>{new Date(record.nextAppointment).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentsTab() {
  return(
    <Card>
        <CardHeader>
          <CardTitle>Departmental Analytics</CardTitle>
          <CardDescription>Mental health metrics broken down by academic department</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentStats} layout="vertical" margin={{ left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="department" width={120} />
                        <Tooltip />
                        <Bar dataKey="avgMood" fill="#8884d8" name='Average Mood' />
                        <Bar dataKey="students" fill="#82ca9d" name='Total Students' />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
  );
}

// --- MAIN ADMIN REPORTS COMPONENT ---

export function AdminReports() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Student Health Reports</h1>
              <p className="text-muted-foreground">Comprehensive medical records and mental health analytics</p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
            </div>
          </div>

          {/* Critical Alert */}
          <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-300">
              <strong>{overallStats.criticalCases} students</strong> require immediate attention.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{overallStats.totalStudents}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Active Cases</p><p className="text-2xl font-bold">{overallStats.activeStudents}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Critical Cases</p><p className="text-2xl font-bold text-red-600">{overallStats.criticalCases}</p></CardContent></Card>
              <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Avg Mood Score</p><p className="text-2xl font-bold">{overallStats.avgMoodScore}</p></CardContent></Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="records">Student Records</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-6"><OverviewTab /></TabsContent>
            <TabsContent value="records" className="space-y-6 mt-6"><StudentRecordsTab /></TabsContent>
            <TabsContent value="departments" className="space-y-6 mt-6"><DepartmentsTab /></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}