"use client"

import * as React from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"

const slides = [
  {
    title: "Welcome to Pollen AI",
    description:
      "Your all-in-one platform for financial inclusion, powered by artificial intelligence and blockchain technology.",
    badge: "Secure & AI-Powered",
    image: "/home.jpg",
  },
  {
    title: "Village Banking Groups",
    description:
      "Create or join digital village banking groups. Manage contributions, loans, and payouts transparently with blockchain security.",
    badge: "Community Finance",
    image: "/mission1.jpg",
  },
  {
    title: "Smart Loans",
    description:
      "Access instant micro-loans based on your transaction history and AI credit scoring. Fair rates and flexible repayment terms.",
    badge: "Inclusive Credit",
    image: "/vision.jpg",
  },
  {
    title: "Meeting Scheduling",
    description:
      "Schedule group meetings, consultations, or support calls effortlessly with our integrated booking system.",
    badge: "Effortless Coordination",
    image: "/church-community.png",
  },
]

export function UserOnboardingTour() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setOpen(false)
    localStorage.setItem("hasSeenOnboarding", "true")
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss()
    else setOpen(true)
  }

  const slide = slides[step]
  const isLast = step === slides.length - 1

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="relative aspect-video w-full">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
          <Image
            src="/pollen-logo.png"
            width={120}
            height={40}
            alt="Pollen"
            className="absolute left-4 top-4 h-8 w-auto"
          />
          <div className="absolute bottom-4 left-4 right-14 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{slide.badge}</Badge>
            <span className="text-sm font-medium text-white">
              Step {step + 1} of {slides.length}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <DialogHeader>
            <DialogTitle>{slide.title}</DialogTitle>
            <DialogDescription>{slide.description}</DialogDescription>
          </DialogHeader>

          <Progress value={((step + 1) / slides.length) * 100} className="h-2" />

          <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
            <Button type="button" variant="ghost" onClick={dismiss}>
              Skip
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={() => setStep((value) => value - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {isLast ? (
                <Button type="button" onClick={dismiss}>
                  Get Started
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={() => setStep((value) => value + 1)}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
