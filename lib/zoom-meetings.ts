// Zoom Meeting Integration
// Documentation: https://developers.zoom.us/docs/api/

interface ZoomMeetingParams {
  topic: string;
  startTime: Date;
  duration: number; // in minutes
  agenda?: string;
  hostEmail?: string;
}

interface ZoomMeetingResponse {
  success: boolean;
  meetingId?: string;
  joinUrl?: string;
  startUrl?: string;
  password?: string;
  error?: string;
}

// Get Zoom OAuth access token
async function getZoomAccessToken(): Promise<string> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Missing Zoom credentials. Please set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET in .env');
  }

  // Server-to-Server OAuth
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Zoom access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Create a Zoom meeting
export async function createZoomMeeting(params: ZoomMeetingParams): Promise<ZoomMeetingResponse> {
  try {
    console.log('=== Creating Zoom Meeting ===');
    console.log('Topic:', params.topic);
    console.log('Start Time:', params.startTime.toISOString());
    console.log('Duration:', params.duration, 'minutes');

    // Get access token
    const accessToken = await getZoomAccessToken();
    console.log('✓ Zoom access token obtained');

    // Format start time for Zoom (ISO 8601 format)
    const startTime = params.startTime.toISOString();

    // Create meeting payload
    const meetingPayload = {
      topic: params.topic,
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration: params.duration,
      timezone: 'Africa/Lusaka', // Zambia timezone
      agenda: params.agenda || '',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
        mute_upon_entry: false,
        waiting_room: false, // Disabled for easier joining
        auto_recording: 'none', // Can be 'local', 'cloud', or 'none'
        meeting_authentication: false, // No password required
        approval_type: 0, // Automatically approve
      },
    };

    console.log('Creating meeting with Zoom API...');

    // Create meeting using Zoom API
    // Note: Using 'me' as user_id works with Server-to-Server OAuth
    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Zoom API error:', error);
      throw new Error(`Zoom API error: ${error.message || response.statusText}`);
    }

    const meeting = await response.json();

    console.log('✓ Zoom meeting created successfully');
    console.log('Meeting ID:', meeting.id);
    console.log('Join URL:', meeting.join_url);

    return {
      success: true,
      meetingId: meeting.id.toString(),
      joinUrl: meeting.join_url,
      startUrl: meeting.start_url,
      password: meeting.password,
    };
  } catch (error) {
    console.error('Failed to create Zoom meeting:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Update a Zoom meeting
export async function updateZoomMeeting(
  meetingId: string,
  updates: Partial<ZoomMeetingParams>
): Promise<ZoomMeetingResponse> {
  try {
    const accessToken = await getZoomAccessToken();

    const updatePayload: any = {};
    
    if (updates.topic) updatePayload.topic = updates.topic;
    if (updates.startTime) updatePayload.start_time = updates.startTime.toISOString();
    if (updates.duration) updatePayload.duration = updates.duration;
    if (updates.agenda) updatePayload.agenda = updates.agenda;

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update Zoom meeting: ${error.message}`);
    }

    console.log('✓ Zoom meeting updated successfully');

    return { success: true };
  } catch (error) {
    console.error('Failed to update Zoom meeting:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Delete a Zoom meeting
export async function deleteZoomMeeting(meetingId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getZoomAccessToken();

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      throw new Error(`Failed to delete Zoom meeting: ${error.message}`);
    }

    console.log('✓ Zoom meeting deleted successfully');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete Zoom meeting:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Get meeting details
export async function getZoomMeeting(meetingId: string) {
  try {
    const accessToken = await getZoomAccessToken();

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get Zoom meeting: ${error.message}`);
    }

    const meeting = await response.json();
    
    return {
      success: true,
      meeting,
    };
  } catch (error) {
    console.error('Failed to get Zoom meeting:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

