"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

interface CitySelectorProps {
  onCityChange: (city: string) => void
  selectedCity: string
}

export function CitySelector({ onCityChange, selectedCity }: CitySelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group transition-all duration-300 ${
            selectedCity === "bogota" ? "ring-4 ring-yellow-400 scale-105" : "hover:shadow-2xl"
          }`}
          onClick={() => onCityChange("bogota")}
          whileHover={{ y: -10 }}
        >
          <div className="relative h-64 md:h-72">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Bogotá"
              alt="Bogotá"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-6 w-6 text-yellow-300" />
                <h3 className="text-3xl font-bold text-white">Bogotá</h3>
              </div>

              <div className="bg-blue-800/60 backdrop-blur-sm rounded-lg p-3 mb-2">
                <p className="text-yellow-300 font-medium mb-1">Fechas disponibles:</p>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• 16 AL 21 JUNIO - SEMANA 1</li>
                  <li>• 23 AL 28 JUNIO - SEMANA 2</li>
                  <li>• 14 AL 19 JULIO - SEMANA 3</li>
                </ul>
              </div>

              {selectedCity === "bogota" && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-sm transform rotate-3">
                  SELECCIONADO
                </div>
              )}
            </div>
          </div>

          {selectedCity === "bogota" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>

        <motion.div
          className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group transition-all duration-300 ${
            selectedCity === "barranquilla" ? "ring-4 ring-yellow-400 scale-105" : "hover:shadow-2xl"
          }`}
          onClick={() => onCityChange("barranquilla")}
          whileHover={{ y: -10 }}
        >
          <div className="relative h-64 md:h-72">
            <Image
              src="/placeholder.svg?height=400&width=600&text=Barranquilla"
              alt="Barranquilla"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-6 w-6 text-yellow-300" />
                <h3 className="text-3xl font-bold text-white">Barranquilla</h3>
              </div>

              <div className="bg-blue-800/60 backdrop-blur-sm rounded-lg p-3 mb-2">
                <p className="text-yellow-300 font-medium mb-1">Fechas disponibles:</p>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>• 23 AL 28 JUNIO - SEMANA 1</li>
                  <li>• 30 JUNIO AL 5 JULIO - SEMANA 2</li>
                </ul>
              </div>

              {selectedCity === "barranquilla" && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-sm transform rotate-3">
                  SELECCIONADO
                </div>
              )}
            </div>
          </div>

          {selectedCity === "barranquilla" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

