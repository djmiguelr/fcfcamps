"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Calendar,
  Upload,
  Check,
  AlertCircle,
  MapPin,
} from "lucide-react"
import { z } from "zod"
import { SiteFooter } from "@/components/site-footer"

// Fechas disponibles por ciudad
const campDates = {
  bogota: [
    { id: "bog-1", label: "16 AL 21 JUNIO - SEMANA 1" },
    { id: "bog-2", label: "23 AL 28 JUNIO - SEMANA 2" },
    { id: "bog-3", label: "14 AL 19 JULIO - SEMANA 3" },
  ],
  barranquilla: [
    { id: "bar-1", label: "23 AL 28 JUNIO - SEMANA 1" },
    { id: "bar-2", label: "30 JUNIO AL 5 JULIO - SEMANA 2" },
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
const emailSchema = z.string().email("Correo electrónico inválido")
const nameSchema = z
  .string()
  .min(3, "Nombre demasiado corto")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "Solo se permiten letras y espacios")
const documentNumberSchema = z
  .string()
  .min(5, "Número de documento inválido")
  .regex(/^[a-zA-Z0-9-]+$/, "Formato de documento inválido")
const addressSchema = z.string().min(5, "Dirección demasiado corta")
const citySchema = z
  .string()
  .min(3, "Ciudad inválida")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/, "Solo se permiten letras, espacios y guiones")
const countrySchema = z
  .string()
  .min(3, "País inválido")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/, "Solo se permiten letras, espacios y guiones")

// Tipo para errores de validación
type ValidationErrors = {
  [key: string]: string | null
}

export default function CheckoutPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const epsFileInputRef = useRef<HTMLInputElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Estado para errores de validación
  const [errors, setErrors] = useState<ValidationErrors>({})

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Ciudad y fecha
    city: "",
    campDate: "",

    // Paso 2: Categoría
    category: "",

    // Paso 3: Información del menor
    childName: "",
    childLastName: "",
    childBirthDate: "",
    childDocType: "",
    childDocNumber: "",
    childDocFile: null as File | null,
    childEpsFile: null as File | null,
    childBirthCity: "",
    childBirthCountry: "Colombia",

    // Paso 4: Información de residencia
    address: "",
    neighborhood: "",
    apartment: "",
    residenceCity: "",
    residenceCountry: "Colombia",

    // Paso 5: Información familiar
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",

    // Paso 6: Información de pago
    payerName: "",
    payerDocType: "",
    payerDocNumber: "",
    payerEmail: "",
    payerPhone: "",
    payerWhatsapp: "",
    payerType: "natural",
    payerAddress: "",
    payerCity: "",
    payerCountry: "Colombia",

    // Términos y condiciones
    termsAccepted: false,
  })

  // Cargar datos preseleccionados si existen
  useEffect(() => {
    const savedSelection = localStorage.getItem("fcfCampsSelection")
    if (savedSelection) {
      try {
        const selection = JSON.parse(savedSelection)
        setFormData((prev) => ({
          ...prev,
          city: selection.city || "",
          campDate: selection.campDate || "",
          category: selection.category || "",
        }))
      } catch (error) {
        console.error("Error parsing saved selection:", error)
      }
    }
  }, [])

  // Auto-scroll cuando cambia el paso
  useEffect(() => {
    if (formContainerRef.current) {
      window.scrollTo({
        top: formContainerRef.current.offsetTop - 100,
        behavior: "smooth",
      })
    }
  }, [step])

  // Actualizar datos del formulario
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar error cuando se actualiza un campo
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Manejar archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "El archivo no debe superar los 5MB",
        }))
        return
      }

      // Validar tipo de archivo
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Formato no válido. Use PDF, JPG o PNG",
        }))
        return
      }

      updateFormData(fieldName, file)
    }
  }

  // Navegar entre pasos
  const handleNextStep = () => {
    // Validar el paso actual antes de avanzar
    if (validateCurrentStep()) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  // Validar el paso actual
  const validateCurrentStep = () => {
    let isValid = true
    const newErrors: ValidationErrors = {}

    switch (step) {
      case 1:
        if (!formData.city) {
          newErrors.city = "Selecciona una ciudad"
          isValid = false
        }
        if (!formData.campDate) {
          newErrors.campDate = "Selecciona una fecha"
          isValid = false
        }
        break

      case 2:
        if (!formData.category) {
          newErrors.category = "Selecciona una categoría"
          isValid = false
        }
        break

      case 3:
        try {
          nameSchema.parse(formData.childName)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.childName = error.errors[0].message
            isValid = false
          }
        }

        try {
          nameSchema.parse(formData.childLastName)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.childLastName = error.errors[0].message
            isValid = false
          }
        }

        if (!formData.childBirthDate) {
          newErrors.childBirthDate = "Ingresa la fecha de nacimiento"
          isValid = false
        }

        if (!formData.childDocType) {
          newErrors.childDocType = "Selecciona el tipo de documento"
          isValid = false
        }

        try {
          documentNumberSchema.parse(formData.childDocNumber)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.childDocNumber = error.errors[0].message
            isValid = false
          }
        }

        try {
          citySchema.parse(formData.childBirthCity)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.childBirthCity = error.errors[0].message
            isValid = false
          }
        }

        try {
          countrySchema.parse(formData.childBirthCountry)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.childBirthCountry = error.errors[0].message
            isValid = false
          }
        }
        break

      case 4:
        try {
          addressSchema.parse(formData.address)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.address = error.errors[0].message
            isValid = false
          }
        }

        try {
          citySchema.parse(formData.residenceCity)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.residenceCity = error.errors[0].message
            isValid = false
          }
        }

        try {
          countrySchema.parse(formData.residenceCountry)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.residenceCountry = error.errors[0].message
            isValid = false
          }
        }
        break

      case 5:
        try {
          nameSchema.parse(formData.motherName)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.motherName = error.errors[0].message
            isValid = false
          }
        }

        try {
          phoneSchema.parse(formData.motherPhone)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.motherPhone = error.errors[0].message
            isValid = false
          }
        }

        try {
          emailSchema.parse(formData.motherEmail)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.motherEmail = error.errors[0].message
            isValid = false
          }
        }

        // Padre es opcional, pero si se proporciona algún dato, validar
        if (formData.fatherName) {
          try {
            nameSchema.parse(formData.fatherName)
          } catch (error) {
            if (error instanceof z.ZodError) {
              newErrors.fatherName = error.errors[0].message
              isValid = false
            }
          }
        }

        if (formData.fatherPhone) {
          try {
            phoneSchema.parse(formData.fatherPhone)
          } catch (error) {
            if (error instanceof z.ZodError) {
              newErrors.fatherPhone = error.errors[0].message
              isValid = false
            }
          }
        }

        if (formData.fatherEmail) {
          try {
            emailSchema.parse(formData.fatherEmail)
          } catch (error) {
            if (error instanceof z.ZodError) {
              newErrors.fatherEmail = error.errors[0].message
              isValid = false
            }
          }
        }

        try {
          nameSchema.parse(formData.emergencyName)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.emergencyName = error.errors[0].message
            isValid = false
          }
        }

        if (!formData.emergencyRelationship) {
          newErrors.emergencyRelationship = "Ingresa el parentesco"
          isValid = false
        }

        try {
          phoneSchema.parse(formData.emergencyPhone)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.emergencyPhone = error.errors[0].message
            isValid = false
          }
        }
        break

      case 6:
        try {
          nameSchema.parse(formData.payerName)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerName = error.errors[0].message
            isValid = false
          }
        }

        if (!formData.payerDocType) {
          newErrors.payerDocType = "Selecciona el tipo de documento"
          isValid = false
        }

        try {
          documentNumberSchema.parse(formData.payerDocNumber)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerDocNumber = error.errors[0].message
            isValid = false
          }
        }

        try {
          emailSchema.parse(formData.payerEmail)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerEmail = error.errors[0].message
            isValid = false
          }
        }

        try {
          phoneSchema.parse(formData.payerPhone)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerPhone = error.errors[0].message
            isValid = false
          }
        }

        if (formData.payerWhatsapp) {
          try {
            phoneSchema.parse(formData.payerWhatsapp)
          } catch (error) {
            if (error instanceof z.ZodError) {
              newErrors.payerWhatsapp = error.errors[0].message
              isValid = false
            }
          }
        }

        try {
          addressSchema.parse(formData.payerAddress)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerAddress = error.errors[0].message
            isValid = false
          }
        }

        try {
          citySchema.parse(formData.payerCity)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerCity = error.errors[0].message
            isValid = false
          }
        }

        try {
          countrySchema.parse(formData.payerCountry)
        } catch (error) {
          if (error instanceof z.ZodError) {
            newErrors.payerCountry = error.errors[0].message
            isValid = false
          }
        }

        if (!formData.termsAccepted) {
          newErrors.termsAccepted = "Debes aceptar los términos y condiciones"
          isValid = false
        }
        break
    }

    setErrors(newErrors)
    return isValid
  }

  // Verificar si el paso actual es válido (para habilitar/deshabilitar botones)
  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return formData.city && formData.campDate
      case 2:
        return formData.category
      case 3:
        return (
          formData.childName &&
          formData.childLastName &&
          formData.childBirthDate &&
          formData.childDocType &&
          formData.childDocNumber &&
          formData.childBirthCity &&
          formData.childBirthCountry &&
          !Object.values(errors).some((error) => error !== null)
        )
      case 4:
        return (
          formData.address &&
          formData.residenceCity &&
          formData.residenceCountry &&
          !Object.values(errors).some((error) => error !== null)
        )
      case 5:
        return (
          formData.motherName &&
          formData.motherPhone &&
          formData.motherEmail &&
          formData.emergencyName &&
          formData.emergencyRelationship &&
          formData.emergencyPhone &&
          !Object.values(errors).some((error) => error !== null)
        )
      case 6:
        return (
          formData.payerName &&
          formData.payerDocType &&
          formData.payerDocNumber &&
          formData.payerEmail &&
          formData.payerPhone &&
          formData.termsAccepted &&
          !Object.values(errors).some((error) => error !== null)
        )
      default:
        return true
    }
  }

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todo el formulario antes de enviar
    if (!validateCurrentStep()) {
      return
    }

    setIsSubmitting(true)

    // Simular procesamiento de pago
    setTimeout(() => {
      setIsSubmitting(false)

      // Guardar datos en localStorage para usarlos en la página de éxito
      localStorage.setItem("fcfCampsFormData", JSON.stringify(formData))

      // Redirigir a la página de éxito
      router.push("/checkout/success")
    }, 2000)
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

  // Calcular precio con IVA
  const basePrice = 1690000
  const iva = basePrice * 0.19
  const totalPrice = basePrice + iva

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden" ref={formContainerRef}>
              <div className="bg-blue-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Inscripción FCF Camps 2025</h1>
                <p>Completa el proceso para asegurar el cupo de tu hijo</p>

                <div className="flex justify-between items-center mt-6 max-w-3xl mx-auto">
                  {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
                    <div key={stepNumber} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step >= stepNumber ? "bg-yellow-400 text-blue-800" : "bg-blue-500 text-white"
                        }`}
                      >
                        {stepNumber}
                      </div>
                      <span className={`text-xs ${step >= stepNumber ? "text-white" : "text-blue-300"}`}>
                        {stepNumber === 1 && "Ciudad"}
                        {stepNumber === 2 && "Categoría"}
                        {stepNumber === 3 && "Participante"}
                        {stepNumber === 4 && "Residencia"}
                        {stepNumber === 5 && "Familia"}
                        {stepNumber === 6 && "Pago"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Paso 1: Selección de ciudad y fecha */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Selecciona la ciudad y fecha</h2>
                          <p className="text-gray-600">Elige dónde y cuándo participará tu hijo en el FCF Camps</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div
                            className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.city === "bogota"
                                ? "ring-4 ring-yellow-400 shadow-lg"
                                : "border-2 border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => updateFormData("city", "bogota")}
                          >
                            <div className="relative h-48">
                              <Image
                                src="/placeholder.svg?height=400&width=600&text=Bogotá"
                                alt="Bogotá"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-3xl font-bold text-white mb-2">Bogotá</h3>
                                <p className="text-yellow-300 font-medium">4 fechas disponibles</p>

                                {formData.city === "bogota" && (
                                  <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-sm transform rotate-3">
                                    SELECCIONADO
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.city === "barranquilla"
                                ? "ring-4 ring-yellow-400 shadow-lg"
                                : "border-2 border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => updateFormData("city", "barranquilla")}
                          >
                            <div className="relative h-48">
                              <Image
                                src="/placeholder.svg?height=400&width=600&text=Barranquilla"
                                alt="Barranquilla"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-3xl font-bold text-white mb-2">Barranquilla</h3>
                                <p className="text-yellow-300 font-medium">3 fechas disponibles</p>

                                {formData.city === "barranquilla" && (
                                  <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-full text-sm transform rotate-3">
                                    SELECCIONADO
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {errors.city && <div className="text-center">{renderError("city")}</div>}

                        {formData.city && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8"
                          >
                            <Label htmlFor="campDate" className="text-lg font-medium text-blue-800 mb-3 block">
                              Selecciona la fecha del campamento
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              {formData.city &&
                                campDates[formData.city as keyof typeof campDates].map((date) => (
                                  <div
                                    key={date.id}
                                    className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                                      formData.campDate === date.id
                                        ? "border-yellow-400 bg-yellow-50"
                                        : "border-gray-200 hover:border-blue-300"
                                    }`}
                                    onClick={() => updateFormData("campDate", date.id)}
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full flex-shrink-0 ${
                                        formData.campDate === date.id ? "bg-yellow-400" : "border-2 border-gray-300"
                                      }`}
                                    >
                                      {formData.campDate === date.id && <Check className="w-5 h-5 text-blue-800" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-5 w-5 text-blue-600" />
                                      <span className="font-medium">{date.label}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {errors.campDate && <div className="mt-2">{renderError("campDate")}</div>}
                          </motion.div>
                        )}

                        <div className="flex justify-end mt-8">
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!isCurrentStepValid()}
                          >
                            Continuar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Paso 2: Selección de categoría */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Selecciona la categoría</h2>
                          <p className="text-gray-600">Elige la categoría según la edad de tu hijo</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h3 className="font-bold text-blue-800 mb-2">Ciudad y fecha seleccionada</h3>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">
                              {formData.city === "bogota" ? "Bogotá" : "Barranquilla"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span>
                              {formData.city &&
                                formData.campDate &&
                                campDates[formData.city as keyof typeof campDates].find(
                                  (date) => date.id === formData.campDate,
                                )?.label}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                formData.category === category.id
                                  ? "border-yellow-400 bg-yellow-50"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                              onClick={() => updateFormData("category", category.id)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-blue-800">{category.title}</h3>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {category.ageRange}
                                </div>
                              </div>

                              <p className="text-gray-600 text-sm mb-3">
                                Entrenamiento adaptado para niños de {category.ageRange} con actividades específicas
                                para su desarrollo.
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <div
                                  className={`w-5 h-5 rounded-full ${
                                    formData.category === category.id ? "bg-yellow-400" : "border-2 border-gray-300"
                                  }`}
                                >
                                  {formData.category === category.id && <Check className="w-5 h-5 text-blue-800" />}
                                </div>
                                <span className="font-medium text-blue-600">
                                  {formData.category === category.id ? "Seleccionado" : "Seleccionar"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {errors.category && <div className="mt-2">{renderError("category")}</div>}

                        <div className="flex justify-between mt-8">
                          <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!isCurrentStepValid()}
                          >
                            Continuar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Paso 3: Información del participante */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Información del participante</h2>
                          <p className="text-gray-600">Ingresa los datos del menor que participará en el campamento</p>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                          <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-yellow-800">Importante</h4>
                              <p className="text-yellow-700 text-sm">
                                La información proporcionada será utilizada por el cuerpo técnico. En caso de
                                imprecisión en el diploma, tenga en cuenta que si usted comete un error, FCF Camps no
                                realizará correcciones ortográficas ni de tipeo.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="childName">Nombres del participante</Label>
                            <Input
                              id="childName"
                              placeholder="Nombres completos"
                              value={formData.childName}
                              onChange={(e) => updateFormData("childName", e.target.value)}
                              required
                            />
                            {renderError("childName")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childLastName">Apellidos del participante</Label>
                            <Input
                              id="childLastName"
                              placeholder="Apellidos completos"
                              value={formData.childLastName}
                              onChange={(e) => updateFormData("childLastName", e.target.value)}
                              required
                            />
                            {renderError("childLastName")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childBirthDate">Fecha de nacimiento</Label>
                            <Input
                              id="childBirthDate"
                              type="date"
                              value={formData.childBirthDate}
                              onChange={(e) => updateFormData("childBirthDate", e.target.value)}
                              required
                            />
                            {renderError("childBirthDate")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childDocType">Tipo de documento</Label>
                            <Select
                              value={formData.childDocType}
                              onValueChange={(value) => updateFormData("childDocType", value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo de documento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TI">Tarjeta de Identidad (TI)</SelectItem>
                                <SelectItem value="NUIP">NUIP</SelectItem>
                                <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                                <SelectItem value="RC">Registro Civil (RC)</SelectItem>
                              </SelectContent>
                            </Select>
                            {renderError("childDocType")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childDocNumber">Número de documento</Label>
                            <Input
                              id="childDocNumber"
                              placeholder="Número de documento"
                              value={formData.childDocNumber}
                              onChange={(e) => updateFormData("childDocNumber", e.target.value)}
                              required
                            />
                            {renderError("childDocNumber")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childDocFile">Documento del menor</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4" />
                                {formData.childDocFile ? "Cambiar archivo" : "Adjuntar documento"}
                              </Button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, "childDocFile")}
                              />
                            </div>
                            {formData.childDocFile && (
                              <p className="text-sm text-green-600 mt-1">
                                Archivo seleccionado: {formData.childDocFile.name}
                              </p>
                            )}
                            {renderError("childDocFile")}
                            <p className="text-xs text-gray-500">Formatos aceptados: PDF, JPG, PNG (máx. 5MB)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childEpsFile">Certificado de afiliación EPS/Medicina prepagada</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center gap-2"
                                onClick={() => epsFileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4" />
                                {formData.childEpsFile ? "Cambiar archivo" : "Adjuntar certificado"}
                              </Button>
                              <input
                                ref={epsFileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, "childEpsFile")}
                              />
                            </div>
                            {formData.childEpsFile && (
                              <p className="text-sm text-green-600 mt-1">
                                Archivo seleccionado: {formData.childEpsFile.name}
                              </p>
                            )}
                            {renderError("childEpsFile")}
                            <p className="text-xs text-gray-500">Formatos aceptados: PDF, JPG, PNG (máx. 5MB)</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childBirthCity">Ciudad de nacimiento</Label>
                            <Input
                              id="childBirthCity"
                              placeholder="Ciudad de nacimiento"
                              value={formData.childBirthCity}
                              onChange={(e) => updateFormData("childBirthCity", e.target.value)}
                              required
                            />
                            {renderError("childBirthCity")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="childBirthCountry">País de nacimiento</Label>
                            <Input
                              id="childBirthCountry"
                              placeholder="País de nacimiento"
                              value={formData.childBirthCountry}
                              onChange={(e) => updateFormData("childBirthCountry", e.target.value)}
                              required
                            />
                            {renderError("childBirthCountry")}
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!isCurrentStepValid()}
                          >
                            Continuar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Paso 4: Información de residencia */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Información de residencia</h2>
                          <p className="text-gray-600">Ingresa los datos de residencia del participante</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                              id="address"
                              placeholder="Dirección completa"
                              value={formData.address}
                              onChange={(e) => updateFormData("address", e.target.value)}
                              required
                            />
                            {renderError("address")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="neighborhood">Barrio</Label>
                            <Input
                              id="neighborhood"
                              placeholder="Barrio"
                              value={formData.neighborhood}
                              onChange={(e) => updateFormData("neighborhood", e.target.value)}
                            />
                            {renderError("neighborhood")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="apartment">Apartamento/Conjunto</Label>
                            <Input
                              id="apartment"
                              placeholder="Apartamento, conjunto, torre, etc."
                              value={formData.apartment}
                              onChange={(e) => updateFormData("apartment", e.target.value)}
                            />
                            {renderError("apartment")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="residenceCity">Ciudad</Label>
                            <Input
                              id="residenceCity"
                              placeholder="Ciudad de residencia"
                              value={formData.residenceCity}
                              onChange={(e) => updateFormData("residenceCity", e.target.value)}
                              required
                            />
                            {renderError("residenceCity")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="residenceCountry">País</Label>
                            <Input
                              id="residenceCountry"
                              placeholder="País de residencia"
                              value={formData.residenceCountry}
                              onChange={(e) => updateFormData("residenceCountry", e.target.value)}
                              required
                            />
                            {renderError("residenceCountry")}
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!isCurrentStepValid()}
                          >
                            Continuar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Paso 5: Información familiar */}
                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Información familiar</h2>
                          <p className="text-gray-600">
                            Ingresa los datos del núcleo familiar y contacto de emergencia
                          </p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                          <h3 className="text-lg font-bold text-blue-800 mb-4">Información de la madre</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="motherName">Nombre completo</Label>
                              <Input
                                id="motherName"
                                placeholder="Nombre completo de la madre"
                                value={formData.motherName}
                                onChange={(e) => updateFormData("motherName", e.target.value)}
                                required
                              />
                              {renderError("motherName")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="motherPhone">Número de celular</Label>
                              <Input
                                id="motherPhone"
                                placeholder="Incluir indicativo si es internacional"
                                value={formData.motherPhone}
                                onChange={(e) => updateFormData("motherPhone", e.target.value)}
                                required
                              />
                              {renderError("motherPhone")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="motherEmail">Correo electrónico</Label>
                              <Input
                                id="motherEmail"
                                type="email"
                                placeholder="Correo electrónico"
                                value={formData.motherEmail}
                                onChange={(e) => updateFormData("motherEmail", e.target.value)}
                                required
                              />
                              {renderError("motherEmail")}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                          <h3 className="text-lg font-bold text-blue-800 mb-4">Información del padre</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="fatherName">Nombre completo</Label>
                              <Input
                                id="fatherName"
                                placeholder="Nombre completo del padre"
                                value={formData.fatherName}
                                onChange={(e) => updateFormData("fatherName", e.target.value)}
                              />
                              {renderError("fatherName")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="fatherPhone">Número de celular</Label>
                              <Input
                                id="fatherPhone"
                                placeholder="Incluir indicativo si es internacional"
                                value={formData.fatherPhone}
                                onChange={(e) => updateFormData("fatherPhone", e.target.value)}
                              />
                              {renderError("fatherPhone")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="fatherEmail">Correo electrónico</Label>
                              <Input
                                id="fatherEmail"
                                type="email"
                                placeholder="Correo electrónico"
                                value={formData.fatherEmail}
                                onChange={(e) => updateFormData("fatherEmail", e.target.value)}
                              />
                              {renderError("fatherEmail")}
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                          <h3 className="text-lg font-bold text-yellow-800 mb-4">Contacto de emergencia</h3>
                          <p className="text-yellow-700 text-sm mb-4">
                            Persona distinta a padre y madre que podamos contactar en caso de emergencia
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="emergencyName">Nombre completo</Label>
                              <Input
                                id="emergencyName"
                                placeholder="Nombre completo del contacto de emergencia"
                                value={formData.emergencyName}
                                onChange={(e) => updateFormData("emergencyName", e.target.value)}
                                required
                              />
                              {renderError("emergencyName")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="emergencyRelationship">Parentesco</Label>
                              <Input
                                id="emergencyRelationship"
                                placeholder="Parentesco con el menor"
                                value={formData.emergencyRelationship}
                                onChange={(e) => updateFormData("emergencyRelationship", e.target.value)}
                                required
                              />
                              {renderError("emergencyRelationship")}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="emergencyPhone">Número de celular</Label>
                              <Input
                                id="emergencyPhone"
                                placeholder="Incluir indicativo si es internacional"
                                value={formData.emergencyPhone}
                                onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                                required
                              />
                              {renderError("emergencyPhone")}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!isCurrentStepValid()}
                          >
                            Continuar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Paso 6: Información de pago */}
                    {step === 6 && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-800 mb-2">Información de pago</h2>
                          <p className="text-gray-600">Ingresa los datos para procesar el pago</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-6">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                              <h3 className="text-lg font-bold text-blue-800 mb-4">Información del pagador</h3>

                              <div className="space-y-4">
                                <RadioGroup
                                  value={formData.payerType}
                                  onValueChange={(value) => updateFormData("payerType", value)}
                                  className="flex space-x-4 mb-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="natural" id="natural" />
                                    <Label htmlFor="natural">Persona Natural</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="juridica" id="juridica" />
                                    <Label htmlFor="juridica">Persona Jurídica</Label>
                                  </div>
                                </RadioGroup>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="payerName">Nombre completo</Label>
                                    <Input
                                      id="payerName"
                                      placeholder="Nombre completo del pagador"
                                      value={formData.payerName}
                                      onChange={(e) => updateFormData("payerName", e.target.value)}
                                      required
                                    />
                                    {renderError("payerName")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerDocType">Tipo de documento</Label>
                                    <Select
                                      value={formData.payerDocType}
                                      onValueChange={(value) => updateFormData("payerDocType", value)}
                                      required
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo de documento" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                        <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                                        <SelectItem value="NIT">NIT</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {renderError("payerDocType")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerDocNumber">Número de documento</Label>
                                    <Input
                                      id="payerDocNumber"
                                      placeholder="Número de documento"
                                      value={formData.payerDocNumber}
                                      onChange={(e) => updateFormData("payerDocNumber", e.target.value)}
                                      required
                                    />
                                    {renderError("payerDocNumber")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerEmail">Correo electrónico</Label>
                                    <Input
                                      id="payerEmail"
                                      type="email"
                                      placeholder="Correo electrónico"
                                      value={formData.payerEmail}
                                      onChange={(e) => updateFormData("payerEmail", e.target.value)}
                                      required
                                    />
                                    {renderError("payerEmail")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerPhone">Número de teléfono</Label>
                                    <Input
                                      id="payerPhone"
                                      placeholder="Número de teléfono"
                                      value={formData.payerPhone}
                                      onChange={(e) => updateFormData("payerPhone", e.target.value)}
                                      required
                                    />
                                    {renderError("payerPhone")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerWhatsapp">Número de WhatsApp</Label>
                                    <Input
                                      id="payerWhatsapp"
                                      placeholder="Número de WhatsApp"
                                      value={formData.payerWhatsapp}
                                      onChange={(e) => updateFormData("payerWhatsapp", e.target.value)}
                                    />
                                    {renderError("payerWhatsapp")}
                                  </div>

                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="payerAddress">Dirección</Label>
                                    <Input
                                      id="payerAddress"
                                      placeholder="Dirección completa"
                                      value={formData.payerAddress}
                                      onChange={(e) => updateFormData("payerAddress", e.target.value)}
                                      required
                                    />
                                    {renderError("payerAddress")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerCity">Ciudad</Label>
                                    <Input
                                      id="payerCity"
                                      placeholder="Ciudad"
                                      value={formData.payerCity}
                                      onChange={(e) => updateFormData("payerCity", e.target.value)}
                                      required
                                    />
                                    {renderError("payerCity")}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="payerCountry">País</Label>
                                    <Input
                                      id="payerCountry"
                                      placeholder="País"
                                      value={formData.payerCountry}
                                      onChange={(e) => updateFormData("payerCountry", e.target.value)}
                                      required
                                    />
                                    {renderError("payerCountry")}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-2">
                              <Checkbox
                                id="terms"
                                checked={formData.termsAccepted}
                                onCheckedChange={(checked) => updateFormData("termsAccepted", checked === true)}
                                required
                              />
                              <Label htmlFor="terms" className="text-sm text-gray-600">
                                Acepto los términos y condiciones y autorizo el tratamiento de datos personales
                              </Label>
                            </div>
                            {renderError("termsAccepted")}
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Resumen de compra</h3>

                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  {categories.find((cat) => cat.id === formData.category)?.title} (
                                  {categories.find((cat) => cat.id === formData.category)?.ageRange})
                                </span>
                                <span className="font-medium">${basePrice.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Ciudad: {formData.city === "bogota" ? "Bogotá" : "Barranquilla"}
                                </span>
                                <span className="font-medium"></span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Fecha:{" "}
                                  {formData.city &&
                                    formData.campDate &&
                                    campDates[formData.city as keyof typeof campDates].find(
                                      (date) => date.id === formData.campDate,
                                    )?.label}
                                </span>
                                <span className="font-medium"></span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">IVA (19%)</span>
                                <span className="font-medium">${iva.toLocaleString()}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span>${totalPrice.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded p-3 flex items-start gap-2 mb-4">
                              <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-700">
                                Tu pago está protegido con encriptación de 256 bits
                              </p>
                            </div>

                            <div className="flex justify-center gap-2 mb-2">
                              <Image src="/placeholder.svg?height=30&width=40" alt="Visa" width={40} height={30} />
                              <Image
                                src="/placeholder.svg?height=30&width=40"
                                alt="Mastercard"
                                width={40}
                                height={30}
                              />
                              <Image
                                src="/placeholder.svg?height=30&width=40"
                                alt="American Express"
                                width={40}
                                height={30}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <Button type="button" variant="outline" onClick={handlePrevStep} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            disabled={isSubmitting || !isCurrentStepValid()}
                          >
                            {isSubmitting ? "Procesando..." : "Completar pago"}
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </>
  )
}

