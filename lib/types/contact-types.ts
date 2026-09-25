export interface ContactFormData {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    department: string
    preferredContact: string
    timeframe: string
}

export interface MeetingFormData {
    name: string
    email: string
    phone?: string
    meetingDate: string
    meetingTime: string
    purpose?: string
}

export interface ContactMessageResponse {
    success: boolean
    message: string
    data?: { id: string }
}

export interface MeetingRequestResponse {
    success: boolean
    message: string
    data?: {
        id: string
        meetingDate: string
        meetingTime: string
    }
}
