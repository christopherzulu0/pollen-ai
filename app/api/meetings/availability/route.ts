import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get booked time slots for a specific date
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')

        if (!dateParam) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Date parameter is required",
                },
                { status: 400 }
            )
        }

        // Parse the date
        const selectedDate = new Date(dateParam)
        selectedDate.setHours(0, 0, 0, 0)

        // Get all booked time slots for this date
        const bookedMeetings = await prisma.meetingRequest.findMany({
            where: {
                meetingDate: selectedDate,
                status: {
                    in: ["pending", "confirmed"],
                },
            },
            select: {
                meetingTime: true,
                status: true,
            },
        })

        // Extract booked times
        const bookedTimes = bookedMeetings.map((meeting) => meeting.meetingTime)

        // Define all possible time slots
        const allTimeSlots = [
            "9:00 AM",
            "10:00 AM",
            "11:00 AM",
            "1:00 PM",
            "2:00 PM",
            "3:00 PM",
            "4:00 PM",
        ]

        // Calculate available times
        const availableTimes = allTimeSlots.filter((time) => !bookedTimes.includes(time))

        return NextResponse.json(
            {
                success: true,
                data: {
                    date: selectedDate.toISOString(),
                    allTimeSlots,
                    bookedTimes,
                    availableTimes,
                    totalSlots: allTimeSlots.length,
                    bookedCount: bookedTimes.length,
                    availableCount: availableTimes.length,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Availability check error:", error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to check availability. Please try again later.",
            },
            { status: 500 }
        )
    }
}

