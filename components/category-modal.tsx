"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Utensils, Shirt, Shield, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryCheckoutModal } from "@/components/category-checkout-modal"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    title: string
    ageRange: string
    description: string
    imageSrc: string
    benefits?: string[]
  } | null
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (isOpen) {
      // Prevenir scroll cuando el modal está abierto
      document.body.style.overflow = "hidden"
    }

    return () => {
      // Restaurar scroll cuando el componente se desmonta
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleReserveClick = () => {
    // Cerrar el modal actual y abrir el modal de Inscripción
    onClose()
    setIsCheckoutModalOpen(true)
  }

  // No renderizar nada en el servidor
  if (!isMounted) return null

  // Asegurar que el componente maneje correctamente el caso cuando category es null
  if (!category) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative h-56 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${category.imageSrc})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full ${
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
                    <h2 className="text-4xl font-bold text-white">{category.title}</h2>
                  </div>
                  <p className="text-yellow-300 font-medium text-xl">{category.ageRange}</p>
                </div>

                {/* Asegurar que el botón de cierre tenga el evento onClick correcto */}
                <button
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition-colors"
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                <p className="text-gray-700 text-lg mb-6">{category.description}</p>



                <h3 className="text-xl font-bold text-blue-800 mb-4">BENEFICIOS INCLUIDOS</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Utensils className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1">Alimentación</h4>
                        <p className="text-sm text-gray-600">
                          Refrigerios, almuerzo e hidratación durante todo el campamento.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shirt className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1">Indumentaria</h4>
                        <p className="text-sm text-gray-600">
                          2 uniformes completos (camisetas, pantalonetas y medias).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1">Seguridad</h4>
                        <p className="text-sm text-gray-600">Póliza de accidentes personales durante el campamento.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-800 mb-1">Familia</h4>
                        <p className="text-sm text-gray-600">
                          Actividades especiales para padres el jueves de cada CAMPS.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beneficios específicos de la categoría */}
                {category.benefits && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-yellow-800 mb-3">Beneficios específicos de esta categoría</h4>
                    <ul className="space-y-2">
                      {category.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="bg-yellow-200 p-1 rounded-full mt-0.5">
                            <Check className="h-3 w-3 text-yellow-700" />
                          </div>
                          <span className="text-sm text-yellow-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex justify-end items-center">
                  <Button
                    className="bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold py-2 px-6 rounded-lg shadow-lg"
                    onClick={handleReserveClick}
                  >
                    RESERVAR AHORA
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Inscripción para la categoría */}
      {category && (
        <CategoryCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          category={category}
        />
      )}
    </>
  )
}

