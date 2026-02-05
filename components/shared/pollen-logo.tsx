"use client"

import React, { useId } from "react"
import { motion } from "framer-motion"

interface PollenLogoProps {
    className?: string
    size?: number
    animated?: boolean
}

export function PollenLogo({ className = "", size = 40, animated = true }: PollenLogoProps) {
    const id = useId()
    const gradientId = `pollen_gradient_${id.replace(/:/g, "")}`
    const glowId = `pollen_glow_${id.replace(/:/g, "")}`

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Background Glow */}
                {animated && (
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill={`url(#${glowId})`}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {/* Main "P" Stem / Abstract Path */}
                <motion.path
                    d="M35 25V75"
                    stroke="#4C4EFB"
                    strokeOpacity={0.8}
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ stroke: `url(#${gradientId})` }}
                />

                {/* Main "P" Loop / Abstract Leaf */}
                <motion.path
                    d="M35 25C35 25 75 25 75 50C75 75 35 75 35 75"
                    stroke="#4C4EFB"
                    strokeOpacity={0.8}
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    style={{ stroke: `url(#${gradientId})` }}
                />

                {/* Floating Pollen Particles */}
                {animated && [1, 2, 3].map((i) => (
                    <motion.circle
                        key={i}
                        cx={20 + i * 25}
                        cy={20 + (i % 2) * 50}
                        r="3"
                        fill="#4C4EFB"
                        initial={{ opacity: 0 }}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4143e3" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4C4EFB" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4C4EFB" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    )
}
