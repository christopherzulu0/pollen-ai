# 🚨 Quick Fix for Google Calendar Error

## The Problem
Error: `invalid_grant: Invalid grant: account not found`

This means your Google service account credentials are incorrectly formatted in the `.env` file.

## ⚡ Quick Solution (3 Steps)

### Step 1: Temporarily Disable Google Calendar

Add this to your `.env` file:

```bash
ENABLE_GOOGLE_CALENDAR=false
```

This will let meetings continue to work while you fix the credentials. You'll still get:
- ✅ Meeting saved to database
- ✅ Email notifications via Knock
- ✅ SMS notifications (if configured)
- ❌ No Google Calendar event (temporarily)

**Restart your server after adding this.**

---

### Step 2: Fix Your Private Key Format

The issue is almost always the **private key format**. 

#### ❌ WRONG FORMAT (has actual line breaks):
```bash
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC
BKcwggSjAgEAAoIBAQC1234567890
-----END PRIVATE KEY-----"
```

#### ✅ CORRECT FORMAT (has \n as literal text):
```bash
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1234567890\n-----END PRIVATE KEY-----\n"
```

**The key points**:
1. Everything on ONE line
2. `\n` are TWO characters (backslash + n), not actual newlines
3. Starts with `"-----BEGIN PRIVATE KEY-----\n`
4. Ends with `\n-----END PRIVATE KEY-----\n"`
5. Wrapped in double quotes

---

### Step 3: Get the Correct Format

Open your downloaded Google service account JSON file and look for:

```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-bot@project-id.iam.gserviceaccount.com"
}
```

**Copy the entire `private_key` value INCLUDING the quotes**, then paste it into your `.env`:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-bot@project-id.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

---

## 🧪 Test Your Fix

After updating `.env`:

1. **Restart your server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Check the debug logs** when you schedule a meeting. You should see:
   ```
   🔑 Google Calendar Auth Debug:
   - Service Account Email: your-bot@project-id...
   - Private Key exists: true
   - Private Key length: 1704
   - Private Key starts with: -----BEGIN PRIVATE KEY-----
   - Formatted key starts with: -----BEGIN PRIVATE KEY-----
   - Has actual newlines: true
   ```

3. **If "Has actual newlines: false"**, your format is still wrong.

---

## 🎯 Alternative: Use JSON File Directly

If you can't get the `.env` format right, use the JSON file directly:

1. **Save your service account JSON file** as `google-credentials.json` in project root

2. **Add to `.gitignore`**:
   ```
   google-credentials.json
   ```

3. **Update `.env`**:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"
   ENABLE_GOOGLE_CALENDAR=true
   ```

4. **Remove these lines** (they won't be needed):
   ```bash
   # GOOGLE_SERVICE_ACCOUNT_EMAIL="..."
   # GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="..."
   ```

This method is easier and avoids formatting issues!

---

## 📱 Re-enable Google Calendar

Once you've fixed the credentials:

```bash
ENABLE_GOOGLE_CALENDAR=true
```

Or just remove the line entirely (it's enabled by default).

---

## 🆘 Still Not Working?

Run this command to see detailed debug info:

```bash
npm run dev
```

Then schedule a test meeting and look for the debug logs that start with `🔑 Google Calendar Auth Debug`.

**Share these logs** (hide the actual private key content) and I can help you debug further.

---

## ✅ Success Indicators

When it's working, you'll see:
```
✓ Google Calendar event created: {
  eventId: 'abc123...',
  meetLink: 'https://meet.google.com/xxx-yyyy-zzz',
  htmlLink: 'https://calendar.google.com/...'
}
```

And the meeting confirmation page will show a clickable Google Meet link!

