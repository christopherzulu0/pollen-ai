# 🚀 Setup Your Google Calendar - Quick Steps

## ✅ Step 1: Add to .env File

Open your `.env` file and add these lines:

```bash
# Google Calendar Configuration (using JSON file)
GOOGLE_APPLICATION_CREDENTIALS="./pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json"
GOOGLE_CALENDAR_ID="primary"
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"

# Enable Google Calendar (set to true)
ENABLE_GOOGLE_CALENDAR=true
```

That's it! The JSON file is already in your project root.

---

## ✅ Step 2: Secure the JSON File

Make sure your `.gitignore` includes:

```
*.json
pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json
.env
```

This prevents accidentally committing your private key to Git.

---

## ✅ Step 3: Enable Calendar API in Google Cloud

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project**: `pollenblockchain`
3. **Enable Google Calendar API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

---

## ✅ Step 4: Share Calendar with Service Account (Optional but Recommended)

If you want to use a specific calendar instead of "primary":

1. **Go to Google Calendar**: https://calendar.google.com/
2. **Create a new calendar**:
   - Left sidebar → "+" next to "Other calendars"
   - Name it: "Pollen Support Meetings"
3. **Share with service account**:
   - Go to calendar settings
   - "Share with specific people"
   - Add: `firebase-adminsdk-fbsvc@pollenblockchain.iam.gserviceaccount.com`
   - Permission: **Make changes to events**
4. **Get Calendar ID**:
   - In calendar settings → "Integrate calendar"
   - Copy the Calendar ID (looks like: `abc123@group.calendar.google.com`)
5. **Update .env**:
   ```bash
   GOOGLE_CALENDAR_ID="abc123@group.calendar.google.com"
   ```

For now, you can just use `"primary"` which is your default calendar.

---

## ✅ Step 5: Restart Your Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## ✅ Step 6: Test It!

1. Go to: http://localhost:3000/contact
2. Click "Schedule Meeting" tab
3. Fill in details and select a date/time
4. Submit the form

**You should see**:
```
🔑 Using Google service account JSON file: ./pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json
=== Creating Google Calendar Event ===
Meeting time: { start: '...', end: '...' }
✓ Google Calendar event created: {
  eventId: 'abc123...',
  meetLink: 'https://meet.google.com/xxx-yyyy-zzz',
  htmlLink: 'https://calendar.google.com/...'
}
```

---

## 🎯 What You'll Get

After this setup:
- ✅ **Automatic calendar events** in Google Calendar
- ✅ **Google Meet links** for video calls
- ✅ **Calendar invites** sent to both user and support team
- ✅ **Email notifications** with meeting details
- ✅ **Automatic reminders** (1 day + 30 min before)

---

## ⚠️ Troubleshooting

### "Calendar API has not been enabled"
- Go to Google Cloud Console
- Enable "Google Calendar API" for project `pollenblockchain`

### "Calendar not found"
- Make sure you're using `"primary"` initially
- Or create and share a calendar with your service account

### "Permission denied"
- Share the calendar with: `firebase-adminsdk-fbsvc@pollenblockchain.iam.gserviceaccount.com`
- Give "Make changes to events" permission

### Still getting "invalid_grant"?
- Make sure the JSON file path is correct in .env
- The file should be in your project root
- Try absolute path: `/home/developer/Documents/Projects/Chayanika/pollen-web/pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json`

---

## 📋 Complete .env Example

Your `.env` file should have these Google Calendar related variables:

```bash
# Google Calendar Configuration
GOOGLE_APPLICATION_CREDENTIALS="./pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json"
GOOGLE_CALENDAR_ID="primary"
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"
ENABLE_GOOGLE_CALENDAR=true

# Knock (your existing config)
KNOCK_SECRET_API_KEY=sk_test_YUvZu1uiehqCKQh64JHVUOnC2JshsNnNCxd3FpJWUWI
```

---

## ✅ Summary

**What you need to do NOW**:
1. ✏️ Add the 4 lines to your `.env` file (shown in Step 1)
2. 🔄 Restart your server
3. 🌐 Enable Calendar API in Google Cloud Console
4. 🧪 Test by scheduling a meeting

That's it! No need to copy/paste private keys manually. 🎉

