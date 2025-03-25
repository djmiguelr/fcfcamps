"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Info, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface CategoryCardProps {
  title: string
  ageRange: string
  imageSrc: string
  onViewDetails: () => void
  selectedCity: string
  selectedDate: string
}

export function CategoryCard({
  title,
  ageRange,
  imageSrc,
  onViewDetails,
  selectedCity,
  selectedDate,
}: CategoryCardProps) {
  const router = useRouter()

  const handleReserveClick = () => {
    // Store selected data in localStorage
    const selectionData = {
      city: selectedCity,
      campDate: selectedDate,
      category: title,
    }

    localStorage.setItem("fcfCampsSelection", JSON.stringify(selectionData))

    // Navigate to checkout
    router.push("/checkout")
  }

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg group h-full flex flex-col"
      whileHover={{
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg?height=300&width=500"}
          alt={`Categoría ${title}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <p className="text-blue-800 font-medium">{ageRange}</p>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Info size={18} />
            <span>VER DETALLES</span>
          </Button>

          <Button
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 text-blue-900 font-bold py-3 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
            variant="default"
            onClick={handleReserveClick}
          >
            RESERVAR CUPO
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

