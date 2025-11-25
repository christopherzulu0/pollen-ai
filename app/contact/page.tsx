"use client"

import type React from "react"

import { useState } from "react"
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"

// Add subtle background pattern
const bgPattern = {
  backgroundImage: `radial-gradient(#003366 0.5px, transparent 0.5px)`,
  backgroundSize: `20px 20px`,
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "",
    preferredContact: "email",
    timeframe: "anytime",
  })

  const [formStep, setFormStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("contact")
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: "user" | "bot"; time: string }[]>([
    {
      text: "Hello! How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard")
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [meetingFormData, setMeetingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
  })
  const [isMeetingSubmitting, setIsMeetingSubmitting] = useState(false)

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (formStep === 1) {
      if (!formData.name.trim()) errors.name = "Name is required"
      if (!formData.email.trim()) {
        errors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid"
      }
      if (formData.phone && !/^\+?[0-9\s\-()]{7,}$/.test(formData.phone)) {
        errors.phone = "Phone number is invalid"
      }
    } else if (formStep === 2) {
      if (!formData.subject.trim()) errors.subject = "Subject is required"
      if (!formData.department) errors.department = "Please select a department"
    } else if (formStep === 3) {
      if (!formData.message.trim()) errors.message = "Message is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const nextStep = () => {
    if (validateForm()) {
      setFormStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setFormStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Message Sent!", {
          description: data.message,
        })
        setFormSubmitted(true)
      } else {
        toast.error("Failed to send message", {
          description: data.message || "Please try again later.",
        })
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("Failed to send message", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      department: "",
      preferredContact: "email",
      timeframe: "anytime",
    })
    setFormStep(1)
    setFormSubmitted(false)
    setFormErrors({})
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = {
      text: chatInput,
      sender: "user" as const,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thank you for your message. A team member will get back to you shortly.",
        "I understand your question. Let me connect you with the right department.",
        "That's a great question! You can find more information on our services page.",
        "I'd be happy to help you with that. Could you provide more details?",
        "We typically respond to inquiries within 24 hours during business days.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      setChatMessages((prev) => [
        ...prev,
        {
          text: randomResponse,
          sender: "bot",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }, 1000)
  }

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev)
  }

  const handleMeetingSubmit = async () => {
    // Validate meeting form
    if (!meetingFormData.name || !meetingFormData.email || !selectedDate || !selectedTime) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields and select a date and time.",
      })
      return
    }

    setIsMeetingSubmitting(true)

    try {
      const response = await fetch("/api/meetings/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: meetingFormData.name,
          email: meetingFormData.email,
          phone: meetingFormData.phone,
          meetingDate: selectedDate,
          meetingTime: selectedTime,
          purpose: meetingFormData.purpose,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Meeting Scheduled!", {
          description: data.message,
        })
        // Reset form
        setMeetingFormData({ name: "", email: "", phone: "", purpose: "" })
        setSelectedDate("")
        setSelectedTime("")
      } else {
        toast.error("Failed to schedule meeting", {
          description: data.message || "Please try again later.",
        })
      }
    } catch (error) {
      console.error("Meeting request error:", error)
      toast.error("Failed to schedule meeting", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsMeetingSubmitting(false)
    }
  }

  // Calendar navigation functions
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Progress calculation for multi-step form
  const formProgress = (formStep / 3) * 100

  return (
    <ThemeProvider forcedTheme="light" attribute="class">
      <div className="flex flex-col min-h-screen">
        {/* Hero Section with Parallax Effect */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#002244] to-[#003366] z-0">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'url("/placeholder.svg?height=800&width=1600")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="absolute inset-0 bg-[#003366]/60"></div>
          </div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#00CC66]/80 to-[#00CC66]/60 rounded-full p-3 mb-6 shadow-lg shadow-[#00CC66]/20 animate-pulse">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
                Let's Start a Conversation
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                Have questions about our financial inclusion solutions? Our team is here to help you navigate your
                journey to financial empowerment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    const formElement = document.getElementById("contact-form")
                    formElement?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="bg-[#00CC66] hover:bg-[#00AA55] text-white"
                  size="lg"
                >
                  Send a Message
                </Button>
                <Button
                  onClick={() => setShowChatbot(true)}
                  variant="outline"
                  className="border-[#00CC66] bg-white/10 text-white hover:bg-white/20 hover:border-white transition-all"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat Now
                </Button>
              </div>
            </div>
          </div>

          {/* Animated wave divider */}
          <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Contact Options Tabs */}
        <section className="py-12 bg-white relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={bgPattern}></div>
          <div className="container px-4 md:px-6 mx-auto">
            <Tabs defaultValue="contact" className="w-full max-w-4xl mx-auto" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="contact" className="text-sm md:text-base">
                  <Mail className="h-4 w-4 mr-2 hidden md:inline" />
                  Contact Form
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-sm md:text-base">
                  <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
                  Schedule Meeting
                </TabsTrigger>
                <TabsTrigger value="directory" className="text-sm md:text-base">
                  <Phone className="h-4 w-4 mr-2 hidden md:inline" />
                  Directory
                </TabsTrigger>
              </TabsList>

              {/* Contact Form Tab */}
              <TabsContent value="contact" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2">
                    <div className="sticky top-24">
                      <h2 className="text-2xl font-bold text-[#003366] mb-3 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-[#00CC66]/30 after:rounded-full">
                        Contact Information
                      </h2>

                      <div className="space-y-4">
                        <Card className="border-2 border-[#003366]/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#00CC66]/50 hover:translate-y-[-2px]">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="bg-[#00CC66]/10 p-4 flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-[#00CC66]" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-[#003366] mb-1">Our Office</h3>
                                <p className="text-gray-600">123 Innovation Street</p>
                                <p className="text-gray-600">Lusaka, Zambia</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-[#003366]/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#00CC66]/50 hover:translate-y-[-2px]">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="bg-[#00CC66]/10 p-4 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-[#00CC66]" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-[#003366] mb-1">Email Us</h3>
                                <p className="text-gray-600">info@pollenai.com</p>
                                <p className="text-gray-600">support@pollenai.com</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-[#003366]/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#00CC66]/50 hover:translate-y-[-2px]">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="bg-[#00CC66]/10 p-4 flex items-center justify-center">
                                <Phone className="h-6 w-6 text-[#00CC66]" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-[#003366] mb-1">Call Us</h3>
                                <p className="text-gray-600">+260 123 456 789</p>
                                <p className="text-gray-600">+260 987 654 321</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-[#003366]/10 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#00CC66]/50 hover:translate-y-[-2px]">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="bg-[#00CC66]/10 p-4 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-[#00CC66]" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-[#003366] mb-1">Office Hours</h3>
                                <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-[#003366] mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full hover:bg-[#00CC66]/10 hover:text-[#00CC66] hover:border-[#00CC66]"
                                >
                                  <Facebook className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Facebook</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full hover:bg-[#00CC66]/10 hover:text-[#00CC66] hover:border-[#00CC66]"
                                >
                                  <Twitter className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Twitter</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full hover:bg-[#00CC66]/10 hover:text-[#00CC66] hover:border-[#00CC66]"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>LinkedIn</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full hover:bg-[#00CC66]/10 hover:text-[#00CC66] hover:border-[#00CC66]"
                                >
                                  <Instagram className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Instagram</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3" id="contact-form">
                    <Card className="border-2 border-[#003366]/10 shadow-sm hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        {!formSubmitted ? (
                          <>
                            <div className="mb-6">
                              <h2 className="text-2xl font-bold text-[#003366] mb-3 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-[#00CC66]/30 after:rounded-full">
                                Send Us a Message
                              </h2>
                              <p className="text-gray-600">
                                Fill out the form below and we'll get back to you as soon as possible.
                              </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
                              <div
                                className="bg-gradient-to-r from-[#00CC66] to-[#00AA55] h-2 rounded-full transition-all duration-500 ease-in-out shadow-inner"
                                style={{ width: `${formProgress}%` }}
                              ></div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                              {formStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                  <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[#003366]">
                                      Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="name"
                                      name="name"
                                      placeholder="Your full name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      className={`border-2 focus:border-[#00CC66] ${formErrors.name ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#003366]">
                                      Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="email"
                                      name="email"
                                      type="email"
                                      placeholder="Your email address"
                                      value={formData.email}
                                      onChange={handleChange}
                                      className={`border-2 focus:border-[#00CC66] ${formErrors.email ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.email && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[#003366]">
                                      Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                                    </Label>
                                    <Input
                                      id="phone"
                                      name="phone"
                                      placeholder="Your phone number"
                                      value={formData.phone}
                                      onChange={handleChange}
                                      className={`border-2 focus:border-[#00CC66] ${formErrors.phone ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.phone && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-[#003366]">Preferred Contact Method</Label>
                                    <div className="flex flex-wrap gap-4">
                                      {["email", "phone", "either"].map((method) => (
                                        <div
                                          key={method}
                                          onClick={() => handleSelectChange("preferredContact", method)}
                                          className={`
                                            flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer border-2 transition-all
                                            ${formData.preferredContact === method
                                              ? "border-[#00CC66] bg-[#00CC66]/10"
                                              : "border-gray-200 hover:border-gray-300"
                                            }
                                          `}
                                        >
                                          {method === "email" && <Mail className="h-4 w-4" />}
                                          {method === "phone" && <Phone className="h-4 w-4" />}
                                          {method === "either" && <CheckCircle className="h-4 w-4" />}
                                          <span className="capitalize">{method}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {formStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                  <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-[#003366]">
                                      Subject <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="subject"
                                      name="subject"
                                      placeholder="What is this regarding?"
                                      value={formData.subject}
                                      onChange={handleChange}
                                      className={`border-2 focus:border-[#00CC66] ${formErrors.subject ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.subject && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="department" className="text-[#003366]">
                                      Department <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                      value={formData.department}
                                      onValueChange={(value) => handleSelectChange("department", value)}
                                    >
                                      <SelectTrigger
                                        className={`border-2 focus:border-[#00CC66] ${formErrors.department ? "border-red-500" : "border-gray-200"}`}
                                      >
                                        <SelectValue placeholder="Select a department" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="customer-support">Customer Support</SelectItem>
                                        <SelectItem value="sales">Sales & Partnerships</SelectItem>
                                        <SelectItem value="technical">Technical Support</SelectItem>
                                        <SelectItem value="billing">Billing & Accounts</SelectItem>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {formErrors.department && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.department}</p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-[#003366]">Response Timeframe</Label>
                                    <div className="flex flex-wrap gap-4">
                                      {[
                                        {
                                          id: "urgent",
                                          label: "Urgent (24h)",
                                          icon: <AlertCircle className="h-4 w-4" />,
                                        },
                                        {
                                          id: "standard",
                                          label: "Standard (3-5 days)",
                                          icon: <Clock className="h-4 w-4" />,
                                        },
                                        { id: "anytime", label: "Anytime", icon: <Calendar className="h-4 w-4" /> },
                                      ].map((option) => (
                                        <div
                                          key={option.id}
                                          onClick={() => handleSelectChange("timeframe", option.id)}
                                          className={`
                                            flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer border-2 transition-all
                                            ${formData.timeframe === option.id
                                              ? "border-[#00CC66] bg-[#00CC66]/10"
                                              : "border-gray-200 hover:border-gray-300"
                                            }
                                          `}
                                        >
                                          {option.icon}
                                          <span>{option.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {formStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                  <div className="space-y-2">
                                    <Label htmlFor="message" className="text-[#003366]">
                                      Message <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                      id="message"
                                      name="message"
                                      placeholder="How can we help you?"
                                      rows={6}
                                      value={formData.message}
                                      onChange={handleChange}
                                      className={`border-2 focus:border-[#00CC66] resize-none ${formErrors.message ? "border-red-500" : "border-gray-200"}`}
                                    />
                                    {formErrors.message && (
                                      <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                                    )}
                                  </div>

                                  <div className="bg-[#003366]/5 p-4 rounded-lg">
                                    <h4 className="font-medium text-[#003366] mb-2">Summary</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <span className="text-gray-500">Name:</span> {formData.name}
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Email:</span> {formData.email}
                                      </div>
                                      {formData.phone && (
                                        <div>
                                          <span className="text-gray-500">Phone:</span> {formData.phone}
                                        </div>
                                      )}
                                      <div>
                                        <span className="text-gray-500">Subject:</span> {formData.subject}
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Department:</span>{" "}
                                        {formData.department === "customer-support"
                                          ? "Customer Support"
                                          : formData.department === "sales"
                                            ? "Sales & Partnerships"
                                            : formData.department === "technical"
                                              ? "Technical Support"
                                              : formData.department === "billing"
                                                ? "Billing & Accounts"
                                                : "General Inquiry"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between pt-4">
                                {formStep > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="border-[#003366] text-[#003366]"
                                  >
                                    Back
                                  </Button>
                                )}

                                {formStep < 3 ? (
                                  <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-[#003366] hover:bg-[#002244] ml-auto"
                                  >
                                    Continue
                                  </Button>
                                ) : (
                                  <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#00CC66] to-[#00AA55] hover:from-[#00AA55] hover:to-[#009944] ml-auto shadow-md hover:shadow-lg transition-all"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Message
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </form>
                          </>
                        ) : (
                          <div className="text-center py-8 animate-in fade-in duration-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00CC66]/20 mb-6">
                              <CheckCircle className="h-8 w-8 text-[#00CC66]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#003366] mb-4">Message Sent Successfully!</h2>
                            <p className="text-gray-600 mb-8">
                              Thank you for contacting us. We've received your message and will get back to you within{" "}
                              {formData.timeframe === "urgent"
                                ? "24 hours"
                                : formData.timeframe === "standard"
                                  ? "3-5 business days"
                                  : "a reasonable timeframe"}
                              .
                            </p>
                            <Button onClick={resetForm} className="bg-[#003366] hover:bg-[#002244]">
                              Send Another Message
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Schedule Meeting Tab */}
              <TabsContent value="schedule" className="mt-0">
                <Card className="border-2 border-[#003366]/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-[#003366] mb-3 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-[#00CC66]/30 after:rounded-full">
                        Schedule a Meeting
                      </h2>
                      <p className="text-gray-600">
                        Fill in your details and select a date and time that works for you.
                      </p>
                    </div>

                    {/* Contact Information Form */}
                    <div className="mb-8 space-y-4">
                      <h3 className="text-lg font-semibold text-[#003366] mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="meeting-name" className="text-[#003366]">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="meeting-name"
                            placeholder="Your full name"
                            value={meetingFormData.name}
                            onChange={(e) =>
                              setMeetingFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="border-2 focus:border-[#00CC66]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meeting-email" className="text-[#003366]">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="meeting-email"
                            type="email"
                            placeholder="Your email address"
                            value={meetingFormData.email}
                            onChange={(e) =>
                              setMeetingFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            className="border-2 focus:border-[#00CC66]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meeting-phone" className="text-[#003366]">
                            Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                          </Label>
                          <Input
                            id="meeting-phone"
                            placeholder="Your phone number"
                            value={meetingFormData.phone}
                            onChange={(e) =>
                              setMeetingFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            className="border-2 focus:border-[#00CC66]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meeting-purpose" className="text-[#003366]">
                            Purpose <span className="text-gray-400 font-normal">(Optional)</span>
                          </Label>
                          <Input
                            id="meeting-purpose"
                            placeholder="What would you like to discuss?"
                            value={meetingFormData.purpose}
                            onChange={(e) =>
                              setMeetingFormData((prev) => ({ ...prev, purpose: e.target.value }))
                            }
                            className="border-2 focus:border-[#00CC66]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-[#003366] mb-4">Select a Date</h3>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                          {/* Month/Year Navigation */}
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={previousMonth}
                              className="hover:bg-[#003366]/10"
                            >
                              <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <h4 className="text-base font-semibold text-[#003366]">
                              {monthNames[currentMonth]} {currentYear}
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={nextMonth}
                              className="hover:bg-[#003366]/10"
                            >
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </Button>
                          </div>

                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                              <div key={i} className="text-gray-500 text-sm py-1 font-medium">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center">
                            {(() => {
                              const daysInMonth = getDaysInMonth(currentMonth, currentYear)
                              const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
                              const days = []

                              // Empty cells for days before month starts
                              for (let i = 0; i < firstDay; i++) {
                                days.push(
                                  <div key={`empty-${i}`} className="py-2 text-gray-300">

                                  </div>
                                )
                              }

                              // Actual days of the month
                              for (let day = 1; day <= daysInMonth; day++) {
                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                                const isSelected = selectedDate === dateStr
                                const disabled = isDateDisabled(day)

                                days.push(
                                  <div
                                    key={day}
                                    className={`
                                      py-2 rounded-md text-sm cursor-pointer transition-all
                                      ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-[#00CC66]/10"}
                                      ${isSelected ? "bg-[#00CC66] text-white font-medium" : ""}
                                    `}
                                    onClick={() => !disabled && setSelectedDate(dateStr)}
                                  >
                                    {day}
                                  </div>
                                )
                              }

                              return days
                            })()}
                          </div>
                        </div>

                        {selectedDate && (
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold text-[#003366] mb-4">Selected Date</h3>
                            <div className="bg-[#003366]/5 p-4 rounded-lg">
                              <p className="font-medium">
                                {new Date(selectedDate).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-[#003366] mb-4">Select a Time</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {availableTimes.map((time, index) => (
                            <div
                              key={index}
                              className={`
                                border-2 p-3 rounded-md text-center cursor-pointer transition-all
                                ${selectedTime === time
                                  ? "border-[#00CC66] bg-[#00CC66]/10 text-[#003366] font-medium"
                                  : "border-gray-200 hover:border-gray-300"
                                }
                              `}
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </div>
                          ))}
                        </div>

                        {selectedDate && selectedTime && (
                          <div className="mt-8">
                            <Button
                              className="w-full bg-[#00CC66] hover:bg-[#00AA55]"
                              onClick={handleMeetingSubmit}
                              disabled={isMeetingSubmitting}
                            >
                              {isMeetingSubmitting ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Scheduling...
                                </>
                              ) : (
                                <>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Confirm Meeting
                                </>
                              )}
                            </Button>

                            <div className="mt-4 bg-[#003366]/5 p-4 rounded-lg">
                              <h4 className="font-medium text-[#003366] mb-2">Meeting Summary</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Name:</span> {meetingFormData.name || "Not provided"}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span> {meetingFormData.email || "Not provided"}
                                </p>
                                <p>
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(selectedDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                                <p>
                                  <span className="font-medium">Time:</span> {selectedTime}
                                </p>
                                {meetingFormData.purpose && (
                                  <p>
                                    <span className="font-medium">Purpose:</span> {meetingFormData.purpose}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Directory Tab */}
              <TabsContent value="directory" className="mt-0">
                <Card className="border-2 border-[#003366]/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-[#003366] mb-3 relative inline-block pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-[#00CC66]/30 after:rounded-full">
                        Contact Directory
                      </h2>
                      <p className="text-gray-600">
                        Find the right department or team member to address your specific needs.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        {[
                          {
                            id: "customer-support",
                            title: "Customer Support",
                            description: "Get help with your account, services, or general questions.",
                            contacts: [
                              { name: "Customer Care Team", email: "support@pollenai.com", phone: "+260 123 456 789" },
                              { name: "Account Services", email: "accounts@pollenai.com", phone: "+260 123 456 790" },
                            ],
                          },
                          {
                            id: "sales",
                            title: "Sales & Partnerships",
                            description: "Inquire about our services or explore partnership opportunities.",
                            contacts: [
                              { name: "Sales Team", email: "sales@pollenai.com", phone: "+260 123 456 791" },
                              { name: "Partnerships", email: "partners@pollenai.com", phone: "+260 123 456 792" },
                            ],
                          },
                          {
                            id: "technical",
                            title: "Technical Support",
                            description: "Get technical assistance with our platform and services.",
                            contacts: [
                              { name: "Technical Team", email: "tech@pollenai.com", phone: "+260 123 456 793" },
                              { name: "API Support", email: "api@pollenai.com", phone: "+260 123 456 794" },
                            ],
                          },
                          {
                            id: "management",
                            title: "Management Team",
                            description: "Contact our leadership team for strategic inquiries.",
                            contacts: [
                              { name: "Executive Office", email: "exec@pollenai.com", phone: "+260 123 456 795" },
                              { name: "Media Relations", email: "media@pollenai.com", phone: "+260 123 456 796" },
                            ],
                          },
                        ].map((department) => (
                          <AccordionItem key={department.id} value={department.id} className="border-b-2">
                            <AccordionTrigger className="hover:text-[#00CC66] hover:no-underline py-4">
                              <div className="flex items-center">
                                <div className="bg-[#00CC66]/10 p-2 rounded-full mr-3">
                                  {department.id === "customer-support" && (
                                    <MessageSquare className="h-5 w-5 text-[#00CC66]" />
                                  )}
                                  {department.id === "sales" && <ArrowRight className="h-5 w-5 text-[#00CC66]" />}
                                  {department.id === "technical" && <AlertCircle className="h-5 w-5 text-[#00CC66]" />}
                                  {department.id === "management" && <Users className="h-5 w-5 text-[#00CC66]" />}
                                </div>
                                <span className="font-medium text-[#003366]">{department.title}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="pl-10">
                                <p className="text-gray-600 mb-4">{department.description}</p>
                                <div className="space-y-4">
                                  {department.contacts.map((contact, index) => (
                                    <Card key={index} className="border border-gray-200">
                                      <CardContent className="p-4">
                                        <h4 className="font-medium text-[#003366] mb-2">{contact.name}</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-center">
                                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                            <a
                                              href={`mailto:${contact.email}`}
                                              className="text-[#00CC66] hover:underline"
                                            >
                                              {contact.email}
                                            </a>
                                          </div>
                                          <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                            <a href={`tel:${contact.phone}`} className="text-[#00CC66] hover:underline">
                                              {contact.phone}
                                            </a>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-[#003366]">Find Us</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Visit our office to learn more about our services and how we can help you.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant={mapView === "standard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapView("standard")}
                    className={mapView === "standard" ? "bg-[#003366] hover:bg-[#002244]" : ""}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={mapView === "satellite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapView("satellite")}
                    className={mapView === "satellite" ? "bg-[#003366] hover:bg-[#002244]" : ""}
                  >
                    Satellite
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </div>

              <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg overflow-hidden relative">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61293.30566999788!2d28.266886399999998!3d-15.4139224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19408b0b2e0a9a09%3A0x9e33fda14878f47e!2sLusaka%2C%20Zambia!5e${mapView === "satellite" ? "1" : "0"}!3m2!1sen!2sus!4v1647356518000!5m2!1sen!2sus`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Pollen AI Office Location"
                ></iframe>

                {/* Map marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-6 h-6 bg-[#00CC66] rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-[#00CC66]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-gray-200">
                  <CardContent className="p-4 flex items-center">
                    <MapPin className="h-5 w-5 text-[#00CC66] mr-3" />
                    <div>
                      <h4 className="font-medium text-[#003366]">Address</h4>
                      <p className="text-sm text-gray-600">123 Innovation Street, Lusaka, Zambia</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-4 flex items-center">
                    <Clock className="h-5 w-5 text-[#00CC66] mr-3" />
                    <div>
                      <h4 className="font-medium text-[#003366]">Office Hours</h4>
                      <p className="text-sm text-gray-600">Mon-Fri: 8AM-5PM, Sat: 9AM-1PM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-4 flex items-center">
                    <Phone className="h-5 w-5 text-[#00CC66] mr-3" />
                    <div>
                      <h4 className="font-medium text-[#003366]">Phone</h4>
                      <p className="text-sm text-gray-600">+260 123 456 789</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section with Accordion */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-[#003366]">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Find quick answers to common questions about contacting us.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How quickly will you respond to my inquiry?",
                    answer:
                      "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our customer support line or select the 'Urgent' timeframe when submitting your contact form.",
                  },
                  {
                    question: "Can I schedule a meeting with your team?",
                    answer:
                      "Yes, you can request a meeting through our contact form or by using our meeting scheduler. We offer both in-person meetings at our Lusaka office and virtual meetings via video conferencing platforms.",
                  },
                  {
                    question: "Do you have offices in other locations?",
                    answer:
                      "Currently, our main office is in Lusaka, but we have representatives in several provinces across Zambia including Copperbelt, Northern, and Southern provinces. We're expanding to more locations soon.",
                  },
                  {
                    question: "How can I apply for a job at Pollen AI?",
                    answer:
                      "Please send your resume and cover letter to careers@pollenai.com. You can also check our Careers page for current openings. We're always looking for talented individuals who are passionate about financial inclusion and technology.",
                  },
                  {
                    question: "Can I get technical support for your services?",
                    answer:
                      "Yes, our technical support team is available Monday through Friday from 8:00 AM to 5:00 PM. You can reach them by selecting 'Technical Support' in the department dropdown of our contact form or by emailing tech@pollenai.com.",
                  },
                  {
                    question: "How do I report an issue with my account?",
                    answer:
                      "To report an account issue, please contact our Customer Support team through the contact form, selecting 'Customer Support' as the department, or call our support line at +260 123 456 789. Please have your account details ready.",
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b-2">
                    <AccordionTrigger className="hover:text-[#00CC66] hover:no-underline py-4">
                      <span className="font-medium text-[#003366] text-left">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
                <Button
                  onClick={() => {
                    const formElement = document.getElementById("contact-form")
                    formElement?.scrollIntoView({ behavior: "smooth" })
                    setActiveTab("contact")
                  }}
                  className="bg-[#003366] hover:bg-[#002244]"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Chat Widget */}
        {showChatbot && (
          <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border-2 border-[#003366]/10 animate-in slide-in-from-right-10 duration-300">
            <div className="bg-gradient-to-r from-[#003366] to-[#002244] text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Live Chat</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChatbot}
                className="text-white hover:bg-[#002244] h-8 w-8"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`
                      max-w-[80%] rounded-lg p-3 
                      ${msg.sender === "user"
                        ? "bg-[#003366] text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                      }
                    `}
                  >
                    <p className={`text-sm ${msg.sender === "user" ? "text-white" : "text-gray-800"}`}>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white">
              <div className="flex">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="border-2 focus:border-[#00CC66]"
                />
                <Button type="submit" className="ml-2 bg-[#00CC66] hover:bg-[#00AA55]" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Floating Chat Button (when chat is closed) */}
        {!showChatbot && (
          <Button
            onClick={toggleChatbot}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-[#00CC66] to-[#00AA55] hover:from-[#00AA55] hover:to-[#009944] shadow-lg hover:shadow-xl rounded-full h-14 w-14 p-0 flex items-center justify-center animate-in fade-in duration-300 hover:scale-105 transition-all"
          >
            <div className="absolute inset-0 bg-[#00CC66] rounded-full animate-ping opacity-30"></div>
            <MessageSquare className="h-6 w-6 relative z-10" />
          </Button>
        )}
      </div>
    </ThemeProvider>
  )
}

