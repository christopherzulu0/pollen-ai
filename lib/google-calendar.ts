import { google } from 'googleapis';

// Initialize Google Calendar API
export function getCalendarClient() {
  // Try to use JSON file first (recommended method)
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (keyFilePath) {
    console.log('🔑 Using Google service account JSON file:', keyFilePath);
    
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return google.calendar({ version: 'v3', auth });
  }

  // Fallback to environment variables
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  // Debug logging
  console.log('🔑 Google Calendar Auth Debug (using env vars):');
  console.log('- Service Account Email:', email ? `${email.substring(0, 20)}...` : 'MISSING');
  console.log('- Private Key exists:', !!privateKey);
  console.log('- Private Key length:', privateKey?.length || 0);
  console.log('- Private Key starts with:', privateKey?.substring(0, 30) || 'N/A');
  
  if (!email || !privateKey) {
    throw new Error('Missing Google Calendar credentials. Either set GOOGLE_APPLICATION_CREDENTIALS to JSON file path, or set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in .env');
  }

  // Replace escaped newlines with actual newlines
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
  
  console.log('- Formatted key starts with:', formattedPrivateKey.substring(0, 30));
  console.log('- Has actual newlines:', formattedPrivateKey.includes('\n'));

  const credentials = {
    client_email: email,
    private_key: formattedPrivateKey,
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

export interface CreateMeetingEventParams {
  summary: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  attendeeEmails: string[];
  organizerName?: string;
  organizerEmail?: string;
}

export async function createCalendarEventWithMeet(params: CreateMeetingEventParams) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Base event object without Google Meet
    const baseEvent = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime.toISOString(),
        timeZone: 'Africa/Lusaka', // Zambia timezone
      },
      end: {
        dateTime: params.endDateTime.toISOString(),
        timeZone: 'Africa/Lusaka',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
    };

    // Try to create event with Google Meet first
    let response;
    let meetLink = '';
    
    try {
      console.log('Attempting to create event with Google Meet...');
      const eventWithMeet = {
        ...baseEvent,
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };
      
      response = await calendar.events.insert({
        calendarId,
        requestBody: eventWithMeet,
        conferenceDataVersion: 1,
        sendUpdates: 'none',
      });
      
      meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || '';
      console.log('✓ Created with Google Meet:', meetLink);
      
    } catch (meetError) {
      // Google Meet not available - create event without it
      console.log('⚠️ Google Meet not available, creating event without video link...');
      console.log('Meet error:', meetError instanceof Error ? meetError.message : meetError);
      
      response = await calendar.events.insert({
        calendarId,
        requestBody: baseEvent,
        sendUpdates: 'none',
      });
      
      console.log('✓ Created calendar event without Google Meet');
    }

    return {
      success: true,
      eventId: response.data.id,
      meetLink: meetLink || undefined,
      htmlLink: response.data.htmlLink,
      event: response.data,
    };
  } catch (error) {
    console.error('Google Calendar API error:', error);
    throw error;
  }
}

export async function updateCalendarEvent(eventId: string, updates: Partial<CreateMeetingEventParams>) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId,
      eventId,
    });

    // Merge updates
    const updatedEvent = {
      ...existingEvent.data,
      summary: updates.summary || existingEvent.data.summary,
      description: updates.description || existingEvent.data.description,
      start: updates.startDateTime
        ? {
            dateTime: updates.startDateTime.toISOString(),
            timeZone: 'Africa/Lusaka',
          }
        : existingEvent.data.start,
      end: updates.endDateTime
        ? {
            dateTime: updates.endDateTime.toISOString(),
            timeZone: 'Africa/Lusaka',
          }
        : existingEvent.data.end,
      attendees: updates.attendeeEmails
        ? updates.attendeeEmails.map((email) => ({ email }))
        : existingEvent.data.attendees,
    };

    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: updatedEvent,
      sendUpdates: 'none', // Knock handles notifications
    });

    return {
      success: true,
      eventId: response.data.id,
      meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri,
      htmlLink: response.data.htmlLink,
    };
  } catch (error) {
    console.error('Failed to update calendar event:', error);
    throw error;
  }
}

export async function cancelCalendarEvent(eventId: string) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'none', // Knock handles cancellation notifications
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to cancel calendar event:', error);
    throw error;
  }
}

// Helper to parse time string and create full datetime
export function createDateTime(dateString: string, timeString: string): Date {
  const [hours, minutes] = parseTime(timeString);
  const date = new Date(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Parse time string like "9:00 AM" to hours and minutes
function parseTime(timeString: string): [number, number] {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return [hours, minutes || 0];
}

// Generate meeting description
export function generateMeetingDescription(params: {
  name: string;
  email: string;
  phone?: string;
  purpose?: string;
}) {
  return `
Meeting requested by: ${params.name}
Email: ${params.email}
${params.phone ? `Phone: ${params.phone}` : ''}
${params.purpose ? `\nPurpose:\n${params.purpose}` : ''}

This meeting was scheduled via the Pollen contact form.
  `.trim();
}

