# Meeting Integration Summary

## ✅ What Was Implemented

### 1. Google Calendar Service Helper (`lib/google-calendar.ts`)
Created a comprehensive helper module that provides:
- **Google Calendar API client initialization** using service account credentials
- **`createCalendarEventWithMeet()`** - Creates calendar events with Google Meet links
- **`updateCalendarEvent()`** - Updates existing calendar events
- **`cancelCalendarEvent()`** - Cancels calendar events with notifications
- **Helper functions** for date/time parsing and meeting description generation

Key Features:
- Automatic Google Meet link generation
- E.164 phone number formatting
- Calendar invites sent to all attendees
- Reminders (1 day before + 30 minutes before)
- Timezone support (Africa/Lusaka)

### 2. Enhanced Meeting Request API (`app/api/meetings/request/route.ts`)
Updated the meeting scheduling endpoint to:
- ✅ Create Google Calendar events automatically
- ✅ Generate Google Meet video conference links
- ✅ Send calendar invites to both user and support team
- ✅ Store meeting details in the database (Prisma)
- ✅ Send Knock notifications with meeting details
- ✅ Return Google Meet link in the API response

Workflow:
1. Validate meeting request data
2. Check for scheduling conflicts
3. Save meeting to database
4. Create Google Calendar event with Meet link
5. Update database with Meet link
6. Send notifications to support team and user
7. Return success response with meeting details

### 3. Updated Contact Page UI (`app/contact/page.tsx`)
Enhanced the Schedule Meeting tab with:
- **Meeting confirmation screen** that displays:
  - Meeting date, time, and duration
  - Google Meet video link (clickable)
  - Calendar invite notification
  - Copy Meet link button
  - Schedule another meeting button
- **Improved user experience**:
  - Beautiful gradient cards
  - Icon-based visual hierarchy
  - Success animation on confirmation
  - Responsive design for mobile

### 4. Knock Notification Workflow (`meeting-scheduled`)
Configured Knock to send:
- **Support Team Notification**:
  - Email with new meeting request details
  - Customer information
  - Google Meet link
  - Calendar invite reference
- **User Confirmation**:
  - Email with meeting confirmation
  - Google Meet link
  - Instructions for accepting calendar invite
  - What to expect details
  - Rescheduling information
- **Optional SMS reminders** for users

## 📋 Required Environment Variables

Add these to your `.env` file:

```bash
# Google Calendar Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL="pollen-calendar-bot@YOUR-PROJECT-ID.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"  # or "primary"

# Support Team Configuration
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"

# Knock Configuration (if not already set)
KNOCK_SECRET_API_KEY="sk_test_YOUR_KNOCK_API_KEY"
KNOCK_PUBLIC_API_KEY="pk_test_YOUR_KNOCK_PUBLIC_KEY"
```

## 📦 Required NPM Packages

```bash
npm install googleapis @knocklabs/node
```

Or add to `package.json`:
```json
{
  "dependencies": {
    "googleapis": "^140.0.0",
    "@knocklabs/node": "^0.6.0"
  }
}
```

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
npm install googleapis
```

### 2. Configure Google Calendar API
Follow the comprehensive guide in `GOOGLE_CALENDAR_SETUP.md`:
1. Create Google Cloud Project
2. Enable Google Calendar API
3. Create Service Account
4. Download credentials JSON
5. Create/share calendar with service account
6. Add credentials to `.env`

### 3. Configure Knock Workflow
1. Login to Knock Dashboard
2. Create workflow: `meeting-scheduled`
3. Add branches for support team and user
4. Configure email templates (provided in setup guide)
5. Optional: Add SMS notifications
6. Commit workflow

### 4. Test the Integration
```bash
npm run dev
```
1. Go to http://localhost:3000/contact
2. Click "Schedule Meeting" tab
3. Fill in details and select date/time
4. Submit form
5. Verify:
   - Meeting appears in Google Calendar
   - Google Meet link is generated
   - Calendar invites sent
   - Notifications received
   - Confirmation page shows Meet link

## 🎯 User Flow

```
User fills meeting form
        ↓
API validates & saves to database
        ↓
Google Calendar event created (with Meet link)
        ↓
Database updated with Meet link
        ↓
Knock sends notifications:
  - Support team → Meeting request email
  - User → Confirmation email
        ↓
Calendar invites sent to both parties
        ↓
User sees confirmation with Meet link
        ↓
Both parties receive calendar invite
        ↓
Automatic reminders (1 day + 30 min before)
        ↓
Meeting happens via Google Meet
```

## 📁 Files Modified/Created

### Created:
1. **`lib/google-calendar.ts`** - Google Calendar service helper
2. **`GOOGLE_CALENDAR_SETUP.md`** - Comprehensive setup guide
3. **`MEETING_INTEGRATION_SUMMARY.md`** - This file

### Modified:
1. **`app/api/meetings/request/route.ts`** - Enhanced with Google Calendar integration
2. **`app/contact/page.tsx`** - Added meeting confirmation UI

## 🔧 Key Functions

### `createCalendarEventWithMeet(params)`
Creates a Google Calendar event with Google Meet link.

**Parameters**:
```typescript
{
  summary: string;           // Event title
  description: string;       // Event description
  startDateTime: Date;       // Start time
  endDateTime: Date;         // End time
  attendeeEmails: string[];  // List of attendee emails
  organizerName?: string;    // Optional organizer name
  organizerEmail?: string;   // Optional organizer email
}
```

**Returns**:
```typescript
{
  success: boolean;
  eventId: string;                    // Google Calendar event ID
  meetLink: string;                   // Google Meet link
  htmlLink: string;                   // Calendar event link
  event: calendar_v3.Schema$Event;    // Full event object
}
```

### `formatPhoneE164(phone)`
Formats phone numbers to E.164 standard (+260XXXXXXXXX for Zambia).

### `createDateTime(dateString, timeString)`
Parses date and time strings into a JavaScript Date object.

### `generateMeetingDescription(params)`
Generates a formatted meeting description with customer details.

## 🎨 UI Components

### Meeting Confirmation Screen
- ✅ Success icon and message
- ✅ Meeting details card (date, time, duration)
- ✅ Google Meet link button
- ✅ Calendar invite notification
- ✅ Copy link button
- ✅ Schedule another meeting button

### Responsive Design
- Mobile-friendly layout
- Gradient backgrounds
- Icon-based visual hierarchy
- Smooth animations

## 🔒 Security Considerations

1. **Service Account Private Key**: Never commit to Git, store in `.env`
2. **Calendar Access**: Service account only has Calendar Editor role (least privilege)
3. **API Key Validation**: Checks for missing credentials before API calls
4. **Error Handling**: Graceful degradation if calendar/notification fails
5. **Phone Number Sanitization**: Cleans and formats phone numbers before storage

## 📊 Database Schema

The `MeetingRequest` model includes:
```prisma
model MeetingRequest {
  id           String   @id @default(cuid())
  name         String
  email        String
  phone        String?
  meetingDate  DateTime
  meetingTime  String
  purpose      String?
  status       String   @default("pending")
  notes        String?  // Stores Google Meet link and event ID
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

The `notes` field stores:
```
Google Meet Link: https://meet.google.com/xxx-yyyy-zzz
Calendar Event ID: abc123def456
```

## 🐛 Error Handling

The implementation includes comprehensive error handling:
1. **Calendar creation fails**: Logs error, continues with meeting creation
2. **Notifications fail**: Logs error, returns success (meeting still scheduled)
3. **Invalid phone number**: Sanitizes and formats automatically
4. **Missing environment variables**: Throws descriptive errors
5. **API quota exceeded**: Caught and logged

## 📈 Monitoring & Logs

Console logs are added for:
- ✅ Google Calendar event creation
- ✅ Event ID and Meet link
- ✅ Knock notification triggers
- ✅ Phone number formatting
- ✅ API errors

Check server logs to debug issues:
```bash
npm run dev
# Look for lines starting with '===' or '✓'
```

## 🎯 Next Steps

1. **Test the integration** thoroughly
2. **Customize email templates** in Knock Dashboard
3. **Configure SMS notifications** (optional)
4. **Add meeting cancellation** endpoint
5. **Create admin dashboard** to view scheduled meetings
6. **Add time zone selection** for international clients
7. **Implement meeting rescheduling** feature
8. **Add video recording** capability (Google Meet)

## 📚 Documentation References

- Full setup guide: `GOOGLE_CALENDAR_SETUP.md`
- Google Calendar API: https://developers.google.com/calendar
- Knock Documentation: https://docs.knock.app/
- Prisma Documentation: https://www.prisma.io/docs/

## 💡 Tips

1. **Test with your own email** first to verify calendar invites
2. **Check spam folders** if calendar invites don't arrive
3. **Use "primary"** calendar for testing initially
4. **Monitor Google Cloud Console** for API usage
5. **Set up Knock test environment** before production

## ✅ Verification Checklist

- [ ] Google Cloud Project created
- [ ] Service Account created with Calendar Editor role
- [ ] Calendar shared with service account
- [ ] Environment variables added to `.env`
- [ ] `googleapis` package installed
- [ ] Knock workflow `meeting-scheduled` created
- [ ] Email templates added to Knock
- [ ] Workflow committed in Knock
- [ ] Test meeting scheduled successfully
- [ ] Calendar invite received
- [ ] Google Meet link works
- [ ] Notifications received

---

**Status**: ✅ **Implementation Complete**

The meeting integration is fully implemented and ready for testing. Follow the setup guide in `GOOGLE_CALENDAR_SETUP.md` to configure the Google Calendar API and Knock notifications.

