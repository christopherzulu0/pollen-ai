"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export default function AnimatedCounter({ value, duration = 2000, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  const animateCount = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }

    const progress = timestamp - startTimeRef.current
    const percentage = Math.min(progress / duration, 1)

    // Use easeOutQuad for smoother animation
    const easeOutPercentage = 1 - (1 - percentage) * (1 - percentage)

    countRef.current = Math.floor(easeOutPercentage * value)
    setCount(countRef.current)

    if (percentage < 1) {
      requestAnimationFrame(animateCount)
    } else {
      setCount(value)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTimeRef.current = null
          requestAnimationFrame(animateCount)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById(`counter-${value}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [value])

  return (
    <span id={`counter-${value}`} className={className}>
      {count}
    </span>
  )
}

