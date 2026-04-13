"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import Image from "next/image"



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
      icon: <ShieldCheck className="h-9 w-9 shrink-0 text-[#4C4EFB] sm:h-12 sm:w-12 md:h-16 md:w-16" />,
      color: "from-[#4C4EFB]/20 to-[#4C4EFB]/5",
      accent: "#4C4EFB",
      badge: "Secure & AI-Powered"
    },
    {
      title: "Village Banking Groups",
      description: "Create or join digital village banking groups. Manage contributions, loans, and payouts transparently with blockchain security.",
      icon: <Users className="h-9 w-9 shrink-0 text-[#00CC66] sm:h-12 sm:w-12 md:h-16 md:w-16" />,
      color: "from-[#00CC66]/20 to-[#00CC66]/5",
      accent: "#00CC66",
      badge: "Community Finance"
    },
    {
      title: "Smart Loans",
      description: "Access instant micro-loans based on your transaction history and AI credit scoring. Fair rates and flexible repayment terms.",
      icon: <Wallet className="h-9 w-9 shrink-0 text-[#FFC000] sm:h-12 sm:w-12 md:h-16 md:w-16" />,
      color: "from-[#FFC000]/20 to-[#FFC000]/5",
      accent: "#FFC000",
      badge: "Inclusive Credit"
    },
    {
      title: "Meeting Scheduling",
      description: "Schedule group meetings, consultations, or support calls effortlessly with our integrated booking system.",
      icon: <Calendar className="h-9 w-9 shrink-0 text-[#FF5555] sm:h-12 sm:w-12 md:h-16 md:w-16" />,
      color: "from-[#FF5555]/20 to-[#FF5555]/5",
      accent: "#FF5555",
      badge: "Effortless Coordination"
    },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="top-[50%] grid h-[min(92dvh,calc(100dvh-1.5rem))] w-[min(95vw,100%-1rem)] max-w-[500px] grid-rows-[auto_auto_minmax(0,1fr)_auto] min-h-0 overflow-hidden rounded-3xl border border-border bg-popover/95 p-0 text-popover-foreground shadow-2xl backdrop-blur-xl sm:max-w-[650px]">
        <div className="flex shrink-0 items-center gap-2 pr-16 pt-1 pl-3 sm:gap-3 sm:p-6 sm:pb-0 sm:pr-24">
        <Image
              src="/pollen-logo.png"
              width={150}
              height={150}
              alt={"Pollen Logo"}
              />
          {/* <PollenLogo size={28} />
          <span className="text-lg font-black tracking-tight text-foreground sm:text-xl">
            Pollen<span className="text-primary">AI</span>
          </span> */}
        </div>
        <div className="relative mt-2 h-1.5 shrink-0 bg-muted sm:mt-4">
          <motion.div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-[#6366f1] transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: count ? `${(current / count) * 100}%` : "0%" }}
          />
        </div>

        <div className="absolute top-3 right-10 z-20 sm:top-6 sm:right-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Skip
          </Button>
        </div>

        <div className="min-h-0 min-w-0 overflow-hidden">
          <Carousel setApi={setApi} className="flex h-full min-h-0 w-full flex-col" opts={{ loop: true }}>
            <CarouselContent className="-ml-4 h-full min-h-0">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="basis-full pl-4">
                  <div className="flex max-h-full min-h-0 w-full flex-col items-center overflow-y-auto overscroll-contain px-2 py-3 text-center sm:px-6 sm:py-5">
                    <div className="relative mb-3 shrink-0 sm:mb-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={current === index + 1 ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      className={`relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl bg-linear-to-br shadow-inner sm:h-32 sm:w-32 sm:rounded-[2.5rem] md:h-36 md:w-36 lg:h-40 lg:w-40 ${slide.color}`}
                    >
                      {slide.icon}
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -inset-4 bg-linear-to-br from-[#4C4EFB]/20 to-transparent blur-2xl rounded-full -z-10"
                      style={{ backgroundColor: `${slide.accent}20` }}
                    />
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={current === index + 1 ? { y: 0, opacity: 1 } : {}}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="w-full min-w-0 max-w-[400px] space-y-2 sm:space-y-4"
                      >
                        <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground sm:px-3 sm:text-[10px]">
                          <Sparkles className="h-3 w-3 shrink-0" style={{ color: slide.accent }} />
                          <span className="break-words text-left leading-tight">{slide.badge}</span>
                        </div>
                        <h2 className="text-balance text-lg font-black leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                          {slide.title}
                        </h2>
                        <p className="text-pretty text-xs leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                          {slide.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-2 border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:left-4" />
              <CarouselNext className="right-2 border border-border bg-card/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:right-4" />
            </div>
          </Carousel>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-muted/30 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-4 sm:px-6 sm:pt-4 sm:pb-6 md:px-8">
          <div className="flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="order-1 w-full sm:order-2 sm:w-auto sm:shrink-0">
              {current === count ? (
                <Button
                  onClick={handleClose}
                  className="h-11 w-full min-h-11 rounded-2xl bg-linear-to-r from-primary to-[#6366f1] px-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get Started
                    <CheckCircle2 className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  </span>
                </Button>
              ) : (
                <Button
                  onClick={() => api?.scrollNext()}
                  variant="secondary"
                  className="h-11 w-full min-h-11 rounded-2xl px-4 text-sm font-bold shadow-md transition-all active:scale-[0.98] sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  </span>
                </Button>
              )}
            </div>
            <div className="order-2 flex flex-wrap justify-center gap-2 sm:order-1 sm:justify-start">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted hover:bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
