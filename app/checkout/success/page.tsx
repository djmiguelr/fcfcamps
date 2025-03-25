"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Check, Download, ArrowLeft, AlertCircle, ChevronDown, ChevronUp, Printer } from "lucide-react"
import { z } from "zod"
import { SiteFooter } from "@/components/site-footer"

// Fechas disponibles por ciudad
const campDates = {
  bogota: [
    { id: "bog-1", label: "16 al 21 junio, 2025" },
    { id: "bog-2", label: "23 al 28 junio, 2025" },
    { id: "bog-3", label: "14 al 19 julio, 2025" },
    { id: "bog-4", label: "21 al 27 julio, 2025" },
  ],
  barranquilla: [
    { id: "bar-1", label: "16 al 21 junio, 2025" },
    { id: "bar-2", label: "23 al 28 junio, 2025" },
    { id: "bar-3", label: "30 junio al 5 julio, 2025" },
  ],
}

// Categorías por edad
const categories = [
  { id: "iniciacion", title: "Iniciación", ageRange: "6 a 9 años" },
  { id: "preinfantil", title: "Pre Infantil", ageRange: "10 a 11 años" },
  { id: "infantil", title: "Infantil", ageRange: "12 a 13 años" },
  { id: "prejuvenil-femenino", title: "Pre Juvenil Femenino", ageRange: "14 a 15 años" },
  { id: "prejuvenil-masculino", title: "Pre Juvenil Masculino", ageRange: "14 a 15 años" },
  { id: "juvenil-femenino", title: "Juvenil Femenino", ageRange: "16 a 17 años" },
  { id: "juvenil-masculino", title: "Juvenil Masculino", ageRange: "16 a 17 años" },
]

// Esquemas de validación con Zod
const phoneSchema = z
  .string()
  .min(7, "Número de teléfono inválido")
  .max(15, "Número demasiado largo")
  .regex(/^\+?[0-9]+$/, "Solo se permiten números y el símbolo +")
const nameSchema = z
  .string()
  .min(3, "Nombre demasiado corto")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras y espacios")
const numberSchema = z
  .string()
  .regex(/^[0-9]+$/, "Solo se permiten números")
  .optional()
const heightSchema = z
  .string()
  .regex(/^[0-9]{2,3}$/, "Formato inválido. Ejemplo: 170")
  .optional()
const weightSchema = z
  .string()
  .regex(/^[0-9]{1,3}(\.[0-9]{1,2})?$/, "Formato inválido. Ejemplo: 65.5")
  .optional()

// Tipo para errores de validación
type ValidationErrors = {
  [key: string]: string | null
}

export default function SuccessPage() {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    // Información médica
    eps: "",
    medicinaPrepagada: false,
    medicinaPrepagadaNombre: "",
    usaLentes: false,
    tipoSangre: "",
    factorRh: "",
    estatura: "",
    peso: "",
    horarioMedicamentos: "",
    alergiaMedicamentos: false,
    alergiaMedicamentosDetalle: "",
    alergiaAlimentos: false,
    alergiaAlimentosDetalle: "",
    intoleranciaAlimentos: false,
    intoleranciaAlimentosDetalle: "",
    vegetariano: false,
    vegano: false,
    frecuenciaDeporte: "",
    preexistenciasMedicas: "",

    // Información deportiva
    otrosCampamentos: false,
    otrosCampamentosDetalle: "",
    equipoFederado: false,
    equipoFederadoDetalle: "",
    posicionJuego: "",

    // Información de uniforme
    tallaUniforme: "",
    envioUniforme: false,
    direccionEnvio: "",
    ciudadEnvio: "",

    // Información para chats
    persona1Parentesco: "",
    persona1Telefono: "",
    persona2Parentesco: "",
    persona2Telefono: "",

    // Términos
    aceptaTerminos: false,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    medica: true,
    deportiva: false,
    uniforme: false,
    chat: false,
  })

  // Cargar datos del participante del localStorage
  const [participantData, setParticipantData] = useState<any>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [allFormData, setAllFormData] = useState<any>(null)

  useEffect(() => {
    const savedData = localStorage.getItem("fcfCampsFormData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setParticipantData(parsedData)

      // Si ya hay datos adicionales guardados, mostrar directamente el resumen
      const additionalData = localStorage.getItem("fcfCampsAdditionalData")
      if (additionalData) {
        setAllFormData({
          ...parsedData,
          additionalInfo: JSON.parse(additionalData),
        })
        setShowSummary(true)
      }
    }
  }, [])

  // Auto-scroll cuando se expande una sección
  useEffect(() => {
    if (formContainerRef.current) {
      window.scrollTo({
        top: formContainerRef.current.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }, [isSubmitted, showSummary])

  // Actualizar datos del formulario
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar error cuando se actualiza un campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    let isValid = true
    const newErrors: ValidationErrors = {}

    // Validar campos obligatorios
    if (!formData.eps) {
      newErrors.eps = "Este campo es obligatorio"
      isValid = false
    }

    if (formData.medicinaPrepagada && !formData.medicinaPrepagadaNombre) {
      newErrors.medicinaPrepagadaNombre = "Indique el nombre de la medicina prepagada"
      isValid = false
    }

    if (!formData.tipoSangre) {
      newErrors.tipoSangre = "Este campo es obligatorio"
      isValid = false
    }

    if (!formData.factorRh) {
      newErrors.factorRh = "Este campo es obligatorio"
      isValid = false
    }

    // Validar campos numéricos
    if (formData.estatura) {
      try {
        heightSchema.parse(formData.estatura)
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.estatura = error.errors[0].message
          isValid = false
        }
      }
    }

    if (formData.peso) {
      try {
        weightSchema.parse(formData.peso)
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.peso = error.errors[0].message
          isValid = false
        }
      }
    }

    // Validar campos condicionales
    if (formData.alergiaMedicamentos && !formData.alergiaMedicamentosDetalle) {
      newErrors.alergiaMedicamentosDetalle = "Especifique los medicamentos"
      isValid = false
    }

    if (formData.alergiaAlimentos && !formData.alergiaAlimentosDetalle) {
      newErrors.alergiaAlimentosDetalle = "Especifique los alimentos"
      isValid = false
    }

    if (formData.intoleranciaAlimentos && !formData.intoleranciaAlimentosDetalle) {
      newErrors.intoleranciaAlimentosDetalle = "Especifique los alimentos"
      isValid = false
    }

    if (!formData.frecuenciaDeporte) {
      newErrors.frecuenciaDeporte = "Este campo es obligatorio"
      isValid = false
    }

    // Validar información deportiva
    if (formData.otrosCampamentos && !formData.otrosCampamentosDetalle) {
      newErrors.otrosCampamentosDetalle = "Especifique cuál"
      isValid = false
    }

    if (formData.equipoFederado && !formData.equipoFederadoDetalle) {
      newErrors.equipoFederadoDetalle = "Especifique cuál"
      isValid = false
    }

    if (!formData.posicionJuego) {
      newErrors.posicionJuego = "Este campo es obligatorio"
      isValid = false
    }

    // Validar información de uniforme
    if (!formData.tallaUniforme) {
      newErrors.tallaUniforme = "Este campo es obligatorio"
      isValid = false
    }

    if (formData.envioUniforme) {
      if (!formData.direccionEnvio) {
        newErrors.direccionEnvio = "Este campo es obligatorio"
        isValid = false
      }

      if (!formData.ciudadEnvio) {
        newErrors.ciudadEnvio = "Este campo es obligatorio"
        isValid = false
      }
    }

    // Validar información para chats
    if (!formData.persona1Parentesco) {
      newErrors.persona1Parentesco = "Este campo es obligatorio"
      isValid = false
    }

    try {
      phoneSchema.parse(formData.persona1Telefono)
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.persona1Telefono = error.errors[0].message
        isValid = false
      }
    }

    if (formData.persona2Parentesco && !formData.persona2Telefono) {
      newErrors.persona2Telefono = "Ingrese el número de teléfono"
      isValid = false
    }

    if (formData.persona2Telefono) {
      try {
        phoneSchema.parse(formData.persona2Telefono)
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.persona2Telefono = error.errors[0].message
          isValid = false
        }
      }
    }

    // Validar términos
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = "Debes aceptar los términos y condiciones"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Expandir secciones con errores
      const newExpandedSections = { ...expandedSections }

      // Verificar errores en cada sección
      const hasMedicalErrors = Object.keys(errors).some((key) =>
        [
          "eps",
          "medicinaPrepagadaNombre",
          "tipoSangre",
          "factorRh",
          "estatura",
          "peso",
          "alergiaMedicamentosDetalle",
          "alergiaAlimentosDetalle",
          "intoleranciaAlimentosDetalle",
          "frecuenciaDeporte",
          "preexistenciasMedicas",
        ].includes(key),
      )

      const hasSportsErrors = Object.keys(errors).some((key) =>
        ["otrosCampamentosDetalle", "equipoFederadoDetalle", "posicionJuego"].includes(key),
      )

      const hasUniformErrors = Object.keys(errors).some((key) =>
        ["tallaUniforme", "direccionEnvio", "ciudadEnvio"].includes(key),
      )

      const hasChatErrors = Object.keys(errors).some((key) =>
        ["persona1Parentesco", "persona1Telefono", "persona2Parentesco", "persona2Telefono"].includes(key),
      )

      if (hasMedicalErrors) newExpandedSections.medica = true
      if (hasSportsErrors) newExpandedSections.deportiva = true
      if (hasUniformErrors) newExpandedSections.uniforme = true
      if (hasChatErrors) newExpandedSections.chat = true

      setExpandedSections(newExpandedSections)
      return
    }

    setIsSubmitting(true)

    // Guardar datos adicionales en localStorage
    localStorage.setItem("fcfCampsAdditionalData", JSON.stringify(formData))

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Combinar todos los datos para mostrar el resumen
      if (participantData) {
        setAllFormData({
          ...participantData,
          additionalInfo: formData,
        })
        setShowSummary(true)
      }
    }, 1500)
  }

  // Renderizar mensaje de error
  const renderError = (field: string) => {
    if (errors[field]) {
      return (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errors[field]}
        </p>
      )
    }
    return null
  }

  // Alternar sección expandida
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  // Función para imprimir el resumen
  const handlePrint = () => {
    window.print()
  }

  // Si se debe mostrar el resumen de todos los datos
  if (showSummary && allFormData) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header con logo */}
              <header className="flex justify-between items-center mb-8 print:mb-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors print:hidden"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la página principal
                </Link>

                <Link href="/" className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=60&width=180&text=FCF+CAMPS"
                    alt="FCF Camps Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto"
                  />
                </Link>
              </header>

              <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none" ref={formContainerRef}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 print:mb-2">
                  <Check className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center print:text-2xl">
                  ¡Registro Completado!
                </h1>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-center print:mb-4 print:text-sm">
                  Hemos recibido toda la información necesaria para el FCF Camps 2025. A continuación encontrarás un
                  resumen de todos los datos proporcionados.
                </p>

                <div className="print:hidden mb-6 flex justify-end">
                  <Button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Printer className="h-4 w-4" />
                    Imprimir resumen
                  </Button>
                </div>

                {/* Resumen de datos */}
                <div className="space-y-8 print:space-y-4">
                  {/* Información básica */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-blue-800 mb-4 print:text-lg print:mb-2">
                      Información básica
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <p className="text-gray-500 text-sm">Nombre del participante</p>
                        <p className="font-medium">
                          {allFormData.childName} {allFormData.childLastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Fecha de nacimiento</p>
                        <p className="font-medium">{allFormData.childBirthDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Documento</p>
                        <p className="font-medium">
                          {allFormData.childDocType}: {allFormData.childDocNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Lugar de nacimiento</p>
                        <p className="font-medium">
                          {allFormData.childBirthCity}, {allFormData.childBirthCountry}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del campamento */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4 print:text-lg print:mb-2">
                      Información del campamento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <p className="text-gray-500 text-sm">Ciudad</p>
                        <p className="font-medium">{allFormData.city === "bogota" ? "Bogotá" : "Barranquilla"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Fecha</p>
                        <p className="font-medium">
                          {allFormData.city &&
                            allFormData.campDate &&
                            campDates[allFormData.city as keyof typeof campDates].find(
                              (date) => date.id === allFormData.campDate,
                            )?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Categoría</p>
                        <p className="font-medium">
                          {categories.find((cat) => cat.id === allFormData.category)?.title} (
                          {categories.find((cat) => cat.id === allFormData.category)?.ageRange})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Valor pagado</p>
                        <p className="font-medium">$2.011.100 (IVA incluido)</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de residencia */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-blue-800 mb-4 print:text-lg print:mb-2">
                      Información de residencia
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-sm">Dirección</p>
                        <p className="font-medium">{allFormData.address}</p>
                      </div>
                      {allFormData.neighborhood && (
                        <div>
                          <p className="text-gray-500 text-sm">Barrio</p>
                          <p className="font-medium">{allFormData.neighborhood}</p>
                        </div>
                      )}
                      {allFormData.apartment && (
                        <div>
                          <p className="text-gray-500 text-sm">Apartamento/Conjunto</p>
                          <p className="font-medium">{allFormData.apartment}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-sm">Ciudad</p>
                        <p className="font-medium">{allFormData.residenceCity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">País</p>
                        <p className="font-medium">{allFormData.residenceCountry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información familiar */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-green-800 mb-4 print:text-lg print:mb-2">
                      Información familiar
                    </h2>

                    <div className="mb-4 print:mb-2">
                      <h3 className="font-bold text-green-700 mb-2 print:mb-1">Madre</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                        <div className="md:col-span-3">
                          <p className="text-gray-500 text-sm">Nombre</p>
                          <p className="font-medium">{allFormData.motherName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Teléfono</p>
                          <p className="font-medium">{allFormData.motherPhone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="font-medium">{allFormData.motherEmail}</p>
                        </div>
                      </div>
                    </div>

                    {allFormData.fatherName && (
                      <div className="mb-4 print:mb-2">
                        <h3 className="font-bold text-green-700 mb-2 print:mb-1">Padre</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                          <div className="md:col-span-3">
                            <p className="text-gray-500 text-sm">Nombre</p>
                            <p className="font-medium">{allFormData.fatherName}</p>
                          </div>
                          {allFormData.fatherPhone && (
                            <div>
                              <p className="text-gray-500 text-sm">Teléfono</p>
                              <p className="font-medium">{allFormData.fatherPhone}</p>
                            </div>
                          )}
                          {allFormData.fatherEmail && (
                            <div className="md:col-span-2">
                              <p className="text-gray-500 text-sm">Email</p>
                              <p className="font-medium">{allFormData.fatherEmail}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-green-700 mb-2 print:mb-1">Contacto de emergencia</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
                        <div className="md:col-span-3">
                          <p className="text-gray-500 text-sm">Nombre</p>
                          <p className="font-medium">{allFormData.emergencyName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Parentesco</p>
                          <p className="font-medium">{allFormData.emergencyRelationship}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Teléfono</p>
                          <p className="font-medium">{allFormData.emergencyPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información médica */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-red-800 mb-4 print:text-lg print:mb-2">Información médica</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <p className="text-gray-500 text-sm">EPS</p>
                        <p className="font-medium">{allFormData.additionalInfo.eps}</p>
                      </div>

                      {allFormData.additionalInfo.medicinaPrepagada && (
                        <div>
                          <p className="text-gray-500 text-sm">Medicina prepagada</p>
                          <p className="font-medium">{allFormData.additionalInfo.medicinaPrepagadaNombre}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-500 text-sm">Tipo de sangre</p>
                        <p className="font-medium">
                          {allFormData.additionalInfo.tipoSangre}{" "}
                          {allFormData.additionalInfo.factorRh === "positivo" ? "+" : "-"}
                        </p>
                      </div>

                      {allFormData.additionalInfo.usaLentes && (
                        <div>
                          <p className="text-gray-500 text-sm">Usa lentes</p>
                          <p className="font-medium">Sí</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.estatura && (
                        <div>
                          <p className="text-gray-500 text-sm">Estatura</p>
                          <p className="font-medium">{allFormData.additionalInfo.estatura} cm</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.peso && (
                        <div>
                          <p className="text-gray-500 text-sm">Peso</p>
                          <p className="font-medium">{allFormData.additionalInfo.peso} kg</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.horarioMedicamentos && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Horario de medicamentos</p>
                          <p className="font-medium">{allFormData.additionalInfo.horarioMedicamentos}</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.alergiaMedicamentos && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Alergia a medicamentos</p>
                          <p className="font-medium">{allFormData.additionalInfo.alergiaMedicamentosDetalle}</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.alergiaAlimentos && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Alergia a alimentos</p>
                          <p className="font-medium">{allFormData.additionalInfo.alergiaAlimentosDetalle}</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.intoleranciaAlimentos && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Intolerancia a alimentos</p>
                          <p className="font-medium">{allFormData.additionalInfo.intoleranciaAlimentosDetalle}</p>
                        </div>
                      )}

                      {(allFormData.additionalInfo.vegetariano || allFormData.additionalInfo.vegano) && (
                        <div>
                          <p className="text-gray-500 text-sm">Dieta especial</p>
                          <p className="font-medium">
                            {allFormData.additionalInfo.vegetariano && "Vegetariano"}
                            {allFormData.additionalInfo.vegetariano && allFormData.additionalInfo.vegano && " y "}
                            {allFormData.additionalInfo.vegano && "Vegano"}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-500 text-sm">Frecuencia de deporte</p>
                        <p className="font-medium">
                          {allFormData.additionalInfo.frecuenciaDeporte === "0" && "Ningún día"}
                          {allFormData.additionalInfo.frecuenciaDeporte === "1-2" && "1-2 días por semana"}
                          {allFormData.additionalInfo.frecuenciaDeporte === "3-4" && "3-4 días por semana"}
                          {allFormData.additionalInfo.frecuenciaDeporte === "5-6" && "5-6 días por semana"}
                          {allFormData.additionalInfo.frecuenciaDeporte === "7" && "Todos los días"}
                        </p>
                      </div>

                      {allFormData.additionalInfo.preexistenciasMedicas && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500 text-sm">Preexistencias médicas</p>
                          <p className="font-medium">{allFormData.additionalInfo.preexistenciasMedicas}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información deportiva */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-blue-800 mb-4 print:text-lg print:mb-2">
                      Información deportiva
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <p className="text-gray-500 text-sm">Posición de juego</p>
                        <p className="font-medium">
                          {allFormData.additionalInfo.posicionJuego === "portero" && "Portero"}
                          {allFormData.additionalInfo.posicionJuego === "defensa" && "Defensa"}
                          {allFormData.additionalInfo.posicionJuego === "mediocampista" && "Mediocampista"}
                          {allFormData.additionalInfo.posicionJuego === "delantero" && "Delantero"}
                        </p>
                      </div>

                      {allFormData.additionalInfo.otrosCampamentos && (
                        <div>
                          <p className="text-gray-500 text-sm">Otros campamentos</p>
                          <p className="font-medium">{allFormData.additionalInfo.otrosCampamentosDetalle}</p>
                        </div>
                      )}

                      {allFormData.additionalInfo.equipoFederado && (
                        <div>
                          <p className="text-gray-500 text-sm">Equipo federado</p>
                          <p className="font-medium">{allFormData.additionalInfo.equipoFederadoDetalle}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información de uniforme */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-purple-800 mb-4 print:text-lg print:mb-2">
                      Información de uniforme
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                      <div>
                        <p className="text-gray-500 text-sm">Talla de uniforme</p>
                        <p className="font-medium">{allFormData.additionalInfo.tallaUniforme}</p>
                      </div>

                      {allFormData.additionalInfo.envioUniforme && (
                        <>
                          <div className="md:col-span-2">
                            <p className="text-gray-500 text-sm">Dirección de envío</p>
                            <p className="font-medium">{allFormData.additionalInfo.direccionEnvio}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Ciudad de envío</p>
                            <p className="font-medium">{allFormData.additionalInfo.ciudadEnvio}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Información para chats */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 print:p-4 print:text-sm">
                    <h2 className="text-xl font-bold text-green-800 mb-4 print:text-lg print:mb-2">
                      Contactos para grupos de chat
                    </h2>
                    <div className="space-y-4 print:space-y-2">
                      <div>
                        <h3 className="font-bold text-green-700 mb-2 print:mb-1">Contacto 1</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                          <div>
                            <p className="text-gray-500 text-sm">Parentesco</p>
                            <p className="font-medium">{allFormData.additionalInfo.persona1Parentesco}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm">Teléfono</p>
                            <p className="font-medium">{allFormData.additionalInfo.persona1Telefono}</p>
                          </div>
                        </div>
                      </div>

                      {allFormData.additionalInfo.persona2Parentesco && (
                        <div>
                          <h3 className="font-bold text-green-700 mb-2 print:mb-1">Contacto 2</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
                            <div>
                              <p className="text-gray-500 text-sm">Parentesco</p>
                              <p className="font-medium">{allFormData.additionalInfo.persona2Parentesco}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Teléfono</p>
                              <p className="font-medium">{allFormData.additionalInfo.persona2Telefono}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 print:mt-4 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                  <Link href="/">
                    <Button variant="outline" className="px-6">
                      Volver al inicio
                    </Button>
                  </Link>
                  <Button className="bg-blue-600 hover:bg-blue-700 px-6 flex items-center gap-2" onClick={handlePrint}>
                    <Download className="h-4 w-4" />
                    Descargar comprobante
                  </Button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 print:mt-4">
                  <p>
                    Código de inscripción: FCF-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                    -{new Date().getFullYear()}
                  </p>
                  <p className="mt-1">Fecha de inscripción: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </>
    )
  }

  // Si el formulario ya fue enviado, mostrar mensaje de éxito
  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Header con logo */}
              <header className="flex justify-between items-center mb-8">
                <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la página principal
                </Link>

                <Link href="/" className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=60&width=180&text=FCF+CAMPS"
                    alt="FCF Camps Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto"
                  />
                </Link>
              </header>

              <div className="bg-white rounded-2xl shadow-xl p-8 text-center" ref={formContainerRef}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-blue-800 mb-4">¡Registro Completado!</h1>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  Hemos recibido toda la información necesaria para el FCF Camps 2025. Estamos emocionados de contar con
                  tu participación.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Próximos pasos:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Recibirás un correo de confirmación con todos los detalles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>El kit deportivo se entregará según la opción seleccionada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>Te contactaremos para incluirte en los grupos de WhatsApp</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button variant="outline" className="px-6">
                      Volver al inicio
                    </Button>
                  </Link>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 px-6 flex items-center gap-2"
                    onClick={() => setShowSummary(true)}
                  >
                    <Download className="h-4 w-4" />
                    Ver resumen completo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header con logo */}
            <header className="flex justify-between items-center mb-8">
              <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la página principal
              </Link>

              <Link href="/" className="flex items-center">
                <Image
                  src="/placeholder.svg?height=60&width=180&text=FCF+CAMPS"
                  alt="FCF Camps Logo"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
            </header>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8" ref={formContainerRef}>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">¡Inscripción Exitosa!</h1>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-center">
                Hemos recibido tu pago y confirmado la inscripción al FCF Camps 2025. Para completar el proceso,
                necesitamos algunos datos adicionales.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-800">Información importante</h4>
                    <p className="text-yellow-700 text-sm">
                      Para brindarte la mejor experiencia, necesitamos información médica, deportiva y de uniforme. Por
                      favor completa todos los campos a continuación.
                    </p>
                  </div>
                </div>
              </div>

              {participantData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-blue-800 mb-2">Información del participante</h3>
                  <p className="text-gray-700">
                    <span className="font-medium">Nombre:</span> {participantData.childName}{" "}
                    {participantData.childLastName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Categoría:</span>{" "}
                    {categories.find((cat) => cat.id === participantData.category)?.title}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Ciudad:</span>{" "}
                    {participantData.city === "bogota" ? "Bogotá" : "Barranquilla"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Fecha:</span>{" "}
                    {participantData.city &&
                      participantData.campDate &&
                      campDates[participantData.city as keyof typeof campDates].find(
                        (date) => date.id === participantData.campDate,
                      )?.label}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Sección 1: Información médica */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-blue-50 text-blue-800 font-bold text-lg"
                    onClick={() => toggleSection("medica")}
                  >
                    <span>1. Información médica del participante</span>
                    {expandedSections.medica ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>

                  {expandedSections.medica && (
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="eps">¿A cuál EPS se encuentra afiliado?</Label>
                          <Input
                            id="eps"
                            placeholder="Nombre de la EPS"
                            value={formData.eps}
                            onChange={(e) => updateFormData("eps", e.target.value)}
                            required
                          />
                          {renderError("eps")}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="medicinaPrepagada"
                              checked={formData.medicinaPrepagada}
                              onCheckedChange={(checked) => updateFormData("medicinaPrepagada", checked === true)}
                            />
                            <Label htmlFor="medicinaPrepagada">¿Cuenta con medicina prepagada?</Label>
                          </div>

                          {formData.medicinaPrepagada && (
                            <div className="space-y-2">
                              <Label htmlFor="medicinaPrepagadaNombre">¿Cuál?</Label>
                              <Input
                                id="medicinaPrepagadaNombre"
                                placeholder="Nombre de la medicina prepagada"
                                value={formData.medicinaPrepagadaNombre}
                                onChange={(e) => updateFormData("medicinaPrepagadaNombre", e.target.value)}
                              />
                              {renderError("medicinaPrepagadaNombre")}
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="usaLentes"
                              checked={formData.usaLentes}
                              onCheckedChange={(checked) => updateFormData("usaLentes", checked === true)}
                            />
                            <Label htmlFor="usaLentes">¿Usa lentes?</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tipoSangre">Tipo de sangre</Label>
                          <Select
                            value={formData.tipoSangre}
                            onValueChange={(value) => updateFormData("tipoSangre", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de sangre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                          </Select>
                          {renderError("tipoSangre")}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="factorRh">Factor RH</Label>
                          <Select
                            value={formData.factorRh}
                            onValueChange={(value) => updateFormData("factorRh", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el factor RH" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positivo">Positivo (+)</SelectItem>
                              <SelectItem value="negativo">Negativo (-)</SelectItem>
                            </SelectContent>
                          </Select>
                          {renderError("factorRh")}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="estatura">Estatura (cm)</Label>
                          <Input
                            id="estatura"
                            placeholder="Ejemplo: 170"
                            value={formData.estatura}
                            onChange={(e) => updateFormData("estatura", e.target.value)}
                          />
                          {renderError("estatura")}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="peso">Peso (kg)</Label>
                          <Input
                            id="peso"
                            placeholder="Ejemplo: 65.5"
                            value={formData.peso}
                            onChange={(e) => updateFormData("peso", e.target.value)}
                          />
                          {renderError("peso")}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="horarioMedicamentos">
                          En caso de usar medicamentos ¿en qué horario los debe tomar?
                        </Label>
                        <Textarea
                          id="horarioMedicamentos"
                          placeholder="Detalle los medicamentos y horarios"
                          value={formData.horarioMedicamentos}
                          onChange={(e) => updateFormData("horarioMedicamentos", e.target.value)}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="alergiaMedicamentos"
                            checked={formData.alergiaMedicamentos}
                            onCheckedChange={(checked) => updateFormData("alergiaMedicamentos", checked === true)}
                          />
                          <Label htmlFor="alergiaMedicamentos">¿Presenta alergias a algún medicamento?</Label>
                        </div>

                        {formData.alergiaMedicamentos && (
                          <div className="space-y-2">
                            <Label htmlFor="alergiaMedicamentosDetalle">¿Cuál?</Label>
                            <Input
                              id="alergiaMedicamentosDetalle"
                              placeholder="Especifique los medicamentos"
                              value={formData.alergiaMedicamentosDetalle}
                              onChange={(e) => updateFormData("alergiaMedicamentosDetalle", e.target.value)}
                            />
                            {renderError("alergiaMedicamentosDetalle")}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="alergiaAlimentos"
                            checked={formData.alergiaAlimentos}
                            onCheckedChange={(checked) => updateFormData("alergiaAlimentos", checked === true)}
                          />
                          <Label htmlFor="alergiaAlimentos">¿Presenta alergias a algún alimento?</Label>
                        </div>

                        {formData.alergiaAlimentos && (
                          <div className="space-y-2">
                            <Label htmlFor="alergiaAlimentosDetalle">¿Cuál?</Label>
                            <Input
                              id="alergiaAlimentosDetalle"
                              placeholder="Especifique los alimentos"
                              value={formData.alergiaAlimentosDetalle}
                              onChange={(e) => updateFormData("alergiaAlimentosDetalle", e.target.value)}
                            />
                            {renderError("alergiaAlimentosDetalle")}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="intoleranciaAlimentos"
                            checked={formData.intoleranciaAlimentos}
                            onCheckedChange={(checked) => updateFormData("intoleranciaAlimentos", checked === true)}
                          />
                          <Label htmlFor="intoleranciaAlimentos">¿Presenta intolerancia a algún alimento?</Label>
                        </div>

                        {formData.intoleranciaAlimentos && (
                          <div className="space-y-2">
                            <Label htmlFor="intoleranciaAlimentosDetalle">¿Cuál?</Label>
                            <Input
                              id="intoleranciaAlimentosDetalle"
                              placeholder="Especifique los alimentos"
                              value={formData.intoleranciaAlimentosDetalle}
                              onChange={(e) => updateFormData("intoleranciaAlimentosDetalle", e.target.value)}
                            />
                            {renderError("intoleranciaAlimentosDetalle")}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegetariano"
                              checked={formData.vegetariano}
                              onCheckedChange={(checked) => updateFormData("vegetariano", checked === true)}
                            />
                            <Label htmlFor="vegetariano">¿Es vegetariano/a?</Label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="vegano"
                              checked={formData.vegano}
                              onCheckedChange={(checked) => updateFormData("vegano", checked === true)}
                            />
                            <Label htmlFor="vegano">¿Es vegano/a?</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="frecuenciaDeporte">
                          ¿Con qué frecuencia realiza deporte? Señale cuántos días a la semana realiza alguna actividad
                          física
                        </Label>
                        <Select
                          value={formData.frecuenciaDeporte}
                          onValueChange={(value) => updateFormData("frecuenciaDeporte", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Ningún día</SelectItem>
                            <SelectItem value="1-2">1-2 días por semana</SelectItem>
                            <SelectItem value="3-4">3-4 días por semana</SelectItem>
                            <SelectItem value="5-6">5-6 días por semana</SelectItem>
                            <SelectItem value="7">Todos los días</SelectItem>
                          </SelectContent>
                        </Select>
                        {renderError("frecuenciaDeporte")}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preexistenciasMedicas">
                          ¿Tiene preexistencias médicas? Enumere todas las que presente
                        </Label>
                        <Textarea
                          id="preexistenciasMedicas"
                          placeholder="Detalle las preexistencias médicas"
                          value={formData.preexistenciasMedicas}
                          onChange={(e) => updateFormData("preexistenciasMedicas", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sección 2: Información deportiva */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-blue-50 text-blue-800 font-bold text-lg"
                    onClick={() => toggleSection("deportiva")}
                  >
                    <span>2. Información deportiva del participante</span>
                    {expandedSections.deportiva ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.deportiva && (
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="otrosCampamentos"
                            checked={formData.otrosCampamentos}
                            onCheckedChange={(checked) => updateFormData("otrosCampamentos", checked === true)}
                          />
                          <Label htmlFor="otrosCampamentos">
                            ¿Ha estado anteriormente en otro Campamento deportivo?
                          </Label>
                        </div>

                        {formData.otrosCampamentos && (
                          <div className="space-y-2">
                            <Label htmlFor="otrosCampamentosDetalle">¿Cuál?</Label>
                            <Input
                              id="otrosCampamentosDetalle"
                              placeholder="Nombre del campamento"
                              value={formData.otrosCampamentosDetalle}
                              onChange={(e) => updateFormData("otrosCampamentosDetalle", e.target.value)}
                            />
                            {renderError("otrosCampamentosDetalle")}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="equipoFederado"
                            checked={formData.equipoFederado}
                            onCheckedChange={(checked) => updateFormData("equipoFederado", checked === true)}
                          />
                          <Label htmlFor="equipoFederado">¿Pertenece a algún equipo de fútbol federado?</Label>
                        </div>

                        {formData.equipoFederado && (
                          <div className="space-y-2">
                            <Label htmlFor="equipoFederadoDetalle">¿Cuál?</Label>
                            <Input
                              id="equipoFederadoDetalle"
                              placeholder="Nombre del equipo"
                              value={formData.equipoFederadoDetalle}
                              onChange={(e) => updateFormData("equipoFederadoDetalle", e.target.value)}
                            />
                            {renderError("equipoFederadoDetalle")}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="posicionJuego">
                          ¿En qué posición juega? Seleccione la posición principal de juego
                        </Label>
                        <Select
                          value={formData.posicionJuego}
                          onValueChange={(value) => updateFormData("posicionJuego", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la posición" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portero">Portero</SelectItem>
                            <SelectItem value="defensa">Defensa</SelectItem>
                            <SelectItem value="mediocampista">Mediocampista</SelectItem>
                            <SelectItem value="delantero">Delantero</SelectItem>
                          </SelectContent>
                        </Select>
                        {renderError("posicionJuego")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sección 3: Solicitud de uniforme */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-blue-50 text-blue-800 font-bold text-lg"
                    onClick={() => toggleSection("uniforme")}
                  >
                    <span>3. Solicitud de uniforme</span>
                    {expandedSections.uniforme ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.uniforme && (
                    <div className="p-6 space-y-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-yellow-800">Importante</h4>
                            <p className="text-yellow-700 text-sm">
                              Consulte primero la guía de tallas del proveedor. La talla de la camiseta y la pantaloneta
                              deben ser iguales para ambas piezas. Una vez haya enviado el formulario con la talla
                              seleccionada, recuerde que el uniforme no tendrá cambio.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tallaUniforme">Seleccione talla de camiseta y pantaloneta</Label>
                        <Select
                          value={formData.tallaUniforme}
                          onValueChange={(value) => updateFormData("tallaUniforme", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la talla" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">Talla 6</SelectItem>
                            <SelectItem value="8">Talla 8</SelectItem>
                            <SelectItem value="10">Talla 10</SelectItem>
                            <SelectItem value="12">Talla 12</SelectItem>
                            <SelectItem value="14">Talla 14</SelectItem>
                            <SelectItem value="16">Talla 16</SelectItem>
                            <SelectItem value="S">Talla S</SelectItem>
                            <SelectItem value="M">Talla M</SelectItem>
                            <SelectItem value="L">Talla L</SelectItem>
                            <SelectItem value="XL">Talla XL</SelectItem>
                          </SelectContent>
                        </Select>
                        {renderError("tallaUniforme")}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="envioUniforme"
                            checked={formData.envioUniforme}
                            onCheckedChange={(checked) => updateFormData("envioUniforme", checked === true)}
                          />
                          <Label htmlFor="envioUniforme">Desea recibir el uniforme por mensajería</Label>
                        </div>

                        {formData.envioUniforme && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="direccionEnvio">
                                A qué dirección desea recibir el uniforme por mensajería
                              </Label>
                              <Input
                                id="direccionEnvio"
                                placeholder="Dirección completa"
                                value={formData.direccionEnvio}
                                onChange={(e) => updateFormData("direccionEnvio", e.target.value)}
                              />
                              {renderError("direccionEnvio")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="ciudadEnvio">Ciudad</Label>
                              <Input
                                id="ciudadEnvio"
                                placeholder="Ciudad de envío"
                                value={formData.ciudadEnvio}
                                onChange={(e) => updateFormData("ciudadEnvio", e.target.value)}
                              />
                              {renderError("ciudadEnvio")}
                            </div>

                            <p className="text-sm text-gray-600 italic">
                              Usted deberá pagar el costo del envío del uniforme contra entrega a la empresa de
                              mensajería.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sección 4: Datos para chats */}
                <div className="border border-gray-200 rounded-lg mb-6 overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 bg-blue-50 text-blue-800 font-bold text-lg"
                    onClick={() => toggleSection("chat")}
                  >
                    <span>4. Datos para chats de madres, padres y/o tutores legales</span>
                    {expandedSections.chat ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>

                  {expandedSections.chat && (
                    <div className="p-6 space-y-6">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                          Relacione las personas que serán incluidas en el chat de comunicación durante el campamento.
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-700">Persona 1</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="persona1Parentesco">Parentesco</Label>
                              <Input
                                id="persona1Parentesco"
                                placeholder="Parentesco con el menor"
                                value={formData.persona1Parentesco}
                                onChange={(e) => updateFormData("persona1Parentesco", e.target.value)}
                                required
                              />
                              {renderError("persona1Parentesco")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="persona1Telefono">Teléfono</Label>
                              <Input
                                id="persona1Telefono"
                                placeholder="Si es internacional, incluir indicativo"
                                value={formData.persona1Telefono}
                                onChange={(e) => updateFormData("persona1Telefono", e.target.value)}
                                required
                              />
                              {renderError("persona1Telefono")}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-700">Persona 2 (opcional)</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="persona2Parentesco">Parentesco</Label>
                              <Input
                                id="persona2Parentesco"
                                placeholder="Parentesco con el menor"
                                value={formData.persona2Parentesco}
                                onChange={(e) => updateFormData("persona2Parentesco", e.target.value)}
                              />
                              {renderError("persona2Parentesco")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="persona2Telefono">Teléfono</Label>
                              <Input
                                id="persona2Telefono"
                                placeholder="Si es internacional, incluir indicativo"
                                value={formData.persona2Telefono}
                                onChange={(e) => updateFormData("persona2Telefono", e.target.value)}
                              />
                              {renderError("persona2Telefono")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="aceptaTerminos"
                      checked={formData.aceptaTerminos}
                      onCheckedChange={(checked) => updateFormData("aceptaTerminos", checked === true)}
                      required
                    />
                    <Label htmlFor="aceptaTerminos" className="text-sm text-gray-600">
                      La información suministrada en el presente Formulario de Inscripción o por cualquier otro medio a
                      la Compañía, deberá ser veraz, precisa y no debe inducir a engaño o error. La Compañía se reserva
                      la facultad de constatar la información y en el evento de encontrar alguna inexactitud en ésta, la
                      inscripción del menor podrá ser rechazada.
                    </Label>
                  </div>
                  {renderError("aceptaTerminos")}
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Completar registro"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}

