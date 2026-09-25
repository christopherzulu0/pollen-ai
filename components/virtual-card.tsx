"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Wifi } from "lucide-react"

export default function VirtualCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardNumber, setCardNumber] = useState("4929 •••• •••• 7531")
  const [cardName, setCardName] = useState("JOHN DOE")
  const [expiryDate, setExpiryDate] = useState("05/28")

  return (
    <div
      className="perspective-1000 w-full max-w-md mx-auto h-56 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#003366] via-[#004488] to-[#005599]">
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="80" fill="white" fillOpacity="0.1" />
                <circle cx="380" cy="230" r="100" fill="white" fillOpacity="0.1" />
                <path d="M0 0 L400 250" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
                <path d="M400 0 L0 250" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="text-white font-bold text-xl">Pollen AI</div>
              <Wifi className="h-6 w-6 text-white" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-10 h-6 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded mr-2"></div>
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
                </div>
                <p className="text-white font-mono text-lg tracking-wider">{cardNumber}</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-white/60 text-xs">CARD HOLDER</p>
                  <p className="text-white font-mono">{cardName}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">EXPIRES</p>
                  <p className="text-white font-mono">{expiryDate}</p>
                </div>
                <div>
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl rotate-y-180">
          <div className="absolute inset-0 bg-gradient-to-br from-[#003366] via-[#004488] to-[#005599]">
            <div className="absolute inset-0 opacity-30">
              <svg width="100%" height="100%" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="80" fill="white" fillOpacity="0.1" />
                <circle cx="380" cy="230" r="100" fill="white" fillOpacity="0.1" />
              </svg>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col">
            <div className="h-12 bg-black mt-6"></div>

            <div className="flex-1 p-6">
              <div className="bg-white/80 h-10 rounded flex items-center justify-end px-4 mt-4">
                <p className="font-mono text-gray-800">***</p>
              </div>

              <div className="mt-8 space-y-2">
                <p className="text-white/80 text-xs">
                  This card is issued by Pollen AI Financial Services under license from Visa/Mastercard.
                </p>
                <p className="text-white/80 text-xs">
                  Use of this card is subject to the terms and conditions of your cardholder agreement.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <p className="text-white font-mono text-sm">www.pollenai.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

