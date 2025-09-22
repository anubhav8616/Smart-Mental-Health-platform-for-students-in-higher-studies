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
import { CalendarIcon, Clock, Users, FileText, CheckCircle2 } from 'lucide-react';
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
  email?: string;
  username?: string;
  name?: string;
}

interface Counselor {
  id: string;
  email?: string;
  username?: string;
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
  const [confirmation, setConfirmation] = useState<null | {
    studentEmail: string
    counselorEmail: string
    date: string
    time: string
    duration: number
    type: string
  }>(null)

  // Load students and counselors on component mount
  useEffect(() => {
    loadStudentsAndCounselors();
  }, []);

  const loadStudentsAndCounselors = async () => {
    try {
      // Attempt to fetch with role/email columns. Fallback if columns don't exist
      let studentsData: any[] | null = null;
      let counselorsData: any[] | null = null;

      try {
        const res = await supabase
          .from('profiles')
          .select('id, email, username, name')
          .eq('role', 'student');
        if (res.error && res.error.code === '42703') throw res.error;
        studentsData = res.data || [];
      } catch (_) {
        const res = await supabase
          .from('profiles')
          .select('*');
        studentsData = (res.data || []).slice(0, 100);
      }

      try {
        const res = await supabase
          .from('profiles')
          .select('id, email, username, name')
          .in('role', ['admin', 'counselor']);
        if (res.error && res.error.code === '42703') throw res.error;
        counselorsData = res.data || [];
      } catch (_) {
        const res = await supabase
          .from('profiles')
          .select('*');
        counselorsData = (res.data || []).slice(0, 100);
      }

      // Map email fallbacks
      const normalizeEmail = (row: any) => {
        const value: string | undefined = row?.email || (typeof row?.username === 'string' && row.username.includes('@') ? row.username : undefined);
        return value;
      };
      setStudents((studentsData || []).map(r => ({ id: r.id, email: normalizeEmail(r), username: r.username, name: r.name })));
      setCounselors((counselorsData || []).map(r => ({ id: r.id, email: normalizeEmail(r), username: r.username, name: r.name })));
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(t('common.error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCounselor || !selectedDate || !selectedTime || !meetingType) {
      toast.error(t('meeting.error') || 'Please fill in all required fields');
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

      // Build confirmation details
      const selectedStudentRow = students.find(s => s.id === selectedStudent)
      const selectedCounselorRow = counselors.find(c => c.id === selectedCounselor)
      const studentEmail = selectedStudentRow?.email || (selectedStudentRow?.username && selectedStudentRow.username.includes('@') ? selectedStudentRow.username : '')
      const counselorEmail = selectedCounselorRow?.email || (selectedCounselorRow?.username && selectedCounselorRow.username.includes('@') ? selectedCounselorRow.username : '')
      const dateStr = meetingData.meeting_date
      const timeStr = meetingData.meeting_time
      const durationNum = meetingData.duration
      const typeStr = meetingData.meeting_type

      // Send email notifications (best-effort)
      const subject = `Meeting scheduled on ${dateStr} at ${timeStr}`
      const html = `
        <div>
          <h2>Meeting Scheduled</h2>
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Time:</strong> ${timeStr}</p>
          <p><strong>Duration:</strong> ${durationNum} minutes</p>
          <p><strong>Type:</strong> ${typeStr}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
      `
      try {
        if (studentEmail) {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: studentEmail, subject, html })
          }).catch(() => {})
        }
        if (counselorEmail) {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: counselorEmail, subject, html })
          }).catch(() => {})
        }
      } catch {}

      setConfirmation({
        studentEmail,
        counselorEmail,
        date: dateStr,
        time: timeStr,
        duration: durationNum,
        type: typeStr,
      })
      toast.success(t('meeting.success'));
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
                      <SelectItem key={`student-${student.id}`} value={student.id}>
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
                      <SelectItem key={`counselor-${counselor.id}`} value={counselor.id}>
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
                        {selectedDate ? format(selectedDate, "PPP") : <span>{t('meeting.date') || 'Pick a date'}</span>}
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
                      <SelectValue placeholder={t('meeting.time') || 'Select time'} />
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
                      <SelectItem value="30">30 {t('meeting.duration') || 'minutes'}</SelectItem>
                      <SelectItem value="60">60 {t('meeting.duration') || 'minutes'}</SelectItem>
                      <SelectItem value="90">90 {t('meeting.duration') || 'minutes'}</SelectItem>
                      <SelectItem value="120">120 {t('meeting.duration') || 'minutes'}</SelectItem>
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
                  placeholder={t('meeting.notes')}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t('meeting.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading || !selectedStudent || !selectedCounselor || !selectedDate || !selectedTime || !meetingType}>
                  {isLoading ? t('common.loading') : t('meeting.schedule')}
                </Button>
              </div>
            </form>

            {/* Confirmation */}
            {confirmation && (
              <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Meeting Confirmed</div>
                    <div>Date: {confirmation.date}</div>
                    <div>Time: {confirmation.time}</div>
                    <div>Duration: {confirmation.duration} minutes</div>
                    <div>Type: {confirmation.type}</div>
                    <div className="text-muted-foreground">Emails sent to: {confirmation.studentEmail}{confirmation.counselorEmail ? `, ${confirmation.counselorEmail}` : ''}</div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={onClose}>{t('common.close')}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
