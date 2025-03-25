"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Ball {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  delay: number
}

export function FloatingBalls() {
  const [balls, setBalls] = useState<Ball[]>([])

  useEffect(() => {
    // Create random balls
    const newBalls = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      speed: 15 + Math.random() * 25,
      opacity: 0.1 + Math.random() * 0.2,
      delay: Math.random() * 5,
    }))

    setBalls(newBalls)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute animate-float"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            animationDuration: `${ball.speed}s`,
            animationDelay: `${ball.delay}s`,
            opacity: ball.opacity,
          }}
        >
          <Image
            src="/placeholder.svg?height=100&width=100"
            alt="Soccer ball"
            width={ball.size}
            height={ball.size}
            className="rounded-full"
          />
        </div>
      ))}
    </div>
  )
}

