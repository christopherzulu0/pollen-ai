import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import Knock from "@knocklabs/node"
import { auth } from "@clerk/nextjs/server"

// Initialize Knock client
function getKnockClient(): Knock {
    const apiKey = process.env.KNOCK_SECRET_API_KEY

    if (!apiKey) {
        throw new Error("KNOCK_SECRET_API_KEY is not defined in environment variables")
    }

    return new Knock({ apiKey })
}

// Department email mapping
const DEPARTMENT_EMAILS: Record<string, string> = {
    "customer-support": "chrisdev370@gmail.com",
    "sales": "christopherzulu04@gmail.com",
    "technical": "christopherzulu04@gmail.com",
    "billing": "christopherzulu04@gmail.com",
    "general": "christopherzulu04@gmail.com",
}

// Department type mapping for Knock workflow branching
// These values match your Knock workflow branch conditions
const DEPARTMENT_TYPES: Record<string, string> = {
    "customer-support": "customer_support", // matches "recipient.user contains customer_support"
    "sales": "sales", // matches "recipient.user contains sales"
    "technical": "technical", // matches "recipient.user contains technical"
    "billing": "billing", // matches "recipient.user contains billing"
    "general": "inquiry", // matches "recipient.user contains inquiry"
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
const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().transform((val) => {
        if (!val) return undefined;
        return formatPhoneE164(val);
    }),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    department: z.enum(["customer-support", "sales", "technical", "billing", "general"]),
    preferredContact: z.enum(["email", "phone", "either"]).default("email"),
    timeframe: z.enum(["urgent", "standard", "anytime"]).default("anytime"),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request body
        const validatedData = contactSchema.parse(body)

        // Get authenticated user (optional - contact form can be public)
        const { userId } = await auth()

        // Debug: Check if prisma is defined
        if (!prisma) {
            console.error("Prisma client is undefined!")
            throw new Error("Database connection not available")
        }

        // Debug: Check if contactMessage model exists
        if (!prisma.contactMessage) {
            console.error("ContactMessage model not found in Prisma client")
            console.error("Available models:", Object.keys(prisma))
            throw new Error("ContactMessage model not available")
        }

        // Save to database
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                subject: validatedData.subject,
                message: validatedData.message,
                department: validatedData.department,
                preferredContact: validatedData.preferredContact,
                timeframe: validatedData.timeframe,
            },
        })

            // Send Knock notifications
        try {
            console.log('=== Starting Knock notification process ===')
            
            // Check if API key exists
            const apiKey = process.env.KNOCK_SECRET_API_KEY
            if (!apiKey) {
                console.error('KNOCK_SECRET_API_KEY is not set!')
                throw new Error('Knock API key not configured')
            }
            console.log('✓ Knock API key found:', apiKey.substring(0, 10) + '...')
            
            const knock = getKnockClient()
            const departmentType = DEPARTMENT_TYPES[validatedData.department] || "inquiry"
            const departmentEmail = DEPARTMENT_EMAILS[validatedData.department]

            // Log phone number formatting
            if (validatedData.phone) {
                console.log('📱 Phone number after formatting:', validatedData.phone)
                console.log('📱 Phone length:', validatedData.phone.length)
                console.log('📱 Starts with +260?', validatedData.phone.startsWith('+260'))
            }
            
            console.log('Department mapping:', {
                department: validatedData.department,
                departmentType: departmentType,
                departmentEmail: departmentEmail,
                phone: validatedData.phone
            })

            if (!departmentEmail) {
                throw new Error(`No email configured for department: ${validatedData.department}`)
            }

            // Notification data
            const notificationData = {
                contactId: contactMessage.id,
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone || "Not provided",
                subject: validatedData.subject,
                message: validatedData.message,
                department: validatedData.department,
                departmentType: departmentType,
                preferredContact: validatedData.preferredContact,
                timeframe: validatedData.timeframe,
                submittedAt: contactMessage.createdAt.toISOString(),
                // Add these for easier branching in Knock
                isCustomerSupport: departmentType === 'customer_support',
                isSales: departmentType === 'sales',
                isTechnical: departmentType === 'technical',
                isBilling: departmentType === 'billing',
                isInquiry: departmentType === 'inquiry',
                recipientType: departmentType, // Alternative field for branching
            }

            // Send notification to department using recipient.user property for branching
            // recipient.user should contain: customer_support, sales, technical, billing, or inquiry
            const departmentRecipient = {
                id: `dept_${validatedData.department}_${Date.now()}`,
                email: departmentEmail,
                name: `${validatedData.department.replace('-', ' ').toUpperCase()} Department`,
                user: departmentType,
                phone: validatedData.phone || undefined, // Add phone for SMS notifications
            }

            console.log('=== Triggering Department Notification ===')
            console.log('Workflow name: contact')
            console.log('Recipient:', JSON.stringify(departmentRecipient, null, 2))
            console.log('Data keys:', Object.keys(notificationData))

            // Send notification to department
            try {
                // Try with just email string first to test if workflow exists
                console.log('Attempting to trigger workflow...')
                
                const departmentNotification = await knock.workflows.trigger("contact", {
                    recipients: [departmentRecipient],
                    data: notificationData,
                })

                console.log('✓ Department notification triggered successfully!')
                console.log('Response:', JSON.stringify(departmentNotification, null, 2))
                console.log('Workflow run ID:', departmentNotification.workflow_run_id)
            } catch (deptError: any) {
                console.error('✗ Failed to trigger department notification')
                console.error('Error type:', typeof deptError)
                console.error('Error object:', deptError)
                
                if (deptError.response) {
                    console.error('Response status:', deptError.response.status)
                    console.error('Response data:', deptError.response.data)
                }
                
                if (deptError instanceof Error) {
                    console.error('Message:', deptError.message)
                    console.error('Stack:', deptError.stack)
                }
                
                // Don't throw - allow the request to succeed even if notification fails
                console.error('Continuing despite notification failure...')
            }

            // Send notification to user with "user" branch
            if (userId || validatedData.email) {
                console.log('=== Triggering User Confirmation ===')
                try {
                    // Send confirmation notification to user
                    const userRecipient = {
                        id: userId || `contact_user_${validatedData.email}`,
                        email: validatedData.email,
                        name: validatedData.name,
                        user: "User",
                        phone_number: validatedData.phone || undefined, // Add phone for SMS notifications
                    }

                    console.log('User Recipient:', JSON.stringify(userRecipient, null, 2))

                    const userNotification = await knock.workflows.trigger("contact", {
                        recipients: [userRecipient],
                        data: {
                            ...notificationData,
                            userName: validatedData.name,
                            isUserConfirmation: true,
                        },
                    })
                    
                    console.log('✓ User confirmation triggered successfully!')
                    console.log('Response:', JSON.stringify(userNotification, null, 2))
                } catch (userNotifError) {
                    console.error('✗ Failed to send user confirmation:', userNotifError)
                    if (userNotifError instanceof Error) {
                        console.error('Message:', userNotifError.message)
                        console.error('Stack:', userNotifError.stack)
                    }
                }
            }

            console.log(`✓ Knock notification process completed for: ${contactMessage.id}`)
        } catch (knockError) {
            // Log error but don't fail the request
            console.error("Failed to send Knock notifications:", knockError)
            if (knockError instanceof Error) {
                console.error("Error details:", knockError.message)
                console.error("Error stack:", knockError.stack)
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Your message has been sent successfully. We'll get back to you soon!",
                data: { id: contactMessage.id },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Contact form error:", error)

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
                message: error instanceof Error ? error.message : "Failed to send message. Please try again later.",
            },
            { status: 500 }
        )
    }
}
