import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Download,
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Building2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Student {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  department?: string;
  year?: string;
  created_at: string;
  last_sign_in_at?: string;
  role: string;
  profile?: {
    id: string;
    username: string;
    phone?: string;
    hobbies?: string;
    email?: string;
    department?: string;
    year?: string;
    email_visible: boolean;
    phone_visible: boolean;
    all_notifications: boolean;
    mood_reminders: boolean;
    community_updates: boolean;
    updated_at: string;
  };
}

interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  notes?: string;
  created_at: string;
}

interface AssessmentResult {
  id: string;
  user_id: string;
  phq9_score: number;
  gad7_score: number;
  created_at: string;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentResult[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Fetch all students from Supabase using profiles table
  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Get all profiles from the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      console.log('Profiles query result:', { profiles, profilesError });
      console.log('First profile structure:', profiles?.[0]);
      console.log('All profile keys:', profiles?.[0] ? Object.keys(profiles[0]) : 'No profiles');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setStudents([]);
        setFilteredStudents([]);
        return;
      }

      // Convert profiles to student format
      const studentsWithProfiles = (profiles || []).map((profile) => {
        // Try to get email from various sources
        let email = 'No email';
        
        // Check if profile has email field
        if (profile.email) {
          email = profile.email;
        }
        // Check if username is actually an email
        else if (profile.username && profile.username.includes('@')) {
          email = profile.username;
        }
        
        return {
          id: profile.id,
          email: email,
          username: profile.username || 'User',
          phone: profile.phone || '',
          department: profile.department || '',
          year: profile.year || '',
          created_at: profile.updated_at || new Date().toISOString(),
          last_sign_in_at: profile.last_sign_in_at || null,
          role: 'student', // Default to student for profiles
          profile: profile
        };
      });

      setStudents(studentsWithProfiles);
      setFilteredStudents(studentsWithProfiles);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch mood data for analytics
  const fetchMoodData = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('updated_at', { ascending: true });

      if (error) {
        console.log('Mood entries table not found or no data:', error.message);
        setMoodData([]);
        return;
      }

      setMoodData(data || []);
    } catch (error) {
      console.log('Error fetching mood data:', error);
      setMoodData([]);
    }
  };

  // Fetch assessment data for analytics
  const fetchAssessmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('updated_at', { ascending: true });

      if (error) {
        console.log('Assessment results table not found or no data:', error.message);
        setAssessmentData([]);
        return;
      }

      setAssessmentData(data || []);
    } catch (error) {
      console.log('Error fetching assessment data:', error);
      setAssessmentData([]);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMoodData();
    fetchAssessmentData();
  }, []);

  // Filter students based on search and role
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(student => student.role === filterRole);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterRole]);

  // Delete student (remove from profiles table only)
  const deleteStudent = async (studentId: string) => {
    try {
      // Delete profile from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        return;
      }

      // Refresh the list
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Get risk level based on assessment scores
  const getRiskLevel = (student: Student) => {
    const studentAssessments = assessmentData.filter(a => a.user_id === student.id);
    if (studentAssessments.length === 0) return 'Unknown';
    
    const latestAssessment = studentAssessments[studentAssessments.length - 1];
    const totalScore = latestAssessment.phq9_score + latestAssessment.gad7_score;
    
    if (totalScore >= 20) return 'High';
    if (totalScore >= 10) return 'Medium';
    return 'Low';
  };

  // Get recent mood score
  const getRecentMood = (student: Student) => {
    const studentMoods = moodData.filter(m => m.user_id === student.id);
    if (studentMoods.length === 0) return null;
    
    return studentMoods[studentMoods.length - 1].mood_score;
  };

  // Analytics data
  const analyticsData = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.last_sign_in_at && 
      new Date(s.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    highRiskStudents: students.filter(s => getRiskLevel(s) === 'High').length,
    averageMood: moodData.length > 0 ? 
      moodData.reduce((sum, m) => sum + m.mood_score, 0) / moodData.length : 0
  };

  // Mood trend data for charts
  const moodTrendData = moodData.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, mood: 0, count: 0 };
    }
    acc[date].mood += entry.mood_score;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { date: string; mood: number; count: number }>);

  const chartData = Object.values(moodTrendData).map(item => ({
    date: item.date,
    mood: item.mood / item.count
  }));

  // Risk level distribution
  const riskDistribution = students.reduce((acc, student) => {
    const risk = getRiskLevel(student);
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage and monitor student accounts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAnalytics(!showAnalytics)} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{analyticsData.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active (30 days)</p>
                  <p className="text-2xl font-bold">{analyticsData.activeStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold">{analyticsData.highRiskStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Mood</p>
                  <p className="text-2xl font-bold">{analyticsData.averageMood.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {showAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(riskDistribution).map(([key, value]) => ({ name: key, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(riskDistribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRole === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterRole('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterRole === 'student' ? 'default' : 'outline'}
                onClick={() => setFilterRole('student')}
                size="sm"
              >
                Students
              </Button>
              <Button
                variant={filterRole === 'admin' ? 'default' : 'outline'}
                onClick={() => setFilterRole('admin')}
                size="sm"
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Recent Mood</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const riskLevel = getRiskLevel(student);
                const recentMood = getRecentMood(student);
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.username}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{student.email || student.profile?.email || 'No email'}</span>
                        </div>
                        {(student.phone || student.profile?.phone) && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{student.phone || student.profile?.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {(student.department || student.profile?.department) && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{student.department || student.profile?.department}</span>
                          </div>
                        )}
                        {(student.year || student.profile?.year) && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{student.year || student.profile?.year}</span>
                          </div>
                        )}
                        {!(student.department || student.profile?.department) && !(student.year || student.profile?.year) && (
                          <span className="text-sm text-muted-foreground">Not specified</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={riskLevel === 'High' ? 'destructive' : 
                                riskLevel === 'Medium' ? 'secondary' : 'default'}
                      >
                        {riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {recentMood ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{recentMood}/10</span>
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(recentMood / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No data</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.last_sign_in_at ? 
                          new Date(student.last_sign_in_at).toLocaleDateString() : 
                          'Never'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                            </DialogHeader>
                            {selectedStudent && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Basic Information</h4>
                                    <p className="text-sm text-muted-foreground">Email: {selectedStudent.email || selectedStudent.profile?.email || 'No email'}</p>
                                    <p className="text-sm text-muted-foreground">Username: {selectedStudent.username || selectedStudent.profile?.username || 'User'}</p>
                                    <p className="text-sm text-muted-foreground">Phone: {selectedStudent.phone || selectedStudent.profile?.phone || 'Not specified'}</p>
                                    <p className="text-sm text-muted-foreground">Department: {selectedStudent.department || selectedStudent.profile?.department || 'Not specified'}</p>
                                    <p className="text-sm text-muted-foreground">Year: {selectedStudent.year || selectedStudent.profile?.year || 'Not specified'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Account Status</h4>
                                    <p className="text-sm text-muted-foreground">Role: {selectedStudent.role}</p>
                                    <p className="text-sm text-muted-foreground">Created: {new Date(selectedStudent.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-muted-foreground">Last Active: {selectedStudent.last_sign_in_at ? new Date(selectedStudent.last_sign_in_at).toLocaleDateString() : 'Never'}</p>
                                    <p className="text-sm text-muted-foreground">Profile Updated: {selectedStudent.profile?.updated_at ? new Date(selectedStudent.profile.updated_at).toLocaleDateString() : 'Never'}</p>
                                  </div>
                                </div>
                                {selectedStudent.profile && (
                                  <div>
                                    <h4 className="font-medium">Profile Settings</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <p>Email Visible: {selectedStudent.profile.email_visible ? 'Yes' : 'No'}</p>
                                      <p>Phone Visible: {selectedStudent.profile.phone_visible ? 'Yes' : 'No'}</p>
                                      <p>Mood Reminders: {selectedStudent.profile.mood_reminders ? 'Yes' : 'No'}</p>
                                      <p>Community Updates: {selectedStudent.profile.community_updates ? 'Yes' : 'No'}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {student.username}? This action cannot be undone.
                                This will permanently remove their account and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteStudent(student.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {students.length === 0 
                  ? "No students found in database. Students will appear here once they create accounts."
                  : "No students match your search criteria."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
