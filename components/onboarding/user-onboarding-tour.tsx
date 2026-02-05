"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Wallet,
    Calendar,
    Users,
    ShieldCheck,
    ArrowRight,
    CheckCircle2
} from "lucide-react"

export function UserOnboardingTour() {
    const [open, setOpen] = React.useState(false)
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
        if (!hasSeenOnboarding) {
            // Small delay to not overwhelm user immediately
            const timer = setTimeout(() => setOpen(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    React.useEffect(() => {
        if (!api) {
            return
        }

        // Force re-initialization after dialog animation to ensure correct width
        const timer = setTimeout(() => {
            api.reInit()
        }, 400);

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })

        return () => clearTimeout(timer)
    }, [api])

    const handleClose = () => {
        setOpen(false)
        localStorage.setItem("hasSeenOnboarding", "true")
    }

    const slides = [
        {
            title: "Welcome to Pollen AI",
            description: "Your all-in-one platform for financial inclusion, powered by artificial intelligence and blockchain technology.",
            icon: <ShieldCheck className="w-16 h-16 text-[#4C4EFB]" />,
            color: "bg-[#4C4EFB]/10",
        },
        {
            title: "Village Banking Groups",
            description: "Create or join digital village banking groups. Manage contributions, loans, and payouts transparently with blockchain security.",
            icon: <Users className="w-16 h-16 text-[#00CC66]" />,
            color: "bg-[#00CC66]/10",
        },
        {
            title: "Smart Loans",
            description: "Access instant micro-loans based on your transaction history and AI credit scoring. Fair rates and flexible repayment terms.",
            icon: <Wallet className="w-16 h-16 text-[#FFC000]" />,
            color: "bg-[#FFC000]/10",
        },
        {
            title: "Meeting Scheduling",
            description: "Schedule group meetings, consultations, or support calls effortlessly with our integrated booking system.",
            icon: <Calendar className="w-16 h-16 text-[#FF5555]" />,
            color: "bg-[#FF5555]/10",
        },
    ]

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[600px] p-0 overflow-visible bg-white dark:bg-gray-900 border-none shadow-2xl flex flex-col max-h-[90vh]">
                <div className="relative h-2 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#4C4EFB] transition-all duration-300"
                        style={{ width: `${(current / count) * 100}%` }}
                    />
                </div>

                <Carousel setApi={setApi} className="w-full flex-1 overflow-hidden" opts={{ loop: true }}>
                    <CarouselContent className="h-full">
                        {slides.map((slide, index) => (
                            <CarouselItem key={index} className="flex items-center justify-center">
                                <div className="w-full p-4 sm:p-6 pt-6 sm:pt-10 flex flex-col items-center text-center space-y-4 sm:space-y-6">
                                    <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center flex-shrink-0 ${slide.color}`}>
                                        {slide.icon}
                                    </div>
                                    <div className="space-y-2 min-w-0">
                                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-balance">
                                            {slide.title}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-2 sm:px-4 text-balance">
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden md:block">
                        <CarouselPrevious className="left-2 sm:left-4" />
                        <CarouselNext className="right-2 sm:right-4" />
                    </div>
                </Carousel>

                <div className="p-4 sm:p-6 pt-3 sm:pt-4 flex flex-col gap-3 flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                        <div className="flex gap-1 justify-center order-3 sm:order-1">
                            {Array.from({ length: count }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all ${i + 1 === current ? "w-6 bg-[#4C4EFB]" : "w-2 bg-gray-200 dark:bg-gray-700"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                            {current === count ? (
                                <Button onClick={handleClose} className="bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white rounded-full px-4 sm:px-6 w-full sm:w-auto">
                                    Get Started <CheckCircle2 className="ml-2 w-4 h-4" />
                                </Button>
                            ) : (
                                <Button onClick={() => api?.scrollNext()} variant="outline" className="rounded-full px-4 sm:px-6 w-full sm:w-auto">
                                    Next <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    {current < count && (
                        <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 justify-center sm:justify-start">
                            Skip Tour
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
