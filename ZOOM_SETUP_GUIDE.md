# 🎥 Zoom Integration Setup Guide

## 🎯 Overview

Your meeting scheduler now uses **Zoom** for automatic video conference link generation! This guide will help you set up Zoom integration in ~10 minutes.

## ✨ What You Get

✅ **Automatic Zoom Links** - Generated for every meeting  
✅ **Calendar Integration** - Syncs with Google Calendar  
✅ **Email Notifications** - Zoom link included in all emails  
✅ **No Manual Work** - Fully automated  
✅ **Professional Experience** - Zoom's reliable platform  

## 📋 Prerequisites

- Zoom account (Free or Paid)
- Admin access to your Zoom account
- 10 minutes of setup time

## 🚀 Step-by-Step Setup

### Step 1: Create Zoom Account

If you don't have a Zoom account:

1. Go to: https://zoom.us/signup
2. Sign up with your email
3. Verify your email
4. Complete profile setup

**Zoom Plans:**
- **Free**: Up to 40 minutes for 3+ participants (perfect for most meetings)
- **Pro** ($14.99/month): Unlimited meeting duration
- **Business**: Advanced features for teams

### Step 2: Create Server-to-Server OAuth App

1. **Go to Zoom App Marketplace**
   ```
   https://marketplace.zoom.us/
   ```

2. **Click "Develop" → "Build App"**

3. **Select "Server-to-Server OAuth"**
   - Click "Create"
   - This type doesn't require user authentication

4. **Fill in App Information**
   ```
   App Name: Pollen Meeting Scheduler
   Short Description: Automated meeting scheduling system
   Company Name: Your Company Name
   Developer Contact: your-email@example.com
   ```

5. **Click "Continue"**

### Step 3: Get Your Credentials

After creating the app, you'll see:

1. **App Credentials Page**
   - Copy these values (you'll need them):
   ```
   Account ID: xxxxxxxxxxxxxxxxxxxxxx
   Client ID: yyyyyyyyyyyyyyyyyyyyyyyy
   Client Secret: zzzzzzzzzzzzzzzzzzzzzz
   ```

2. **Add Scopes**
   - Click "Scopes" tab
   - Click "Add Scopes"
   - **Required Scopes:**
     - ✅ `meeting:write:admin` - Create meetings
     - ✅ `meeting:read:admin` - Read meeting details
     - ✅ `user:read:admin` - Read user information

3. **Click "Continue"** and then **"Activate"**

### Step 4: Add Credentials to .env

Open your `.env` file and add:

```bash
# Zoom Configuration
ZOOM_ACCOUNT_ID="your_account_id_here"
ZOOM_CLIENT_ID="your_client_id_here"
ZOOM_CLIENT_SECRET="your_client_secret_here"

# Enable Google Calendar (for calendar sync)
ENABLE_GOOGLE_CALENDAR=true

# Support Team Email
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"
```

**Important:** 
- Replace the placeholder values with your actual credentials
- Keep these secret - never commit to Git!
- The `.env` file is already in `.gitignore`

### Step 5: Restart Your Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 6: Test It!

1. Go to: http://localhost:3000/contact
2. Click "Schedule Meeting" tab
3. Fill in details and submit
4. ✅ Check for Zoom link on confirmation page!

## ✅ Verification

### Success Indicators

**In Terminal Logs:**
```
=== Creating Zoom Meeting ===
Topic: Meeting: John Doe - General Discussion
Start Time: 2024-12-25T14:00:00.000Z
Duration: 60 minutes
✓ Zoom access token obtained
Creating meeting with Zoom API...
✓ Zoom meeting created successfully
Meeting ID: 123456789
Join URL: https://zoom.us/j/123456789
```

**On Confirmation Page:**
- ✅ "Zoom Meeting Link" heading
- ✅ "Join Zoom" button
- ✅ Clickable link to Zoom meeting

**In Email:**
- ✅ Zoom link included
- ✅ Professional meeting details
- ✅ "Join Zoom" button

**In Zoom Dashboard:**
- Go to: https://zoom.us/meeting
- ✅ See scheduled meeting listed

## 🎨 Customizing Zoom Settings

Edit `lib/zoom-meetings.ts` to customize meeting settings:

```typescript
settings: {
  host_video: true,              // Host video on by default
  participant_video: true,       // Participant video on
  join_before_host: true,        // Allow joining before host
  mute_upon_entry: false,        // Don't mute participants
  waiting_room: false,           // No waiting room
  auto_recording: 'none',        // Options: 'local', 'cloud', 'none'
  meeting_authentication: false, // No password required
  approval_type: 0,              // Auto-approve
}
```

### Enable Waiting Room

```typescript
waiting_room: true,  // Guests wait for host approval
```

### Enable Recording

```typescript
auto_recording: 'cloud',  // Auto-record to cloud (requires Pro plan)
```

### Require Password

```typescript
meeting_authentication: true,
password: 'YourPassword123',
```

## 📧 Update Knock Email Templates

Your Knock emails now receive these new data fields:

```typescript
{
  videoMeetingLink: "https://zoom.us/j/123456789",
  zoomMeetingLink: "https://zoom.us/j/123456789",
  videoPlatform: "Zoom",
  hasVideoLink: true,
  videoInstructions: "Click the link below to join via Zoom"
}
```

### Update Email Templates in Knock

**For Support Team Email:**
```html
<h2>🎥 Join the Meeting</h2>
<p><strong>Platform:</strong> {{ data.videoPlatform }}</p>

{% if data.zoomMeetingLink %}
  <a href="{{ data.zoomMeetingLink }}" 
     style="display:inline-block;background:#2D8CFF;color:white;padding:15px 30px;text-decoration:none;border-radius:8px;font-weight:600;">
    Join Zoom Meeting
  </a>
  
  <p style="margin-top:15px;font-size:14px;color:#666;">
    <strong>Direct Link:</strong><br>
    {{ data.zoomMeetingLink }}
  </p>
{% endif %}
```

**For User Confirmation Email:**
```html
<h2>✅ Your Meeting is Confirmed!</h2>

{% if data.hasVideoLink %}
  <div style="background:#f0f9ff;border:2px solid #2D8CFF;border-radius:10px;padding:20px;margin:20px 0;">
    <h3>🎥 {{ data.videoPlatform }} Video Meeting</h3>
    
    <a href="{{ data.videoMeetingLink }}" 
       style="display:inline-block;background:#2D8CFF;color:white;padding:15px 40px;text-decoration:none;border-radius:8px;font-weight:600;margin:10px 0;">
      Join {{ data.videoPlatform }} Meeting
    </a>
    
    <p style="font-size:13px;color:#666;margin-top:10px;">
      Meeting link is active now. We recommend joining 5 minutes early!
    </p>
  </div>
{% else %}
  <p>{{ data.videoInstructions }}</p>
{% endif %}
```

## 🐛 Troubleshooting

### Error: "Missing Zoom credentials"

**Solution:**
```bash
# Check your .env file has all three:
ZOOM_ACCOUNT_ID="..."
ZOOM_CLIENT_ID="..."
ZOOM_CLIENT_SECRET="..."

# Restart server
npm run dev
```

### Error: "Failed to get Zoom access token"

**Possible causes:**
1. **Wrong credentials** - Double-check Account ID, Client ID, Client Secret
2. **App not activated** - Activate app in Zoom Marketplace
3. **Scopes not added** - Add required scopes to your app

**Solution:**
1. Go to: https://marketplace.zoom.us/user/build
2. Click on your app
3. Verify "Activated" status
4. Check "Scopes" tab has all required permissions
5. Copy credentials again

### Error: "Zoom API error: ..."

**Common issues:**

**"Invalid access token"**
- Token expired or wrong credentials
- Re-check ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET

**"User does not exist"**
- Using 'me' requires valid user token
- Check your Zoom account is active

**"Meeting not found"**
- Meeting ID is incorrect
- Meeting was deleted in Zoom dashboard

### No Zoom Link Created

**Check:**
1. ✅ Zoom credentials in `.env`
2. ✅ Server restarted after adding credentials
3. ✅ Terminal shows "Creating Zoom Meeting"
4. ✅ No error messages in logs

**Debug:**
```bash
# Check environment variables are loaded
npm run dev

# Look for these logs:
"=== Creating Zoom Meeting ==="
"✓ Zoom access token obtained"
"✓ Zoom meeting created successfully"
```

### Zoom Link Works But Google Calendar Fails

This is **OK**! Your main video solution is Zoom now. Google Calendar is optional for calendar sync.

**To enable Google Calendar:**
- See: `SETUP_YOUR_CALENDAR.md`

## 📊 Zoom vs Google Meet Comparison

| Feature | Zoom | Google Meet |
|---------|------|-------------|
| Free tier | ✅ 40min limit | ✅ 60min limit |
| Reliability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Video quality | Excellent | Good |
| Screen sharing | ✅ Advanced | ✅ Basic |
| Recording | ✅ Local + Cloud | ✅ Cloud only |
| Breakout rooms | ✅ Yes | ✅ Yes |
| Waiting room | ✅ Yes | ❌ No |
| Virtual backgrounds | ✅ Yes | ✅ Limited |
| API simplicity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Setup complexity | Easy | Complex |
| Works with service account | ✅ Yes | ❌ Requires Workspace |

## 🎯 Production Checklist

Before going live:

- [ ] Zoom account created and verified
- [ ] Server-to-Server OAuth app created
- [ ] Required scopes added to app
- [ ] App activated in Zoom Marketplace
- [ ] Credentials added to `.env`
- [ ] `.env` file in `.gitignore`
- [ ] Server restarted
- [ ] Test meeting scheduled successfully
- [ ] Zoom link appears on confirmation page
- [ ] Email notifications include Zoom link
- [ ] Knock email templates updated
- [ ] Meeting appears in Zoom dashboard
- [ ] Video link is clickable and works

## 🚀 Advanced Features

### Enable Cloud Recording

**Requirements:** Zoom Pro plan or higher

**In `lib/zoom-meetings.ts`:**
```typescript
settings: {
  auto_recording: 'cloud',  // Auto-record to cloud
  cloud_recording_option: 1, // Record active speaker with shared screen
}
```

### Add Waiting Room

```typescript
settings: {
  waiting_room: true,
  waiting_room_settings: {
    participants_to_place_in_waiting_room: 0, // All participants
  }
}
```

### Enable Webinar Mode

For large meetings:

```typescript
type: 5,  // Webinar instead of meeting
webinar: {
  panelists: [
    { email: 'host@example.com' }
  ]
}
```

### Add Calendar Description

```typescript
agenda: `
Meeting with: ${params.name}
Email: ${params.email}
Purpose: ${params.purpose}

Scheduled via Pollen Meeting Scheduler
`,
```

## 💰 Cost Analysis

### Free Plan
- ✅ Perfect for most use cases
- ✅ 100 participants
- ⏰ 40-minute limit (3+ participants)
- ⏰ Unlimited 1-on-1 meetings

### Pro Plan ($14.99/month)
- ✅ Unlimited meeting duration
- ✅ 100 participants
- ✅ Cloud recording (1GB)
- ✅ Social media streaming
- ✅ Custom meeting IDs

### Business Plan ($19.99/month/user)
- ✅ 300 participants
- ✅ Recording transcripts
- ✅ Managed domains
- ✅ Company branding

**Recommendation:** Start with Free, upgrade to Pro if you need longer meetings.

## 📚 Additional Resources

- **Zoom API Docs**: https://developers.zoom.us/docs/api/
- **Server-to-Server OAuth**: https://developers.zoom.us/docs/internal-apps/s2s-oauth/
- **Meeting API**: https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingCreate
- **Zoom Status**: https://status.zoom.us/

## 🆘 Still Need Help?

1. **Check terminal logs** for detailed error messages
2. **Verify credentials** in Zoom Marketplace
3. **Test OAuth** by checking access token retrieval
4. **Review Knock Dashboard** for email delivery status

## ✅ Summary

You now have **automatic Zoom integration**! Every meeting scheduled will:

1. ✅ Create a Zoom meeting automatically
2. ✅ Generate a unique meeting link
3. ✅ Send link in beautiful emails
4. ✅ Display link on confirmation page
5. ✅ Sync with Google Calendar (optional)
6. ✅ Track in database

**Your meeting scheduler is production-ready!** 🎉

---

**Next Steps:**
1. Set up your Zoom account (5 min)
2. Create OAuth app (3 min)
3. Add credentials to `.env` (1 min)
4. Test a meeting (1 min)
5. Update Knock email templates (optional)

**Total setup time: ~10 minutes** ⏱️

