"use client"

import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Stethoscope } from "lucide-react"

export function FavoritesTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "mascotas",
      label: "Mascotas",
      icon: Heart,
    },
    {
      id: "perdidos",
      label: "Perdidos",
      icon: MapPin,
    },
    {
      id: "veterinarias",
      label: "Veterinarias",
      icon: Stethoscope,
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






