"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { Calendar, Heart, Activity, Ruler, Weight } from "lucide-react"

export default function ViewPetModal({ open, onOpenChange, pet }) {
  if (!pet) return null

  const formatDate = (date) => {
    if (!date) return "No registrada"
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (enAdopcion) => {
    if (enAdopcion) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponible para adopción</Badge>
    } else {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">No disponible</Badge>
    }
  }

  const getHealthBadge = (estado) => {
    if (estado === "Saludable") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Saludable</Badge>
    } else if (estado === "En tratamiento") {
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">En tratamiento</Badge>
    } else if (estado === "Recuperándose") {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Recuperándose</Badge>
    } else {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{estado}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">Detalles de {pet.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagen */}
          {(pet.imagen_url || pet.image) && (
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={pet.imagen_url || pet.image || "/placeholder.svg"}
                alt={pet.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Nombre</p>
              <p className="text-foreground font-semibold">{pet.nombre}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Sexo</p>
              <p className="text-foreground font-semibold">{pet.sexo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Especie</p>
              <p className="text-foreground font-semibold">{pet.especie}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Raza</p>
              <p className="text-foreground font-semibold">{pet.raza || "No especificada"}</p>
            </div>
          </div>

          {/* Características físicas */}
          <div className="grid grid-cols-3 gap-4">
            {pet.tamaño && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Ruler className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Tamaño</p>
                  <p className="text-foreground font-medium">{pet.tamaño}</p>
                </div>
              </div>
            )}
            {pet.peso && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Weight className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Peso</p>
                  <p className="text-foreground font-medium">{pet.peso} kg</p>
                </div>
              </div>
            )}
            {pet.color && (
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-border" style={{ backgroundColor: pet.color.toLowerCase() }}></div>
                <div>
                  <p className="text-muted-foreground text-xs">Color</p>
                  <p className="text-foreground font-medium">{pet.color}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          {pet.descripcion && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Descripción</p>
              <p className="text-foreground bg-muted/50 p-4 rounded-lg">{pet.descripcion}</p>
            </div>
          )}

          {/* Estado de salud */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Estado de salud</p>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              {getHealthBadge(pet.estado_salud)}
            </div>
          </div>

          {/* Estado de adopción */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Estado de adopción</p>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              {getStatusBadge(pet.en_adopcion)}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>Fecha de nacimiento</span>
              </div>
              <p className="text-foreground font-medium">{formatDate(pet.fecha_nacimiento)}</p>
              {pet.edad_anios && (
                <p className="text-muted-foreground text-sm">({pet.edad_anios})</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>Fecha de registro</span>
              </div>
              <p className="text-foreground font-medium">{formatDate(pet.created_at)}</p>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
