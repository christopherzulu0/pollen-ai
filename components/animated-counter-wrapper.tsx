"use client"
import AnimatedCounter from "@/components/animated-counter"

interface AnimatedCounterWrapperProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounterWrapper({
  value,
  prefix,
  suffix,
  duration = 2000,
  className = "",
}: AnimatedCounterWrapperProps) {
  return (
    <div className="flex items-center justify-center">
      {prefix && <span className="mr-1">{prefix}</span>}
      <AnimatedCounter value={value} duration={duration} className={className} />
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  )
}

