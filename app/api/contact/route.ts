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
    "customer-support": "christopherzulu04@gmail.com",
    "sales": "christopherzulu04@gmail.com",
    "technical": "christopherzulu04@gmail.com",
    "billing": "christopherzulu04@gmail.com",
    "general": "christopherzulu04@gmail.com",
}

// Department type mapping for Knock workflow branching
const DEPARTMENT_TYPES: Record<string, string> = {
    "customer-support": "customer",
    "sales": "sales",
    "technical": "technical",
    "billing": "billing",
    "general": "inquiry",
}

// Validation schema
const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
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
            const knock = getKnockClient()
            const departmentType = DEPARTMENT_TYPES[validatedData.department] || "inquiry"
            const departmentEmail = DEPARTMENT_EMAILS[validatedData.department]

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
                departmentType: departmentType, // For workflow branching
                preferredContact: validatedData.preferredContact,
                timeframe: validatedData.timeframe,
                submittedAt: contactMessage.createdAt.toISOString(),
            }

            console.log('Triggering Knock workflow with data:', JSON.stringify({
                workflow: 'contact',
                recipients: [departmentEmail],
                dataKeys: Object.keys(notificationData)
            }))

            // Send notification to department email using single workflow with branches
            const departmentNotification = await knock.workflows.trigger("contact", {
                recipients: [departmentEmail],
                data: notificationData,
            })

            console.log('Knock workflow triggered successfully:', departmentNotification)

            // Send notification to user if authenticated
            if (userId) {
                await knock.workflows.trigger("contact", {
                    recipients: [userId],
                    data: {
                        ...notificationData,
                        userName: validatedData.name,
                        isUserConfirmation: true, // Flag for user confirmation branch
                    },
                })
                console.log(`User confirmation sent to Knock user: ${userId}`)
            }

            console.log(`Knock notifications sent for contact form submission: ${contactMessage.id}`)
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
