"use client"

import { Button } from "./ui/button.jsx"
import { Heart, Calendar, Stethoscope } from "lucide-react"

export function MedicalRecordsTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "mis-mascotas",
      label: "Mis Mascotas",
      icon: Heart,
    },
    {
      id: "historial",
      label: "Historial Médico",
      icon: Stethoscope,
    },
    {
      id: "vacunas",
      label: "Vacunas",
      icon: Calendar,
    },
  ]

  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 rounded-b-none"
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}






