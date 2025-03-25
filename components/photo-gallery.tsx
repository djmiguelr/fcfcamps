"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Simular 20 fotos para la galería
const generatePhotos = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    src: `/placeholder.svg?height=300&width=400&text=Foto ${i + 1}`,
    alt: `Experiencia FCF Camps ${i + 1}`,
    year: 2024 - Math.floor(i / 4),
    description: `Momentos llenos de diversión y aprendizaje en el campamento ${2024 - Math.floor(i / 4)}`,
  }))
}

export function PhotoGallery() {
  const allPhotos = generatePhotos(20)
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const visiblePhotos = allPhotos.slice(0, visibleCount)

  const loadMorePhotos = () => {
    // Cargar 3 más (una fila) cada vez, hasta el máximo
    const newCount = Math.min(visibleCount + 3, allPhotos.length)
    setVisibleCount(newCount)
  }

  const openLightbox = (photoId: number) => {
    setSelectedPhoto(photoId)
    // Prevenir scroll cuando el lightbox está abierto
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
    // Restaurar scroll
    document.body.style.overflow = "auto"
  }

  const nextPhoto = () => {
    if (selectedPhoto === null) return
    const nextId = selectedPhoto === allPhotos.length - 1 ? 0 : selectedPhoto + 1
    setSelectedPhoto(nextId)
  }

  const prevPhoto = () => {
    if (selectedPhoto === null) return
    const prevId = selectedPhoto === 0 ? allPhotos.length - 1 : selectedPhoto - 1
    setSelectedPhoto(prevId)
  }

  // Manejar teclas para navegación en el lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextPhoto()
    if (e.key === "ArrowLeft") prevPhoto()
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-rotate-1 cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              width={400}
              height={300}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 text-white">
                <h3 className="font-bold text-lg">Campamento {photo.year}</h3>
                <p className="text-sm text-blue-100">{photo.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < allPhotos.length && (
        <div className="text-center mt-12">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-8 py-2 transform hover:scale-110 transition-all duration-300"
            onClick={loadMorePhotos}
          >
            Ver más fotos
          </Button>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <div className="relative">
              <Image
                src={allPhotos[selectedPhoto].src || "/placeholder.svg"}
                alt={allPhotos[selectedPhoto].alt}
                width={800}
                height={600}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 rounded-b-lg">
                <h3 className="font-bold text-lg text-white">Campamento {allPhotos[selectedPhoto].year}</h3>
                <p className="text-sm text-gray-300">{allPhotos[selectedPhoto].description}</p>
              </div>

              {/* Navegación */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  prevPhoto()
                }}
              >
                &#10094;
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  nextPhoto()
                }}
              >
                &#10095;
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <p className="text-white bg-black/50 px-4 py-2 rounded-full">
                {selectedPhoto + 1} / {allPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

