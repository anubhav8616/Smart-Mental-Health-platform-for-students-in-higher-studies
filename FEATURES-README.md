# FF-SmartBU - Mental Health Support Platform

## New Features Added

### 1. Schedule Meeting Functionality
The admin dashboard now includes a fully functional meeting scheduling system that integrates with Supabase.

**Features:**
- Schedule meetings between students and counselors
- Select meeting type (Counseling, Crisis Intervention, Follow-up, Assessment, Group Session)
- Choose date, time, and duration
- Add notes for meetings
- All meetings are stored in Supabase database

**How to use:**
1. Click the "Schedule Meeting" button in the admin dashboard
2. Select a student and counselor
3. Choose the meeting date and time
4. Select meeting type and duration
5. Add any additional notes
6. Click "Schedule Meeting" to save

### 2. Global Language Support
The application now supports multiple languages with a language selector in the navigation bar.

**Supported Languages:**
- English (EN)
- Hindi (हि)
- German (DE)
- Spanish (ES)
- Kashmiri (ک)

**How to use:**
1. Click the language selector in the top navigation bar
2. Choose your preferred language
3. The entire interface will update to the selected language

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Database Setup
Run the SQL script provided in `database-setup.sql` in your Supabase SQL editor to create the necessary tables:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Execute the script

This will create:
- `profiles` table for user information
- `meetings` table for meeting scheduling
- Proper Row Level Security policies
- Indexes for better performance
- Automatic profile creation trigger

### 3. User Roles
The system supports different user roles:
- `student`: Can view their own meetings and profile
- `counselor`: Can schedule and manage meetings
- `admin`: Full access to all features

To set a user as admin or counselor, update their role in the `profiles` table:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

## File Structure

### New Files Added:
- `src/context/LanguageContext.tsx` - Language management context
- `src/components/schedule-meeting.tsx` - Meeting scheduling component
- `database-setup.sql` - Database schema and policies

### Modified Files:
- `src/components/admin-dashboard.tsx` - Added meeting scheduling functionality and translations
- `src/components/navigation.tsx` - Added language selector and translations
- `src/App.tsx` - Updated to use language context
- `src/main.tsx` - Added LanguageProvider wrapper

## Features Overview

### Admin Dashboard
- **Schedule Meeting Button**: Opens a modal to schedule new meetings
- **Translated Interface**: All text elements support multiple languages
- **Real-time Updates**: Meeting data is stored and retrieved from Supabase

### Meeting Scheduling
- **Student Selection**: Choose from available students
- **Counselor Selection**: Choose from available counselors/admins
- **Date/Time Picker**: Select meeting date and time
- **Meeting Types**: Various meeting types available
- **Notes**: Add additional information about the meeting

### Language Support
- **Global Translation**: All UI elements are translated
- **Persistent Selection**: Language choice is maintained during session
- **Comprehensive Coverage**: Navigation, dashboard, and meeting forms all support translations

## Technical Details

### Database Schema
- **profiles**: User information with role-based access
- **meetings**: Meeting scheduling with foreign key relationships
- **RLS Policies**: Secure access based on user roles
- **Indexes**: Optimized queries for better performance

### Security
- Row Level Security enabled on all tables
- Role-based access control
- Secure API endpoints through Supabase

### Performance
- Optimized database queries
- Proper indexing for meeting lookups
- Efficient state management with React Context

## Troubleshooting

### Common Issues:

1. **"Supabase URL and Anon Key are required"**
   - Make sure your `.env` file is in the project root
   - Verify the environment variable names are correct

2. **"Failed to schedule meeting"**
   - Check if the database tables exist
   - Verify RLS policies are set up correctly
   - Ensure user has proper role permissions

3. **Language not changing**
   - Check if LanguageProvider is properly wrapped around the app
   - Verify translation keys exist in LanguageContext

### Support
For additional support or feature requests, please refer to the project documentation or contact the development team.
