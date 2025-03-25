"use client"

import { useState, useEffect } from "react"
import { TestimonialCard } from "@/components/testimonial-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "Mi hijo mejoró notablemente sus habilidades y regresó con más confianza. ¡Volveremos el próximo año!",
    author: "Ana Martínez",
    role: "Madre de Carlos, 9 años",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Excelente organización y entrenadores de primer nivel. Mi hijo no para de hablar sobre lo divertido que fue.",
    author: "Juan Rodríguez",
    role: "Padre de Miguel, 11 años",
    rating: 5,
  },
  {
    id: 3,
    quote: "No solo aprendió fútbol, sino valores importantes como el trabajo en equipo y la disciplina.",
    author: "Carolina Gómez",
    role: "Madre de Santiago, 10 años",
    rating: 5,
  },
  {
    id: 4,
    quote: "Los entrenadores son excelentes, muy profesionales y pacientes con los niños. Mi hijo aprendió muchísimo.",
    author: "Roberto Sánchez",
    role: "Padre de Daniel, 8 años",
    rating: 5,
  },
  {
    id: 5,
    quote: "Una experiencia inolvidable para mi hija. Hizo nuevos amigos y mejoró su técnica. Totalmente recomendado.",
    author: "María Jiménez",
    role: "Madre de Valeria, 10 años",
    rating: 5,
  },
  {
    id: 6,
    quote: "El campamento superó nuestras expectativas. Instalaciones de primera y un equipo humano excepcional.",
    author: "Pedro Morales",
    role: "Padre de Sebastián, 12 años",
    rating: 5,
  },
]

export function TestimonialSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Calcular cuántos testimonios mostrar por slide según el ancho de pantalla
  const [itemsPerSlide, setItemsPerSlide] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2)
      } else {
        setItemsPerSlide(3)
      }
    }

    // Establecer el valor inicial
    handleResize()

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Autoplay
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide, autoplay, itemsPerSlide])

  // Calcular el número total de slides
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Pausar autoplay cuando el usuario interactúa con los controles
  const handleUserInteraction = (callback: () => void) => {
    setAutoplay(false)
    callback()
    // Reanudar autoplay después de 10 segundos de inactividad
    setTimeout(() => setAutoplay(true), 10000)
  }

  // Obtener los testimonios para el slide actual
  const currentTestimonials = testimonials.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide,
  )

  return (
    <div className="relative">
      {/* Controles de navegación */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:-translate-x-6 lg:-translate-x-8"
        onClick={() => handleUserInteraction(prevSlide)}
        aria-label="Testimonio anterior"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:translate-x-6 lg:translate-x-8"
        onClick={() => handleUserInteraction(nextSlide)}
        aria-label="Testimonio siguiente"
      >
        <ChevronRight size={24} />
      </button>

      {/* Testimonios */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="flex flex-nowrap min-w-full gap-8">
              {testimonials
                .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                .map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className={`flex-1 min-w-0 ${itemsPerSlide === 1 ? "w-full" : itemsPerSlide === 2 ? "w-1/2" : "w-1/3"}`}
                  >
                    <TestimonialCard
                      quote={testimonial.quote}
                      author={testimonial.author}
                      role={testimonial.role}
                      rating={testimonial.rating}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-blue-600" : "bg-blue-300"
            }`}
            onClick={() => handleUserInteraction(() => goToSlide(index))}
            aria-label={`Ir al testimonio ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

