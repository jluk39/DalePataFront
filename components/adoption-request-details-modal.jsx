"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Separator } from "./ui/separator.jsx"
import { Home, Calendar, FileText, Heart, Clock } from "lucide-react"

export default function AdoptionRequestDetailsModal({ open, onOpenChange, request }) {
  if (!request) return null

  const formatDate = (date) => {
    if (!date) return "No registrada"
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: {
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "Pendiente"
      },
      enviada: {
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: "Enviada"
      },
      aprobada: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Aprobada"
      },
      rechazada: {
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Rechazada"
      },
      cancelada: {
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Cancelada"
      }
    }

    const config = statusConfig[status] || statusConfig.pendiente
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">Detalles de la Solicitud</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y Mascota */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={request.mascota?.imagen_url || "/placeholder.svg"}
                alt={request.mascota?.nombre}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold text-lg">{request.mascota?.nombre}</h3>
                <p className="text-muted-foreground text-sm">
                  {request.mascota?.especie} • {request.mascota?.raza}
                </p>
              </div>
            </div>
            {getStatusBadge(request.estado)}
          </div>

          <Separator />

          {/* Información de Vivienda */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Información de Vivienda
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Tipo de Vivienda</p>
                <p className="text-foreground font-medium">{request.tipo_vivienda || "No especificado"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">¿Tiene patio?</p>
                <p className="text-foreground font-medium">{request.tiene_patio || "No especificado"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">¿Es propietario?</p>
                <p className="text-foreground font-medium">{request.permiso_propietario ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Experiencia con Mascotas */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Experiencia con Mascotas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Experiencia previa</p>
                <p className="text-foreground font-medium">{request.experiencia_mascotas || "No especificado"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">¿Tiene mascotas actualmente?</p>
                <p className="text-foreground font-medium">{request.mascotas_actuales || "No especificado"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Disponibilidad */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Disponibilidad
            </h4>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Tiempo de dedicación</p>
              <p className="text-foreground font-medium">{request.tiempo_dedicacion || "No especificado"}</p>
            </div>
          </div>

          {request.razon_adopcion && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Razón de Adopción
                </h4>
                <p className="text-foreground bg-muted/50 p-4 rounded-lg">{request.razon_adopcion}</p>
              </div>
            </>
          )}

          {request.comentario && request.comentario !== request.razon_adopcion && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Comentario Adicional
                </h4>
                <p className="text-foreground bg-muted/50 p-4 rounded-lg">{request.comentario}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Fecha de Solicitud</span>
              </div>
              <p className="text-foreground font-medium">{formatDate(request.created_at)}</p>
            </div>
            {request.fecha_decision && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha de Decisión</span>
                </div>
                <p className="text-foreground font-medium">{formatDate(request.fecha_decision)}</p>
              </div>
            )}
          </div>

          {request.refugio && (
            <>
              <Separator />
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Refugio</h4>
                <p className="text-foreground">{request.refugio.nombre}</p>
              </div>
            </>
          )}

          {/* Botón Cerrar */}
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
