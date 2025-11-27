import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import Knock from "@knocklabs/node"
import { 
    createCalendarEventWithMeet, 
    createDateTime, 
    generateMeetingDescription 
} from "@/lib/google-calendar"
import { createZoomMeeting } from "@/lib/zoom-meetings"

// Initialize Knock client
function getKnockClient(): Knock {
    const apiKey = process.env.KNOCK_SECRET_API_KEY

    if (!apiKey) {
        throw new Error("KNOCK_SECRET_API_KEY is not defined in environment variables")
    }

    return new Knock({ apiKey })
}

// Helper function to format phone number for Africa's Talking (E.164 format)
function formatPhoneE164(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If already has + at start, remove it temporarily
    const hasPlus = cleaned.startsWith('+');
    if (hasPlus) {
        cleaned = cleaned.substring(1);
    }
    
    // Remove ALL leading zeros
    cleaned = cleaned.replace(/^0+/, '');
    
    // If starts with 260, add + and return
    if (cleaned.startsWith('260')) {
        return `+${cleaned}`;
    }
    
    // Otherwise, just add +260 prefix (Zambia)
    return `+260${cleaned}`;
}

// Validation schema
const meetingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().transform((val) => {
        if (!val) return undefined;
        return formatPhoneE164(val);
    }),
    meetingDate: z.string().refine((date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return selectedDate >= today
    }, "Meeting date must be in the future"),
    meetingTime: z.string().min(1, "Meeting time is required"),
    purpose: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request body
        const validatedData = meetingSchema.parse(body)

        // Convert date string to DateTime
        const meetingDateTime = new Date(validatedData.meetingDate)

        // Check for existing meetings at the same time (optional conflict check)
        const existingMeeting = await prisma.meetingRequest.findFirst({
            where: {
                meetingDate: meetingDateTime,
                meetingTime: validatedData.meetingTime,
                status: {
                    in: ["pending", "confirmed"],
                },
            },
        })

        if (existingMeeting) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This time slot is already booked. Please select a different time.",
                },
                { status: 409 }
            )
        }

        // Save to database
        const meetingRequest = await prisma.meetingRequest.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                meetingDate: meetingDateTime,
                meetingTime: validatedData.meetingTime,
                purpose: validatedData.purpose,
            },
        })

        // Parse meeting datetime (used by both Google Calendar and Zoom)
        const startDateTime = createDateTime(validatedData.meetingDate, validatedData.meetingTime);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        // Create Zoom meeting (primary video solution)
        let videoMeetingLink = '';
        let zoomMeetingId = '';
        
        try {
            console.log('=== Creating Zoom Meeting ===')
            
            const zoomResult = await createZoomMeeting({
                topic: `Meeting: ${validatedData.name} - ${validatedData.purpose || 'General Discussion'}`,
                startTime: startDateTime,
                duration: 60, // 1 hour
                agenda: generateMeetingDescription({
                    name: validatedData.name,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    purpose: validatedData.purpose,
                }),
            });

            if (zoomResult.success && zoomResult.joinUrl) {
                videoMeetingLink = zoomResult.joinUrl;
                zoomMeetingId = zoomResult.meetingId || '';
                
                console.log('✓ Zoom meeting created:', {
                    meetingId: zoomMeetingId,
                    joinUrl: videoMeetingLink,
                });
            } else {
                console.log('⚠️ Zoom meeting creation failed:', zoomResult.error);
            }
        } catch (zoomError) {
            console.error('Failed to create Zoom meeting:', zoomError);
            // Don't fail the request if Zoom creation fails
        }

        // Create Google Calendar event (for calendar sync)
        let googleMeetLink = '';
        let calendarEventId = '';
        
        // Check if Google Calendar is enabled
        const isGoogleCalendarEnabled = process.env.ENABLE_GOOGLE_CALENDAR !== 'false';
        
        if (!isGoogleCalendarEnabled) {
            console.log('⚠️ Google Calendar integration is disabled (set ENABLE_GOOGLE_CALENDAR=true to enable)');
        }
        
        if (isGoogleCalendarEnabled) {
            try {
                console.log('=== Creating Google Calendar Event ===')
            
            console.log('Meeting time:', {
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
            });
            
            console.log('Meeting time:', {
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
            });
            
            // Support team email (will receive calendar invite)
            const supportTeamEmail = process.env.SUPPORT_TEAM_EMAIL || 'christopherzulu04@gmail.com';
            
            // Create calendar event with Google Meet
            // Note: We only create the event to generate the Meet link
            // Knock handles sending invitations via email (more customizable and branded)
            const calendarResult = await createCalendarEventWithMeet({
                summary: `Meeting: ${validatedData.name} - ${validatedData.purpose || 'General Discussion'}`,
                description: generateMeetingDescription({
                    name: validatedData.name,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    purpose: validatedData.purpose,
                }),
                startDateTime,
                endDateTime,
                attendeeEmails: [], // Empty - Knock will send invitations instead
                organizerName: 'Pollen Support Team',
                organizerEmail: supportTeamEmail,
            });
            
            googleMeetLink = calendarResult.meetLink || '';
            calendarEventId = calendarResult.eventId || '';
            
            console.log('✓ Google Calendar event created:', {
                eventId: calendarEventId,
                meetLink: googleMeetLink || 'Not available',
                htmlLink: calendarResult.htmlLink,
            });
            
            // Update meeting request with details (including Zoom link)
            let notes = '';
            if (videoMeetingLink) {
                notes = `Zoom Meeting Link: ${videoMeetingLink}\nZoom Meeting ID: ${zoomMeetingId}\n`;
            }
            if (googleMeetLink) {
                notes += `Google Meet Link: ${googleMeetLink}\n`;
            }
            if (calendarEventId) {
                notes += `Calendar Event ID: ${calendarEventId}`;
            }
            if (!notes) {
                notes = 'Video conference link will be provided via email';
            }
            
            await prisma.meetingRequest.update({
                where: { id: meetingRequest.id },
                data: { notes },
            });
            
            } catch (calendarError) {
                console.error('Failed to create Google Calendar event:', calendarError);
                // Don't fail the request if calendar creation fails
                if (calendarError instanceof Error) {
                    console.error('Calendar error details:', calendarError.message);
                }
            }
        }

        // Send Knock notifications with video meeting link
        try {
            console.log('=== Sending Meeting Notifications ===')
            
            const knock = getKnockClient();
            const supportTeamEmail = process.env.SUPPORT_TEAM_EMAIL || 'christopherzulu04@gmail.com';
            
            // Use Zoom link as primary, fall back to Google Meet
            const finalVideoLink = videoMeetingLink || googleMeetLink || '';
            const videoPlatform = videoMeetingLink ? 'Zoom' : (googleMeetLink ? 'Google Meet' : 'Video Conference');
            
            const notificationData = {
                meetingId: meetingRequest.id,
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone || 'Not provided',
                meetingDate: meetingRequest.meetingDate.toISOString(),
                meetingTime: validatedData.meetingTime,
                purpose: validatedData.purpose || 'Not specified',
                // Video meeting details
                videoMeetingLink: finalVideoLink,
                zoomMeetingLink: videoMeetingLink || '',
                googleMeetLink: googleMeetLink || '',
                hasVideoLink: !!finalVideoLink,
                videoPlatform: videoPlatform,
                videoInstructions: finalVideoLink 
                    ? `Click the link below to join via ${videoPlatform}`
                    : 'Video conference link will be sent to you via email before the meeting',
                formattedDate: meetingRequest.meetingDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            };
            
            // Send to support team
            await knock.workflows.trigger('meeting-scheduled', {
                recipients: [
                    {
                        id: `support_team_${Date.now()}`,
                        email: supportTeamEmail,
                        name: 'Support Team',
                        user: 'support',
                    }
                ],
                data: {
                    ...notificationData,
                    isSupport: true,
                },
            });
            
            console.log('✓ Support team notification sent');
            
            // Send confirmation to user
            await knock.workflows.trigger('meeting-scheduled', {
                recipients: [
                    {
                        id: `meeting_user_${validatedData.email}`,
                        email: validatedData.email,
                        name: validatedData.name,
                        user: 'User',
                        phone_number: validatedData.phone,
                    }
                ],
                data: {
                    ...notificationData,
                    isUser: true,
                    userName: validatedData.name,
                },
            });
            
            console.log('✓ User confirmation notification sent');
            
        } catch (knockError) {
            console.error('Failed to send Knock notifications:', knockError);
            // Don't fail the request if notifications fail
        }

        const finalVideoLink = videoMeetingLink || googleMeetLink || '';
        
        return NextResponse.json(
            {
                success: true,
                message: finalVideoLink 
                    ? `Your meeting has been scheduled successfully! Check your email for the ${videoMeetingLink ? 'Zoom' : 'Google Meet'} link and meeting details.`
                    : "Your meeting has been scheduled successfully. We'll send you the video conference link via email shortly.",
                data: {
                    id: meetingRequest.id,
                    meetingDate: meetingRequest.meetingDate.toISOString(),
                    meetingTime: meetingRequest.meetingTime,
                    videoMeetingLink: finalVideoLink || undefined,
                    zoomMeetingLink: videoMeetingLink || undefined,
                    googleMeetLink: googleMeetLink || undefined,
                    calendarEventId: calendarEventId || undefined,
                    hasVideoLink: !!finalVideoLink,
                    videoPlatform: videoMeetingLink ? 'Zoom' : (googleMeetLink ? 'Google Meet' : undefined),
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Meeting request error:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to schedule meeting. Please try again later.",
            },
            { status: 500 }
        )
    }
}
