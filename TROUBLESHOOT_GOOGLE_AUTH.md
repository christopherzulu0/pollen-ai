# Troubleshooting Google Calendar Authentication

## ❌ Error: "invalid_grant: Invalid grant: account not found"

This error means Google cannot validate your service account credentials. Here's how to fix it:

## 🔍 Step 1: Verify Your Service Account Credentials

### Check Your .env File

Your `.env` file should look EXACTLY like this:

```bash
# WRONG - Missing \n characters ❌
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...-----END PRIVATE KEY-----"

# CORRECT - Has \n for line breaks ✅
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Key Points**:
- Must start with `"-----BEGIN PRIVATE KEY-----\n`
- Must end with `\n-----END PRIVATE KEY-----\n"`
- The `\n` characters are LITERAL text, not actual newlines
- The entire key should be on ONE line in .env file

### Example of Correct Format

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL="pollen-calendar-bot@your-project-123456.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1234567890abc\ndefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567\n890abcdefghijklmnopqrstuvwxyz...(many more lines)...890abcdefghijkl\nmnopqrstuvwxyz1234567890=\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID="primary"
SUPPORT_TEAM_EMAIL="christopherzulu04@gmail.com"
```

## 🛠️ Step 2: Extract Credentials from JSON File

When you download the service account JSON file from Google Cloud, it looks like:

```json
{
  "type": "service_account",
  "project_id": "your-project-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "pollen-calendar-bot@your-project-123456.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Copy these EXACTLY**:
1. `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
2. `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (including the `\n` characters!)

## ⚠️ Common Mistakes

### Mistake 1: Removing \n Characters
```bash
# WRONG ❌
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBg...
-----END PRIVATE KEY-----"

# CORRECT ✅
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

### Mistake 2: Using Wrong Email Format
```bash
# WRONG ❌
GOOGLE_SERVICE_ACCOUNT_EMAIL="myemail@gmail.com"

# CORRECT ✅
GOOGLE_SERVICE_ACCOUNT_EMAIL="service-account-name@project-id.iam.gserviceaccount.com"
```

### Mistake 3: Quotes in .env File
```bash
# WRONG - Extra quotes ❌
GOOGLE_SERVICE_ACCOUNT_EMAIL=""pollen-bot@project.iam.gserviceaccount.com""

# CORRECT ✅
GOOGLE_SERVICE_ACCOUNT_EMAIL="pollen-bot@project.iam.gserviceaccount.com"
```

## 🔧 Step 3: Alternative - Use JSON File Directly

Instead of using environment variables, you can use the JSON file directly:

### Update `lib/google-calendar.ts`:

Replace the `getCalendarClient()` function:

```typescript
// OLD - Using environment variables
export function getCalendarClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

// NEW - Using JSON file
export function getCalendarClient() {
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-credentials.json';
  
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}
```

Then:
1. Download the service account JSON file
2. Save it as `google-credentials.json` in your project root
3. Add to `.env`: `GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"`
4. Add to `.gitignore`: `google-credentials.json`

## 🧪 Step 4: Test Your Credentials

Create a test script to verify your credentials work:

```typescript
// test-google-auth.ts
import { google } from 'googleapis';

async function testGoogleAuth() {
  try {
    console.log('Testing Google Calendar API authentication...');
    
    // Method 1: Using environment variables
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    console.log('Service Account Email:', credentials.client_email);
    console.log('Private Key (first 50 chars):', credentials.private_key?.substring(0, 50));
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    // Try to list calendars
    const response = await calendar.calendarList.list();
    
    console.log('✅ SUCCESS! Found calendars:', response.data.items?.length);
    console.log('Calendars:', response.data.items?.map(cal => ({
      id: cal.id,
      summary: cal.summary,
    })));
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  }
}

testGoogleAuth();
```

Run it:
```bash
npx ts-node test-google-auth.ts
```

## 🚀 Step 5: Quick Fix - Use Primary Calendar Without Auth

For testing purposes, you can temporarily skip Google Calendar and just use Knock notifications:

### Update `app/api/meetings/request/route.ts`:

Add an environment flag:

```typescript
// At the top of the file
const ENABLE_GOOGLE_CALENDAR = process.env.ENABLE_GOOGLE_CALENDAR === 'true';

// In the POST handler, wrap Google Calendar code:
if (ENABLE_GOOGLE_CALENDAR) {
  try {
    console.log('=== Creating Google Calendar Event ===')
    // ... existing calendar code ...
  } catch (calendarError) {
    console.error('Failed to create Google Calendar event:', calendarError);
  }
} else {
  console.log('⚠️ Google Calendar integration disabled');
}
```

Then in `.env`:
```bash
ENABLE_GOOGLE_CALENDAR=false  # Temporarily disable
```

This way, meetings will still be scheduled and notifications sent, but without calendar integration until you fix the credentials.

## 📋 Checklist to Fix the Error

- [ ] Verify service account email format ends with `.iam.gserviceaccount.com`
- [ ] Verify private key starts with `"-----BEGIN PRIVATE KEY-----\n`
- [ ] Verify private key ends with `\n-----END PRIVATE KEY-----\n"`
- [ ] Ensure `\n` are literal text in .env file, not actual line breaks
- [ ] No extra quotes or spaces in .env values
- [ ] Service account exists in Google Cloud Console
- [ ] Service account key hasn't been deleted
- [ ] Re-download fresh JSON file from Google Cloud if unsure
- [ ] Try using JSON file directly instead of env variables

## 🎯 Most Likely Solution

Based on the error, the most common cause is **incorrect private key formatting**. 

**Do this now**:
1. Open your Google Cloud service account JSON file
2. Copy the `private_key` value EXACTLY as it appears (including `\n`)
3. Paste it into your `.env` file
4. Make sure it's wrapped in double quotes
5. Restart your dev server

Example:
```bash
# Copy THIS from JSON (notice the \n characters):
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"

# Paste into .env EXACTLY:
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

## 🆘 Still Not Working?

If you've tried everything above:

1. **Delete and recreate the service account key**:
   - Go to Google Cloud Console
   - IAM & Admin → Service Accounts
   - Click on your service account
   - Keys tab → Add Key → Create New Key → JSON
   - Download and use the new key

2. **Use a different authentication method** (Google OAuth2):
   - This requires user consent but is easier to debug
   - See: https://developers.google.com/calendar/api/quickstart/nodejs

3. **Contact me** with:
   - First 20 characters of your service account email
   - First 30 characters of your private key (after "BEGIN PRIVATE KEY")
   - Any other error messages

## 💡 Pro Tip

After fixing, test with a simple calendar list query before trying to create events. This helps isolate authentication issues from permission issues.

