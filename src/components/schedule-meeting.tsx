import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Clock, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from './ui/utils';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

interface ScheduleMeetingProps {
  onClose: () => void;
}

interface Student {
  id: string;
  email: string;
  name?: string;
}

interface Counselor {
  id: string;
  email: string;
  name?: string;
}

export function ScheduleMeeting({ onClose }: ScheduleMeetingProps) {
  const { t } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [meetingType, setMeetingType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);

  // Load students and counselors on component mount
  useEffect(() => {
    loadStudentsAndCounselors();
  }, []);

  const loadStudentsAndCounselors = async () => {
    try {
      // Load students (users with role 'student')
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Load counselors (users with role 'admin' or 'counselor')
      const { data: counselorsData, error: counselorsError } = await supabase
        .from('profiles')
        .select('id, email, name')
        .in('role', ['admin', 'counselor']);

      if (counselorsError) throw counselorsError;

      setStudents(studentsData || []);
      setCounselors(counselorsData || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(t('common.error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCounselor || !selectedDate || !selectedTime || !meetingType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const meetingData = {
        student_id: selectedStudent,
        counselor_id: selectedCounselor,
        meeting_date: selectedDate.toISOString().split('T')[0],
        meeting_time: selectedTime,
        duration: parseInt(duration),
        meeting_type: meetingType,
        notes: notes,
        status: 'scheduled',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('meetings')
        .insert([meetingData]);

      if (error) throw error;

      toast.success(t('meeting.success'));
      onClose();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error(t('meeting.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('meeting.title')}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div className="space-y-2">
                <Label htmlFor="student">{t('meeting.student')} *</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('meeting.selectStudent')} />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name || student.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Counselor Selection */}
              <div className="space-y-2">
                <Label htmlFor="counselor">{t('meeting.counselor')} *</Label>
                <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('meeting.selectCounselor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {counselors.map((counselor) => (
                      <SelectItem key={counselor.id} value={counselor.id}>
                        {counselor.name || counselor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('meeting.date')} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">{t('meeting.time')} *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">{t('meeting.duration')} (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{t('meeting.type')} *</Label>
                  <Select value={meetingType} onValueChange={setMeetingType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('meeting.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counseling">{t('meetingType.counseling')}</SelectItem>
                      <SelectItem value="crisis">{t('meetingType.crisis')}</SelectItem>
                      <SelectItem value="followup">{t('meetingType.followup')}</SelectItem>
                      <SelectItem value="assessment">{t('meetingType.assessment')}</SelectItem>
                      <SelectItem value="group">{t('meetingType.group')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t('meeting.notes')}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t('meeting.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('meeting.schedule')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
