"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  className?: string
  children: React.ReactNode
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function CheckoutButton({ className, children, size = "default", variant = "default" }: CheckoutButtonProps) {
  const router = useRouter()

  const handleCheckout = () => {
    // Redireccionar a la página de checkout
    router.push("/checkout")

    // Si la página de checkout está en otro dominio, usar window.location
    // window.location.href = "https://ejemplo.com/checkout"
  }

  return (
    <Button onClick={handleCheckout} className={className} size={size} variant={variant}>
      {children}
    </Button>
  )
}

