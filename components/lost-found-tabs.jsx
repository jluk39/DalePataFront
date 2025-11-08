"use client"
import { Button } from "./ui/button.jsx"
import { Plus } from "lucide-react"
import { LostPetsGrid } from "./lost-pets-grid.jsx"
import Link from "next/link"

export function LostFoundTabs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mascotas Perdidas</h2>
          <p className="text-muted-foreground mt-1">
            Ayuda a reunir mascotas con sus familias
          </p>
        </div>
        <Link href="/perdidos/reportar">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Reportar Avistamiento
          </Button>
        </Link>
      </div>

      <LostPetsGrid />
    </div>
  )
}






