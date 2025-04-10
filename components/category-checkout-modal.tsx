"use client"

import type React from "react"

// Corregir las comillas simples en las importaciones por comillas dobles para mantener consistencia
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, MapPin, Check, AlertCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface CategoryCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    title: string
    ageRange: string
    description: string
    imageSrc: string
    benefits?: string[]
  }
}

// Renombrar el componente a CategoryPreRegistrationModal para reflejar su propósito
export function CategoryCheckoutModal({ isOpen, onClose, category }: CategoryCheckoutModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCity, setSelectedCity] = useState("bogota")
  const [selectedDate, setSelectedDate] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  // Añadir después de la declaración de campDates
  // Mapeo de categorías a colores
  const categoryColors = {
    iniciacion: "bg-white border border-gray-300",
    preinfantil: "bg-black",
    infantil: "bg-blue-700",
    "prejuvenil-masculino": "bg-green-600",
    "prejuvenil-femenino": "bg-red-600",
    "juvenil-masculino": "bg-blue-900",
    "juvenil-femenino": "bg-sky-400",
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setSelectedDate("")
  }

  // Corregir el problema con la selección de fechas
  // Modificar la función handleDateSelect para asegurar que funcione correctamente
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    // Limpiar error si existe
    if (errors.date) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.date
        return newErrors
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Ingrese un número de teléfono válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (selectedCity && selectedDate) {
        setStep(2)
      } else {
        setErrors({
          ...errors,
          city: !selectedCity ? "Selecciona una ciudad" : "",
          date: !selectedDate ? "Selecciona una fecha" : "",
        })
      }
    } else if (step === 2) {
      if (validateForm()) {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const nombreCompleto = formData.name.trim();
      const ciudadFormateada = selectedCity;
      const categoriaFormateada = category.title;
      const fechaFormateada = selectedDate;
      const consumerKey = "ck_9ce1f789475af98f1d926de780f85fe95f82a37e";
      const consumerSecret = "cs_65478296feabafc9185754f790222e4ce2ea0d30";
      
      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
      );
 
      if (!productResponse.ok) {
        throw new Error("Error al obtener productos");
      }
      
      const products = await productResponse.json();
      
      const product = products.find(p => p.name.includes(ciudadFormateada)) || products[0];

      if (!product) {
        throw new Error("No se encontró el producto correspondiente");
      }
      
      const orderData = {
        payment_method: "bacs",
        payment_method_title: "Transferencia bancaria",
        set_paid: false,
        billing: {
          first_name: formData.name.split(' ')[0],
          last_name: formData.name.split(' ').slice(1).join(' '),
          email: formData.email,
          phone: formData.phone
        },
        line_items: [
          {
            product_id: product.id,
            quantity: 1
          }
        ],
        meta_data: [
          {
            key: "participant_name",
            value: nombreCompleto
          },
          {
            key: "camp_city",
            value: ciudadFormateada
          },
          {
            key: "camp_category",
            value: categoriaFormateada
          },
          {
            key: "camp_date",
            value: fechaFormateada
          }
        ]
      };
      
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        }
      );
      
      if (!orderResponse.ok) {
        throw new Error("Error al crear el pedido");
      }
      
      const order = await orderResponse.json();

      localStorage.setItem(
        "fcfCampsPreRegistration",
        JSON.stringify({
          city: ciudadFormateada,
          date: fechaFormateada,
          category: categoriaFormateada,
          ...formData,
          orderId: order.id,
          paymentUrl: order.payment_url
        }),
      );

      const paymentWindow = window.open(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`, "_blank");

      window.addEventListener('message', function(event) {
        if (event.data && event.data.paymentComplete && event.data.orderId === order.id) {
          setIsSuccess(true);
          if (paymentWindow && !paymentWindow.closed) {
            paymentWindow.close();
          }
        }
      });
      
      const checkPaymentStatus = async () => {
        try {
          const statusResponse = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/orders/${order.id}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
          );
          
          if (statusResponse.ok) {
            const orderStatus = await statusResponse.json();
            if (orderStatus.status === 'completed' || orderStatus.status === 'processing') {
              setIsSuccess(true);
            }
          }
        } catch (error) {
          console.error('Error al verificar estado del pago:', error);
        }
      };
      
      const paymentCheckInterval = setInterval(checkPaymentStatus, 30000);
      
      return () => clearInterval(paymentCheckInterval);
      
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        submit: 'Hubo un error al procesar tu pedido. Por favor intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setStep(1)
    setSelectedCity("bogota")
    setSelectedDate("")
    setFormData({
      name: "",
      email: "",
      phone: "",
    })
    setErrors({})
    setIsSubmitting(false)
    setIsSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Header */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
              onClick={handleClose}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="bg-blue-600 p-6 text-white">
              <h2 className="text-xl font-bold">Inscripción - {category.title}</h2>
              <p className="text-blue-100">Categoría: {category.ageRange}</p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">¡Felicidades!</h3>
                  <p className="text-gray-600 mb-6">
                    Estás inscrito en FCF Camps. Dentro de poco te contactaremos para inscribir a tu hijo en los FCF
                    Camps.
                  </p>
                  <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
                    Cerrar
                  </Button>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        1
                      </div>
                      <div className={`h-1 w-8 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        2
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Paso {step} de 2</div>
                  </div>

                  {/* Step 1: Select city and date */}
                  {step === 1 && (
                    <div>
                      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">{category.title}</p>
                          <p className="text-gray-600">{category.ageRange}</p>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-4">Selecciona la sede</h3>

                      {/* Reemplazar también el RadioGroup para la selección de ciudad */}
                      <div className="space-y-3 mb-6">
                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCity === "bogota"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCitySelect("bogota")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCity === "bogota" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCity === "bogota" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span className="cursor-pointer">Sede Bogotá</span>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCity === "barranquilla"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCitySelect("barranquilla")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCity === "barranquilla" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCity === "barranquilla" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span className="cursor-pointer">Sede Barranquilla</span>
                          </div>
                        </div>

                        {errors.city && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {selectedCity && (
                        <>
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Selecciona una fecha</h3>

                          {/* Reemplazar el RadioGroup con divs clickeables para la selección de fechas */}
                          <div className="space-y-3 mb-6">
                            {campDates[selectedCity as keyof typeof campDates].map((date) => (
                              <div
                                key={date.id}
                                className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                                  selectedDate === date.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }`}
                                onClick={() => handleDateSelect(date.id)}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full flex-shrink-0 ${
                                    selectedDate === date.id ? "bg-blue-600" : "border-2 border-gray-300"
                                  }`}
                                >
                                  {selectedDate === date.id && <Check className="w-5 h-5 text-white" />}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                  <span className="cursor-pointer">{date.label}</span>
                                </div>
                              </div>
                            ))}

                            {errors.date && (
                              <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.date}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex justify-end">
                        <Button
                          onClick={handleNextStep}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!selectedCity || !selectedDate}
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact information */}
                  {step === 2 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Información de contacto</h3>

                      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {category && (
                              <div
                                className={`w-4 h-4 rounded-full ${
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
                            )}
                            <p className="text-blue-800 font-medium">{category.title}</p>
                          </div>
                          <p className="text-gray-600">{category.ageRange}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        {/* Mostrar error general si existe */}
                        {errors.submit && (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm">{errors.submit}</p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Ingrese su nombre completo"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ingrese su correo electrónico"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono de contacto</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Ingrese su número de teléfono"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Volver
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Completar inscripción"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
