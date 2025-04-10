"use client"

import type React from "react"

// Corregir las comillas simples en las importaciones por comillas dobles para mantener consistencia
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, MapPin, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PreRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  city: string
  availableDates: string[]
}

export function PreRegistrationModal({ isOpen, onClose, city, availableDates }: PreRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  // Añadir estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("")

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    // Limpiar error si existe
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.category
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
      if (selectedDate) {
        setStep(2)
      } else {
        setErrors({
          ...errors,
          date: !selectedDate ? "Selecciona una fecha" : "",
        })
      }
    } else if (step === 2) {
      if (selectedCategory) {
        setStep(3)
      } else {
        setErrors({
          ...errors,
          category: !selectedCategory ? "Selecciona una categoría" : "",
        })
      }
    } else if (step === 3) {
      if (validateForm()) {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const nombreCompleto = formData.name.trim();
      const ciudadFormateada = city;
      const categoriaFormateada = selectedCategory;
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
          city,
          date: selectedDate,
          category: selectedCategory,
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
    setStep(1)
    setSelectedDate("")
    setSelectedCategory("")
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

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
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
              <h2 className="text-xl font-bold">Inscripción FCF Camps 2025</h2>
              <p className="text-blue-100">Sede {city}</p>
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
                    Estás inscrito en FCF Camps. Dentro de poco te contactaremos para finalizar el proceso de inscripción a tu hijo en los FCF Camps.
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
                      <div className={`h-1 w-6 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        2
                      </div>
                      <div className={`h-1 w-6 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        3
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Paso {step} de 3</div>
                  </div>

                  {/* Step 1: Select date */}
                  {step === 1 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Selecciona una fecha</h3>

                      {/* Asegurar que los RadioGroupItem tengan el valor correcto y estén correctamente vinculados */}
                      <div className="space-y-3 mb-6">
                        {availableDates.map((date, index) => (
                          <div
                            key={index}
                            className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                              selectedDate === date
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                            onClick={() => handleDateSelect(date)}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 ${
                                selectedDate === date ? "bg-blue-600" : "border-2 border-gray-300"
                              }`}
                            >
                              {selectedDate === date && <Check className="w-5 h-5 text-white" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <span className="cursor-pointer">{date}</span>
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

                      <div className="flex justify-end">
                        <Button
                          onClick={handleNextStep}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!selectedDate}
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Selecciona la categoría</h3>

                      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">Sede {city}</p>
                          <p className="text-gray-600">{selectedDate}</p>
                        </div>
                      </div>

                      {/* Reemplazar también el RadioGroup para la selección de categoría */}
                      <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "iniciacion"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("iniciacion")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "iniciacion" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "iniciacion" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Iniciación</span>
                              <p className="text-sm text-gray-600">6 a 9 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "preinfantil"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("preinfantil")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "preinfantil" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "preinfantil" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-black"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Pre Infantil</span>
                              <p className="text-sm text-gray-600">10 a 11 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "infantil"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("infantil")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "infantil" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "infantil" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-700"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Infantil</span>
                              <p className="text-sm text-gray-600">12 a 13 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "prejuvenil-femenino"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("prejuvenil-femenino")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "prejuvenil-femenino" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "prejuvenil-femenino" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Pre Juvenil Femenino</span>
                              <p className="text-sm text-gray-600">14 a 15 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "prejuvenil-masculino"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("prejuvenil-masculino")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "prejuvenil-masculino" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "prejuvenil-masculino" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-600"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Pre Juvenil Masculino</span>
                              <p className="text-sm text-gray-600">14 a 15 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "juvenil-femenino"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("juvenil-femenino")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "juvenil-femenino" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "juvenil-femenino" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-sky-400"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Juvenil Femenino</span>
                              <p className="text-sm text-gray-600">16 a 17 años</p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`border-2 rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all ${
                            selectedCategory === "juvenil-masculino"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => handleCategorySelect("juvenil-masculino")}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex-shrink-0 ${
                              selectedCategory === "juvenil-masculino" ? "bg-blue-600" : "border-2 border-gray-300"
                            }`}
                          >
                            {selectedCategory === "juvenil-masculino" && <Check className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-900"></div>
                            <div>
                              <span className="font-medium cursor-pointer">Juvenil Masculino</span>
                              <p className="text-sm text-gray-600">16 a 17 años</p>
                            </div>
                          </div>
                        </div>

                        {errors.category && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Volver
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!selectedCategory}
                        >
                          Continuar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Contact information */}
                  {step === 3 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Información de contacto</h3>

                      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">Sede {city}</p>
                          <p className="text-gray-600">{selectedDate}</p>
                          <p className="text-gray-600">Categoría: {selectedCategory}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
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
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Volver
                        </Button>
                        {/* Asegurar que el componente maneje correctamente el estado de isSubmitting */}
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
