"use client"

import { useEffect, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  suffix?: string
}

export function AnimatedNumber({ value, duration = 2000, suffix = "" }: AnimatedNumberProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const incrementTime = (duration / end) * 1000

    // Don't run if value is zero
    if (end === 0) {
      setCount(0)
      return
    }

    // Timer to increment counter
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => {
      clearInterval(timer)
    }
  }, [value, duration])

  return (
    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
      {count}
      {suffix}
    </div>
  )
}

