import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const meetingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
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

        // Optional: Send calendar invite/email notification here
        // await sendMeetingConfirmation(meetingRequest)

        return NextResponse.json(
            {
                success: true,
                message: "Your meeting has been scheduled successfully. We'll send you a confirmation email shortly.",
                data: {
                    id: meetingRequest.id,
                    meetingDate: meetingRequest.meetingDate.toISOString(),
                    meetingTime: meetingRequest.meetingTime,
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
