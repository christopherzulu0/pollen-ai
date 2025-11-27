# Google Calendar & Meet Integration Setup Guide

This guide walks you through setting up Google Calendar API and Google Meet integration for automated meeting scheduling.

## 📋 Overview

The integration provides:
- ✅ Automatic Google Calendar event creation
- ✅ Google Meet video conferencing links
- ✅ Calendar invites sent to both user and support team
- ✅ Email & SMS notifications via Knock
- ✅ Automated reminders (1 day before, 30 minutes before)

## 🔧 Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a Project" → "New Project"
   - Project name: `Pollen-Calendar-Integration`
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ **Google Calendar API**
     - ✅ **Google Meet API** (if available)

## 🔑 Step 2: Create Service Account

1. **Navigate to Service Accounts**
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"

2. **Configure Service Account**
   ```
   Service account name: pollen-calendar-bot
   Service account ID: pollen-calendar-bot
   Description: Service account for automated calendar event creation
   ```

3. **Grant Calendar Editor Role**
   - Click "Continue"
   - Select Role: **Editor** or **Calendar > Calendar Editor**
   - Click "Continue" → "Done"

4. **Create Service Account Key**
   - Click on the newly created service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose **JSON** format
   - Click "Create" (downloads JSON file)

## 📧 Step 3: Delegate Domain-Wide Authority (Optional but Recommended)

If you're using Google Workspace:

1. **Enable Domain-Wide Delegation**
   - In the service account details, click "Edit"
   - Check "Enable G Suite Domain-wide Delegation"
   - Save

2. **Configure in Admin Console**
   - Go to Google Workspace Admin Console: https://admin.google.com/
   - Navigate to: Security → API controls → Domain-wide Delegation
   - Click "Add new"
   - Client ID: (from service account JSON)
   - OAuth Scopes: `https://www.googleapis.com/auth/calendar`

## 📅 Step 4: Setup Calendar for Meetings

### Option A: Use Primary Calendar
Just set `GOOGLE_CALENDAR_ID=primary` in your `.env` file.

### Option B: Create Dedicated Calendar (Recommended)

1. **Create New Calendar**
   - Go to Google Calendar: https://calendar.google.com/
   - Left sidebar → Click "+" next to "Other calendars"
   - Select "Create new calendar"
   - Name: `Pollen Support Meetings`
   - Click "Create calendar"

2. **Share Calendar with Service Account**
   - Go to calendar settings
   - Scroll to "Share with specific people"
   - Click "Add people"
   - Email: `pollen-calendar-bot@YOUR-PROJECT-ID.iam.gserviceaccount.com`
   - Permissions: **Make changes to events**
   - Click "Send"

3. **Get Calendar ID**
   - In calendar settings
   - Scroll to "Integrate calendar"
   - Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com`)

## 🔐 Step 5: Configure Environment Variables

Add these variables to your `.env` file:

```bash
# Google Calendar Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL="pollen-calendar-bot@YOUR-PROJECT-ID.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID="your-calendar-id@group.calendar.google.com"  # or "primary"

# Support Team Configuration
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"  # Change to your support team email

# Knock Notifications (if not already configured)
KNOCK_SECRET_API_KEY="sk_test_YOUR_KNOCK_API_KEY"
KNOCK_PUBLIC_API_KEY="pk_test_YOUR_KNOCK_PUBLIC_KEY"
```

### How to Extract Service Account Credentials from JSON

Open the downloaded JSON file and extract:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "pollen-calendar-bot@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

Use:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep the `\n` characters)

## 📬 Step 6: Setup Knock Workflow for Meeting Notifications

1. **Login to Knock Dashboard**
   - Visit: https://dashboard.knock.app/

2. **Create New Workflow**
   - Name: `meeting-scheduled`
   - Key: `meeting-scheduled`

3. **Configure Workflow Structure**

```
meeting-scheduled (Workflow)
├── Support Team Branch
│   ├── Condition: recipient.user == "support"
│   ├── Email Channel (New Meeting Request)
│   └── SMS Channel (Optional)
└── User Branch
    ├── Condition: recipient.user == "user"
    ├── Email Channel (Meeting Confirmation)
    └── SMS Channel (Meeting Reminder)
```

4. **Add Branch: Support Team**
   - **Condition**: `recipient.user == "support"` OR `data.isSupport == true`
   - **Add Email Step**:
     - Subject: `🗓️ New Meeting Request - {{ data.name }}`
     - Body: See template below

5. **Add Branch: User Confirmation**
   - **Condition**: `recipient.user == "user"` OR `data.isUser == true`
   - **Add Email Step**:
     - Subject: `✅ Meeting Confirmed - {{ data.formattedDate }} at {{ data.meetingTime }}`
     - Body: See template below

### Email Template for Support Team

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #003366 0%, #00CC66 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
    .meeting-card { background: #f8fafc; border-left: 4px solid #00CC66; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #00CC66; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗓️ New Meeting Request</h1>
      <p>A customer has scheduled a meeting with the support team</p>
    </div>
    <div class="content">
      <h2>Meeting Details</h2>
      <div class="meeting-card">
        <p><strong>Date:</strong> {{ data.formattedDate }}</p>
        <p><strong>Time:</strong> {{ data.meetingTime }}</p>
        <p><strong>Duration:</strong> 1 hour</p>
      </div>

      <h3>Customer Information</h3>
      <ul>
        <li><strong>Name:</strong> {{ data.name }}</li>
        <li><strong>Email:</strong> {{ data.email }}</li>
        <li><strong>Phone:</strong> {{ data.phone }}</li>
        {% if data.purpose %}
        <li><strong>Purpose:</strong> {{ data.purpose }}</li>
        {% endif %}
      </ul>

      {% if data.googleMeetLink %}
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ data.googleMeetLink }}" class="button">Join Google Meet</a>
      </div>
      {% endif %}

      <p><em>📅 Calendar invite has been sent to your email. Please accept the invitation to add it to your calendar.</em></p>
      
      <div class="footer">
        <p>This meeting was scheduled via the Pollen contact form</p>
        <p>Meeting ID: {{ data.meetingId }}</p>
      </div>
    </div>
  </div>
</body>
</html>
```

### Email Template for User Confirmation

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #003366 0%, #00CC66 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 2px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
    .success-icon { font-size: 48px; margin-bottom: 10px; }
    .meeting-card { background: #f0fdf4; border: 2px solid #00CC66; padding: 25px; margin: 25px 0; border-radius: 10px; }
    .button { display: inline-block; background: #00CC66; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
    .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Meeting Confirmed!</h1>
      <p>Your meeting has been successfully scheduled</p>
    </div>
    <div class="content">
      <p>Hi {{ data.userName }},</p>
      <p>Thank you for scheduling a meeting with us! We're looking forward to speaking with you.</p>

      <div class="meeting-card">
        <h2 style="margin-top: 0; color: #003366;">📅 Your Meeting Details</h2>
        <p><strong>Date:</strong> {{ data.formattedDate }}</p>
        <p><strong>Time:</strong> {{ data.meetingTime }}</p>
        <p><strong>Duration:</strong> 1 hour</p>
        {% if data.purpose %}
        <p><strong>Purpose:</strong> {{ data.purpose }}</p>
        {% endif %}
      </div>

      {% if data.googleMeetLink %}
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #003366;">Join via Google Meet</h3>
        <a href="{{ data.googleMeetLink }}" class="button">Join Meeting</a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
          The link will be active 15 minutes before the meeting
        </p>
      </div>
      {% endif %}

      <div class="info-box">
        <p style="margin: 0;"><strong>📧 Calendar Invite Sent</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
          We've sent a calendar invitation to your email. Please accept it to add the meeting to your calendar and receive automatic reminders.
        </p>
      </div>

      <h3>What to Expect:</h3>
      <ul>
        <li>You'll receive a calendar invitation via email</li>
        <li>Automatic reminders will be sent 1 day and 30 minutes before the meeting</li>
        <li>Our support team will join the Google Meet at the scheduled time</li>
        <li>Please join a few minutes early if possible</li>
      </ul>

      <h3>Need to Reschedule?</h3>
      <p>If you need to reschedule or cancel, please contact us at <a href="mailto:support@pollenai.com">support@pollenai.com</a> or call +260 123 456 789.</p>
      
      <div class="footer">
        <p>Pollen - Empowering Financial Inclusion</p>
        <p>123 Innovation Street, Lusaka, Zambia</p>
        <p>Meeting ID: {{ data.meetingId }}</p>
      </div>
    </div>
  </div>
</body>
</html>
```

### SMS Template (Optional)

For the user confirmation SMS:

```
Meeting confirmed! {{ data.formattedDate }} at {{ data.meetingTime }}. Google Meet link: {{ data.googleMeetLink }}. Check your email for calendar invite. - Pollen
```

6. **Commit the Workflow**
   - Click "Commit"
   - Select "Development" or "Production"
   - Click "Commit"

## 📦 Step 7: Install Required Packages

```bash
npm install googleapis @knocklabs/node
```

## ✅ Step 8: Test the Integration

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the contact page**
   ```
   http://localhost:3000/contact
   ```

3. **Schedule a test meeting**
   - Go to "Schedule Meeting" tab
   - Fill in your details
   - Select a future date and time
   - Submit the form

4. **Verify the following**:
   - ✅ Meeting appears in Google Calendar
   - ✅ Google Meet link is generated
   - ✅ Calendar invites sent to both emails
   - ✅ Knock notifications triggered
   - ✅ Meeting confirmation page shows Google Meet link
   - ✅ Email received with calendar invite (.ics file)

## 🐛 Troubleshooting

### Error: "Invalid Credentials"
- Double-check your service account email and private key
- Ensure the private key includes `\n` characters (line breaks)
- Verify the service account has calendar access

### Error: "Calendar not found"
- Verify the calendar ID is correct
- Ensure the service account has been shared with the calendar
- Try using `"primary"` for testing

### No Google Meet Link Generated
- Ensure `conferenceDataVersion: 1` is set in the API call
- Google Meet must be enabled for your Google Workspace domain
- Check if the calendar has Google Meet enabled

### Calendar Invite Not Received
- Verify `sendUpdates: 'all'` is set
- Check spam/junk folders
- Ensure attendee emails are correct
- Calendar might take a few minutes to send invites

### Knock Notifications Not Sent
- Verify `KNOCK_SECRET_API_KEY` is correct
- Check Knock Dashboard logs for errors
- Ensure the workflow is committed to the correct environment
- Verify recipient email addresses

## 🔒 Security Best Practices

1. **Never commit `.env` file to Git**
   - Add to `.gitignore`

2. **Rotate service account keys regularly**
   - Create new keys every 90 days
   - Delete old keys

3. **Use least privilege principle**
   - Only grant Calendar Editor role
   - Don't grant Owner or Admin roles

4. **Monitor API usage**
   - Check Google Cloud Console for unusual activity
   - Set up billing alerts

## 📊 API Quotas & Limits

Google Calendar API quotas (free tier):
- **Queries per day**: 1,000,000
- **Queries per 100 seconds per user**: 1,000
- **Queries per 100 seconds**: 50,000

These limits are more than sufficient for most use cases.

## 🎯 Next Steps

After successful setup:

1. **Customize email templates** in Knock to match your branding
2. **Add SMS notifications** for meeting reminders
3. **Implement meeting cancellation** functionality
4. **Add calendar sync** for multiple time zones
5. **Create admin dashboard** to view all scheduled meetings

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Knock Documentation](https://docs.knock.app/)
- [Google Meet API](https://developers.google.com/meet)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)

## 💬 Support

If you encounter any issues:
- Check the server logs for detailed error messages
- Review Knock Dashboard for notification delivery status
- Verify Google Cloud Console for API errors
- Contact support at christopherzulu04@gmail.com

