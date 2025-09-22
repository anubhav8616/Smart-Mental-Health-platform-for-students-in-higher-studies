import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Clock, Users, FileText, CheckCircle2, User, UserCog, ListChecks, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from './ui/utils';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

// --- Helper Interfaces ---
interface ScheduleMeetingProps {
  onClose: () => void;
}
interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  name?: string;
}

// --- Main Component ---
export function ScheduleMeeting({ onClose }: ScheduleMeetingProps) {
  const { t } = useLanguage();

  // Stepper State
  const [step, setStep] = useState(1);

  // Form Data State
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [meetingType, setMeetingType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // UI & Data Loading State
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // FIX: Fetch all profiles without filtering by role, as the 'role' column likely doesn't exist.
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email');
          
        if (profilesError) throw profilesError;
        setAllUsers(profilesData || []);

      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load user data. Please check your Supabase table and RLS policies.');
      }
    };
    loadUsers();
  }, []);

  // --- Navigation and Submission Logic ---
  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedStudent || !selectedCounselor || !selectedDate || !selectedTime || !meetingType) {
        throw new Error('All required fields must be filled.');
      }

      const meetingData = {
        student_id: selectedStudent,
        counselor_id: selectedCounselor,
        meeting_date: selectedDate.toISOString().split('T')[0],
        meeting_time: selectedTime,
        duration: parseInt(duration),
        meeting_type: meetingType,
        notes: notes,
        status: 'scheduled',
      };

      const { error } = await supabase.from('meetings').insert([meetingData]);
      if (error) throw error;
      
      toast.success('Meeting scheduled successfully!');
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      toast.error(error.message || 'Failed to schedule meeting.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Data for Rendering ---
  const steps = [
    { id: 1, name: 'Participants', icon: Users },
    { id: 2, name: 'Date & Time', icon: Clock },
    { id: 3, name: 'Details', icon: ListChecks },
    { id: 4, name: 'Confirm', icon: Check },
  ];

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const getUserName = (id: string) => allUsers.find(u => u.id === id)?.name || id;

  // --- Step Validation ---
  const isStep1Complete = selectedStudent && selectedCounselor;
  const isStep2Complete = selectedDate && selectedTime;
  const isStep3Complete = meetingType;
  
  // --- Render Logic ---
  if (isSuccess) {
    return (
      <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-background rounded-lg shadow-2xl max-w-md w-full p-8 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Meeting Scheduled!</h2>
          <p className="text-muted-foreground mb-6">Both participants will be notified shortly.</p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <span>Schedule a New Meeting</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8">×</Button>
          </CardTitle>
          {/* Stepper */}
          <div className="flex items-center gap-2 sm:gap-4 pt-4">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      step > s.id ? 'bg-green-500 text-white' : '',
                      step === s.id ? 'bg-primary text-primary-foreground' : '',
                      step < s.id ? 'bg-muted border' : ''
                    )}
                  >
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <p className={cn(
                    'text-xs text-center',
                    step >= s.id ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  )}>{s.name}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mt-[-1rem]',
                    step > s.id + 1 ? 'bg-green-500' : 'bg-border'
                  )}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Participants */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="student" className="flex items-center gap-2 text-base"><User /> Student *</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
                      <SelectContent>{allUsers.map(s => <SelectItem key={s.id} value={s.id}>{s.name || s.email}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="counselor" className="flex items-center gap-2 text-base"><UserCog /> Counselor *</Label>
                    <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                      <SelectTrigger><SelectValue placeholder="Select a counselor" /></SelectTrigger>
                      <SelectContent>{allUsers.map(c => <SelectItem key={c.id} value={c.id}>{c.name || c.email}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <Label className="mb-2">Select a Date *</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Select a Time Slot *</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                      {timeSlots.map(time => (
                        <Button key={time} variant={selectedTime === time ? 'default' : 'outline'} onClick={() => setSelectedTime(time)}>
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
{/* hi */}
              {/* Step 3: Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Meeting Type *</Label>
                      <Select value={meetingType} onValueChange={setMeetingType}>
                        <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="counseling">Counseling</SelectItem>
                          <SelectItem value="crisis">Crisis Intervention</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="assessment">Assessment Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.e.target.value)} placeholder="Add any relevant notes for the counselor..." />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Please confirm the details:</h3>
                  <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                    <p><strong>Student:</strong> {getUserName(selectedStudent)}</p>
                    <p><strong>Counselor:</strong> {getUserName(selectedCounselor)}</p>
                    <p><strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : 'Not set'}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                    <p><strong>Type:</strong> {meetingType}</p>
                    <p><strong>Duration:</strong> {duration} minutes</p>
                    {notes && <p><strong>Notes:</strong> {notes}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        {/* Navigation Buttons */}
        <div className="flex justify-between p-6 border-t flex-shrink-0">
          <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>Previous</Button>
          {step < 4 && <Button onClick={handleNext} disabled={ (step === 1 && !isStep1Complete) || (step === 2 && !isStep2Complete) || (step === 3 && !isStep3Complete) }>Next</Button>}
          {step === 4 && <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Scheduling...' : 'Confirm & Schedule'}</Button>}
        </div>
      </motion.div>
    </motion.div>
  );
}