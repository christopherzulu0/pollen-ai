# 🎯 How the Meeting Integration Works

## Architecture Overview

The meeting scheduling system uses a **hybrid approach** combining Google Calendar API and Knock notifications for the best user experience.

## 📊 System Components

### 1. Google Calendar API
**Purpose**: Generate Google Meet links and create calendar events
- ✅ Creates calendar event in your Google Calendar
- ✅ Generates Google Meet video conference link
- ✅ Stores meeting in calendar for your reference
- ❌ Does NOT send calendar invites (by design)

### 2. Knock Notifications
**Purpose**: Send beautiful, branded email and SMS invitations
- ✅ Sends customized email invitations to attendees
- ✅ Includes Google Meet link in emails
- ✅ Sends SMS reminders (optional)
- ✅ Fully branded with your company colors and logo
- ✅ Much more flexible than default Google Calendar invites

### 3. Prisma Database
**Purpose**: Store meeting records and details
- ✅ Saves all meeting information
- ✅ Tracks meeting status
- ✅ Stores Google Meet link for reference

## 🔄 Meeting Scheduling Flow

```
User submits meeting form
        ↓
1. Validate & check for conflicts
        ↓
2. Save meeting to database (Prisma)
        ↓
3. Create Google Calendar event
   → Generates Google Meet link
   → Adds to your calendar
   → NO attendees added
        ↓
4. Send Knock notifications
   → Support team: "New meeting request" email
   → User: "Meeting confirmed" email
   → Both emails include Google Meet link
        ↓
5. Return success with Meet link
        ↓
User sees confirmation page with "Join Google Meet" button
```

## 📧 Why Not Use Google Calendar Invites?

### Problem with Service Accounts:
Google service accounts cannot send calendar invites to external attendees without **Domain-Wide Delegation** (requires Google Workspace admin access and complex setup).

### Our Solution:
- **Google Calendar**: Only for creating events and generating Meet links
- **Knock**: Handles ALL email invitations and notifications

### Benefits of This Approach:

✅ **Better User Experience**
- Branded, beautiful emails instead of generic Google invites
- Customizable content and styling
- Include additional information beyond calendar details
- SMS notifications in addition to email

✅ **Simpler Setup**
- No Domain-Wide Delegation needed
- No Google Workspace required
- Works with any Google account

✅ **More Flexible**
- Custom email templates via Knock
- Multiple notification channels (email, SMS, push)
- Better tracking and analytics
- Retry logic for failed sends

✅ **Consistent Branding**
- All communications match your brand
- Professional, polished emails
- Better than generic calendar invites

## 📱 What Users Receive

### Support Team:
📧 **Email Notification** (via Knock):
```
Subject: 🗓️ New Meeting Request - John Doe

Meeting Details:
- Date: Monday, December 25, 2024
- Time: 2:00 PM
- Duration: 1 hour

Customer Information:
- Name: John Doe
- Email: john@example.com
- Phone: +260971234567

[Join Google Meet] (clickable button)
```

📅 **Calendar Event** (in your Google Calendar):
- Appears in your calendar
- Includes meeting details
- No email invite sent (Knock already handled it)

### User:
📧 **Confirmation Email** (via Knock):
```
Subject: ✅ Meeting Confirmed - Monday, Dec 25 at 2:00 PM

Your meeting with Pollen Support Team has been scheduled!

Meeting Details:
- Date: Monday, December 25, 2024
- Time: 2:00 PM
- Duration: 1 hour

[Join Google Meet] (clickable button)

What to Expect:
- You'll receive a reminder 1 day before
- Another reminder 30 minutes before
- Our team will join the Meet at the scheduled time
```

📱 **SMS Reminder** (optional, via Knock):
```
Meeting tomorrow at 2:00 PM!
Join: https://meet.google.com/xxx-yyyy-zzz
- Pollen
```

## 🔧 Technical Details

### Google Calendar Event Structure:
```typescript
{
  summary: "Meeting: John Doe - General Discussion",
  description: "Customer details...",
  start: { dateTime: "2024-12-25T14:00:00.000Z", timeZone: "Africa/Lusaka" },
  end: { dateTime: "2024-12-25T15:00:00.000Z", timeZone: "Africa/Lusaka" },
  attendees: [], // Empty - no invites sent
  conferenceData: {
    createRequest: {
      conferenceSolutionKey: { type: "hangoutsMeet" }
    }
  },
  reminders: {
    overrides: [
      { method: "email", minutes: 1440 }, // 1 day before
      { method: "popup", minutes: 30 }    // 30 min before
    ]
  }
}
```

### Knock Notification Data:
```typescript
{
  recipients: [
    {
      id: "user_123",
      email: "user@example.com",
      name: "John Doe",
      user: "user", // For branch conditions
      phone_number: "+260971234567" // For SMS
    }
  ],
  data: {
    meetingId: "cuid_123",
    name: "John Doe",
    email: "user@example.com",
    phone: "+260971234567",
    meetingDate: "2024-12-25T14:00:00.000Z",
    meetingTime: "2:00 PM",
    formattedDate: "Monday, December 25, 2024",
    googleMeetLink: "https://meet.google.com/xxx-yyyy-zzz",
    purpose: "General Discussion",
    isUser: true // or isSupport: true
  }
}
```

## 🎨 Customization

### To Customize Email Templates:
1. Go to Knock Dashboard
2. Select workflow: `meeting-scheduled`
3. Edit email steps
4. Update HTML templates
5. Test and commit

### To Add SMS Notifications:
1. Configure Twilio in Knock
2. Add SMS step to workflow branches
3. Use template: `Meeting on {{ data.formattedDate }} at {{ data.meetingTime }}. Join: {{ data.googleMeetLink }}`

### To Change Calendar Settings:
Edit `lib/google-calendar.ts`:
- Change timezone
- Adjust reminder times
- Modify event duration

## 🔒 Security & Privacy

### Google Calendar:
- Events stored in YOUR calendar only
- Service account has minimal permissions
- No access to other calendars
- Private key secured in .gitignore

### Knock:
- Email addresses only used for notifications
- No data stored permanently
- GDPR compliant
- Encrypted in transit

### Database (Prisma):
- Meeting records stored securely
- Sensitive data encrypted
- Access controlled
- Audit trail maintained

## 📈 Monitoring

### Successful Meeting Creation:
Look for these logs:
```
✓ Google Calendar event created
✓ Support team notification sent
✓ User confirmation notification sent
POST /api/meetings/request 201
```

### Check Knock Dashboard:
- View notification delivery status
- See email open rates
- Track SMS delivery
- Debug failed sends

### Check Google Calendar:
- Verify events are created
- Confirm Meet links are generated
- Check reminders are set

## 🐛 Troubleshooting

### No Meet Link Generated?
- Ensure `conferenceDataVersion: 1` is set
- Check Google Meet is enabled for your account
- Verify Calendar API is enabled

### Emails Not Received?
- Check Knock Dashboard for delivery status
- Verify Knock workflow is committed
- Check spam/junk folders
- Confirm email addresses are correct

### Calendar Event Not Appearing?
- Check `GOOGLE_CALENDAR_ID` in .env
- Verify service account has calendar access
- Look at server logs for API errors

## 💡 Future Enhancements

Possible improvements:
- ✨ Add calendar invite (.ics) attachment to Knock emails
- ✨ Implement meeting rescheduling
- ✨ Add meeting cancellation with notifications
- ✨ Calendar sync for multiple timezones
- ✨ Video recording functionality
- ✨ Meeting notes integration
- ✨ Attendance tracking

## 📚 Related Documentation

- `SETUP_YOUR_CALENDAR.md` - Setup instructions
- `GOOGLE_CALENDAR_SETUP.md` - Complete Google API guide
- `KNOCK_NOTIFICATIONS_FIX.md` - Knock configuration guide
- `MEETING_INTEGRATION_SUMMARY.md` - Technical overview

## ✅ Summary

**Google Calendar**: Creates events & generates Meet links  
**Knock**: Handles all invitations & notifications  
**Prisma**: Stores meeting records  
**Result**: Best of both worlds! 🎉

This architecture gives you:
- Professional branded emails
- Reliable Google Meet links
- Flexible notification system
- Simple setup process
- Great user experience

