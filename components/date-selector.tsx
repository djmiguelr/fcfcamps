"use client"
import { motion } from "framer-motion"
import { Calendar, Check } from "lucide-react"

interface CampDate {
  id: string
  label: string
}

interface DateSelectorProps {
  dates: CampDate[]
  selectedDate: string
  onDateChange: (date: string) => void
}

export function DateSelector({ dates, selectedDate, onDateChange }: DateSelectorProps) {
  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dates.map((date) => (
          <motion.div
            key={date.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedDate === date.id
                ? "border-yellow-400 bg-yellow-50 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
            onClick={() => onDateChange(date.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                  selectedDate === date.id ? "bg-yellow-400" : "bg-blue-100"
                }`}
              >
                <Calendar className={`h-5 w-5 ${selectedDate === date.id ? "text-blue-800" : "text-blue-600"}`} />
              </div>
              <div>
                <p className={`font-medium ${selectedDate === date.id ? "text-blue-800" : "text-gray-700"}`}>
                  {date.label}
                </p>
                <p className="text-sm text-gray-500">Cupos limitados</p>
              </div>

              {selectedDate === date.id && (
                <div className="ml-auto bg-blue-100 p-1 rounded-full">
                  <Check className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

