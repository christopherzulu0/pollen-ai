"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  CheckCircle2,
  Sparkles
} from "lucide-react"

import { PollenLogo } from "@/components/shared/pollen-logo"

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
      color: "from-[#4C4EFB]/20 to-[#4C4EFB]/5",
      accent: "#4C4EFB",
      badge: "Secure & AI-Powered"
    },
    {
      title: "Village Banking Groups",
      description: "Create or join digital village banking groups. Manage contributions, loans, and payouts transparently with blockchain security.",
      icon: <Users className="w-16 h-16 text-[#00CC66]" />,
      color: "from-[#00CC66]/20 to-[#00CC66]/5",
      accent: "#00CC66",
      badge: "Community Finance"
    },
    {
      title: "Smart Loans",
      description: "Access instant micro-loans based on your transaction history and AI credit scoring. Fair rates and flexible repayment terms.",
      icon: <Wallet className="w-16 h-16 text-[#FFC000]" />,
      color: "from-[#FFC000]/20 to-[#FFC000]/5",
      accent: "#FFC000",
      badge: "Inclusive Credit"
    },
    {
      title: "Meeting Scheduling",
      description: "Schedule group meetings, consultations, or support calls effortlessly with our integrated booking system.",
      icon: <Calendar className="w-16 h-16 text-[#FF5555]" />,
      color: "from-[#FF5555]/20 to-[#FF5555]/5",
      accent: "#FF5555",
      badge: "Effortless Coordination"
    },
  ]

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] sm:max-w-[650px] p-0 overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 shadow-2xl flex flex-col max-h-[90vh] rounded-3xl top-[45%] sm:top-[50%]">
        <div className="p-4 sm:p-6 pb-0 flex items-center gap-3 shrink-0">
          <PollenLogo size={32} />
          <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
            Pollen<span className="text-[#4C4EFB]">AI</span>
          </span>
        </div>
        <div className="relative h-1.5 mt-4 bg-gray-100 dark:bg-gray-800/50 shrink-0">
          <motion.div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-[#4C4EFB] to-[#6366f1] transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: `${(current / count) * 100}%` }}
          />
        </div>

        <div className="absolute top-6 right-6 z-10">
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/10 rounded-full h-8 px-3">
            Skip
          </Button>
        </div>

        <Carousel setApi={setApi} className="w-full flex-1 min-h-0" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="flex items-center justify-center p-0">
                <div className="w-full h-full overflow-y-auto custom-scrollbar p-6 sm:p-10 flex flex-col items-center text-center">
                  <div className="relative mb-6 sm:mb-8 shrink-0">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                      animate={current === index + 1 ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      className={`w-28 h-28 sm:w-40 sm:h-40 rounded-[2.5rem] bg-linear-to-br ${slide.color} flex items-center justify-center relative z-10 shadow-inner`}
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
                      className="space-y-3 sm:space-y-4 max-w-[400px]"
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        <Sparkles className="w-3 h-3" style={{ color: slide.accent }} />
                        {slide.badge}
                      </div>
                      <h2 className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        {slide.title}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg leading-relaxed">
                        {slide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors" />
            <CarouselNext className="right-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors" />
          </div>
        </Carousel>

        <div className="p-6 sm:p-8 pt-0 flex flex-col gap-6 flex-shrink-0 bg-white/50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
            <div className="flex gap-2 justify-center order-2 sm:order-1">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === current
                    ? "w-8 bg-[#4C4EFB]"
                    : "w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                    }`}
                />
              ))}
            </div>
            <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
              {current === count ? (
                <Button
                  onClick={handleClose}
                  className="bg-linear-to-r from-[#4C4EFB] to-[#6366f1] hover:shadow-lg hover:shadow-[#4C4EFB]/20 text-white rounded-2xl h-12 px-8 w-full sm:w-auto font-bold transition-all active:scale-95"
                >
                  Get Started <CheckCircle2 className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={() => api?.scrollNext()}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-2xl h-12 px-8 w-full sm:w-auto font-bold transition-all active:scale-95 shadow-lg shadow-black/5"
                >
                  Continue <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
