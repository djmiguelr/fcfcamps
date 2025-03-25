import type { ReactNode } from "react"

export function BenefitCard({
  icon,
  title,
  description,
  color = "bg-blue-700",
}: {
  icon: ReactNode
  title: string
  description: string
  color?: string
}) {
  return (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg transform transition-transform hover:scale-105`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-yellow-400">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

