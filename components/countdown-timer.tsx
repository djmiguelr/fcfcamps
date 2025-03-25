"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)

      if (difference <= 0) {
        clearInterval(interval)
        setDays(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex justify-center gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-blue-800/80 text-white text-3xl md:text-4xl font-bold w-16 md:w-20 h-16 md:h-20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
          {days}
        </div>
        <span className="text-white text-xs mt-1">Días</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-800/80 text-white text-3xl md:text-4xl font-bold w-16 md:w-20 h-16 md:h-20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
          {hours}
        </div>
        <span className="text-white text-xs mt-1">Horas</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-800/80 text-white text-3xl md:text-4xl font-bold w-16 md:w-20 h-16 md:h-20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
          {minutes}
        </div>
        <span className="text-white text-xs mt-1">Minutos</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-800/80 text-white text-3xl md:text-4xl font-bold w-16 md:w-20 h-16 md:h-20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
          {seconds}
        </div>
        <span className="text-white text-xs mt-1">Segundos</span>
      </div>
    </div>
  )
}

