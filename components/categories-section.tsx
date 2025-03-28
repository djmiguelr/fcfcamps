"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { CategoryModal } from "@/components/category-modal"
import { Users } from "lucide-react"
import { PreRegistrationModal } from "@/components/pre-registration-modal"

// Datos de las categorías
const categories = [
  {
    id: "iniciacion",
    title: "Iniciación",
    ageRange: "6 a 9 años",
    description:
      "Programa diseñado para introducir a los más pequeños al mundo del fútbol de manera divertida y educativa.",
    imageSrc: "/Iniciacion.webp",
    benefits: [
      "Beneficios específicos de esta categoría",
      "Desarrollo de habilidades motoras básicas",
      "Introducción a las reglas del fútbol",
      "Fomento del trabajo en equipo",
      "Tecnología aplicada al futbol"
    ],
  },
  {
    id: "preinfantil",
    title: "Pre Infantil",
    ageRange: "10 a 11 años",
    description: "Etapa de desarrollo técnico donde los niños comienzan a perfeccionar sus habilidades futbolísticas.",
    imageSrc: "/pre-infantil.webp",
    benefits: [
      "Perfeccionamiento de técnicas básicas",
      "Introducción a conceptos tácticos",
      "Desarrollo de coordinación",
      "Partidos formativos",
    ],
  },
  {
    id: "infantil",
    title: "Infantil",
    ageRange: "12 a 13 años",
    description: "Programa que profundiza en aspectos técnicos y tácticos del fútbol.",
    imageSrc: "/infantil.webp",
    benefits: [
      "Entrenamiento técnico avanzado",
      "Comprensión táctica del juego",
      "Preparación física específica",
      "Desarrollo de habilidades especiales",
    ],
  },
  {
    id: "prejuvenil-femenino",
    title: "Pre Juvenil Femenino",
    ageRange: "14 a 15 años",
    description: "Programa especializado para chicas que busca potenciar sus habilidades futbolísticas.",
    imageSrc: "/pre-juvenil-femenino.webp",
    benefits: [
      "Entrenamiento adaptado al fútbol femenino",
      "Desarrollo técnico-táctico avanzado",
      "Preparación física específica",
      "Competencias formativas",
    ],
  },
  {
    id: "prejuvenil-masculino",
    title: "Pre Juvenil Masculino",
    ageRange: "14 a 15 años",
    description: "Etapa de especialización donde los jóvenes desarrollan aspectos técnicos avanzados.",
    imageSrc: "/pre-juvenil-masculino.webp",
    benefits: [
      "Técnicas avanzadas de juego",
      "Sistemas tácticos complejos",
      "Preparación física específica",
      "Desarrollo de liderazgo",
    ],
  },
  {
    id: "juvenil-femenino",
    title: "Juvenil Femenino",
    ageRange: "16 a 17 años",
    description: "Programa de alto rendimiento para jugadoras que buscan perfeccionar sus habilidades.",
    imageSrc: "/juvenil-femenino.webp",
    benefits: [
      "Entrenamiento de alto rendimiento",
      "Táctica avanzada de juego",
      "Preparación física especializada",
      "Desarrollo de proyección deportiva",
    ],
  },
  {
    id: "juvenil-masculino",
    title: "Juvenil Masculino",
    ageRange: "16 a 17 años",
    description:
      "Programa de alto nivel para jóvenes futbolistas que buscan perfeccionar todos los aspectos del juego.",
    imageSrc: "/juvenil-masculino.webp",
    benefits: [
      "Entrenamiento de élite",
      "Sistemas tácticos profesionales",
      "Preparación física de alto rendimiento",
      "Proyección hacia el fútbol competitivo",
    ],
  },
]

export function CategoriesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[0] | null>(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")

  const handleCategoryClick = (category: (typeof categories)[0]) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openRegistrationModal = (city: string) => {
    setSelectedCity(city)
    setIsRegistrationModalOpen(true)
  }

  return (
    <section id="categorias" className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-lg text-sm mb-4 transform rotate-2">
            ¡ENCUENTRA TU LUGAR!
          </div>
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-4 text-blue-600">
            RESERVA TU <span className="text-red-500">CUPO AHORA</span>
          </h2>
          <p className="text-center text-xl mb-6 text-gray-600 max-w-3xl mx-auto">
            Selecciona la sede perfecta para tu campeón
          </p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Valor del Camps por semana en Barranquilla y Bogotá
              </h3>
              <div className="inline-block bg-blue-500/30 rounded-xl px-8 py-4 mb-4">
                <p className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-2">
                  $1.690.000 + IVA
                </p>
                <p className="text-sm md:text-base text-blue-100 italic">
                  (Este precio es válido únicamente por una semana)
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sedes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group h-full"
            whileHover={{
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={() => openRegistrationModal("Bogotá")}
          >
            <div className="relative h-80">
              <Image
                src="/sede-bogota.webp"
                alt="Sede Bogotá"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-3xl font-bold text-white mb-3">Sede Bogotá</h3>
                <p className="text-blue-100 mb-4">Sede Deportiva FCF - Bogotá</p>
                <button className="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg">
                  RESERVA AHORA
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group h-full"
            whileHover={{
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={() => openRegistrationModal("Barranquilla")}
          >
            <div className="relative h-80">
              <Image
                src="/sede-barranquilla.webp"
                alt="Sede Barranquilla"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-3xl font-bold text-white mb-3">Sede Barranquilla</h3>
                <p className="text-blue-100 mb-4">Sede Deportiva FCF - Barranquilla</p>
                <button className="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg">
                  RESERVA AHORA
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categorías */}
        <h3 className="text-center text-2xl md:text-3xl font-bold mb-8 text-blue-600">
          NUESTRAS <span className="text-red-500">CATEGORÍAS</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer h-full"
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="relative h-48">
                <Image
                  src={category.imageSrc || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{category.title}</h3>
                  <div className="flex items-center gap-2 text-yellow-300">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        category.id === "iniciacion"
                          ? "bg-white border border-gray-300"
                          : category.id === "preinfantil"
                            ? "bg-black"
                            : category.id === "infantil"
                              ? "bg-blue-700"
                              : category.id === "prejuvenil-masculino"
                                ? "bg-green-600"
                                : category.id === "prejuvenil-femenino"
                                  ? "bg-red-600"
                                  : category.id === "juvenil-masculino"
                                    ? "bg-blue-900"
                                    : category.id === "juvenil-femenino"
                                      ? "bg-sky-400"
                                      : ""
                      }`}
                    ></div>
                    <Users className="h-4 w-4" />
                    <p className="text-sm">{category.ageRange}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 text-center">
                <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Ver detalles
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal para detalles de categoría */}
      <CategoryModal isOpen={isModalOpen} onClose={closeModal} category={selectedCategory} />

      {/* Modal de pre-inscripción */}
      <PreRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        city={selectedCity}
        availableDates={
          selectedCity === "Bogotá"
            ? ["16 AL 21 JUNIO - SEMANA 1", "23 AL 28 JUNIO - SEMANA 2", "14 AL 19 JULIO - SEMANA 3"]
            : ["23 AL 28 JUNIO - SEMANA 1", "30 JUNIO AL 5 JULIO - SEMANA 2"]
        }
      />
    </section>
  )
}

