"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Calendar, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PreRegistrationModal } from "@/components/pre-registration-modal"

interface CampLocationProps {
  city: string
  imageSrc: string
  dates: string[]
}

export function CampLocation({ city, imageSrc, dates }: CampLocationProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group h-full"
        whileHover={{
          y: -10,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-80">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`Sede ${city}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-6 w-6 text-yellow-300" />
              <h3 className="text-3xl font-bold text-white">Sede {city}</h3>
            </div>

            <div className="bg-blue-800/60 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-yellow-300 font-medium mb-2">Fechas disponibles:</p>
              <ul className="text-blue-100 space-y-1">
                {dates.map((date, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
            >
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold py-3 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                <span>RESERVAR CUPO</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <PreRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        city={city}
        availableDates={dates}
      />
    </>
  )
}

