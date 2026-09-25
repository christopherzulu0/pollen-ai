"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
}

export default function ParallaxSection({ children, className = "", speed = 0.1 }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    const handleScroll = () => {
      const sectionTop = section.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      // Only apply parallax effect when the section is in view
      if (sectionTop < windowHeight && sectionTop > -section.offsetHeight) {
        // Calculate how far the section is from the center of the viewport
        const distanceFromCenter = sectionTop - windowHeight / 2

        // Apply the parallax effect
        content.style.transform = `translateY(${distanceFromCenter * speed}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return (
    <section ref={sectionRef} className={className}>
      <div ref={contentRef} className="transition-transform duration-300 ease-out">
        {children}
      </div>
    </section>
  )
}

