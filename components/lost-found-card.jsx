"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { MapPin, Calendar, Phone, Mail, AlertTriangle, Gift, MessageCircle, Trash2 } from "lucide-react"
import { useAuth } from "./backend-auth-provider.js"
import { ApiService } from "../lib/api.js"
import { showSuccess, showError, showConfirm } from "../lib/sweetalert.js"

export function LostFoundCard({ pet }) {
  const { user } = useAuth()
  const [deleting, setDeleting] = useState(false)
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Verificar si el usuario puede eliminar este reporte
  // Solo puede eliminar si:
  // 1. La mascota NO tiene dueño (duenioId === null)
  // 2. El usuario reportó la mascota (reportadoPorId === user.id)
  const canDelete = user && !pet.duenioId && pet.reportadoPorId === user.id

  // Verificar si la mascota tiene dueño y es del usuario logueado
  const isOwner = user && pet.duenioId && pet.duenioId === user.id

  const handleDeleteReport = async (e) => {
    e.stopPropagation()
    
    const confirmed = await showConfirm(
      '¿Eliminar reporte?',
      `¿Estás seguro de que quieres eliminar el reporte de ${pet.name}? Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    )
    
    if (!confirmed) return
    
    setDeleting(true)
    
    try {
      await ApiService.deleteLostPetReport(pet.id)
      
      await showSuccess('Reporte eliminado', `El reporte de ${pet.name} ha sido eliminado exitosamente.`)
      
      // Recargar página para actualizar la lista
      window.location.reload()
      
    } catch (error) {
      console.error('Error deleting report:', error)
      showError('Error al eliminar el reporte', error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={pet.status === "lost" ? "bg-destructive" : "bg-primary"}>
            {pet.status === "lost" ? "Perdido" : "Encontrado"}
          </Badge>
          {pet.urgent && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Urgente
            </Badge>
          )}
        </div>
        {pet.reward && (
          <Badge className="absolute top-2 right-2 bg-green-600 text-white">
            <Gift className="h-3 w-3 mr-1" />
            Recompensa
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <p className="text-sm text-muted-foreground">
            {pet.breed} • {pet.age} • {pet.gender}
          </p>
          <p className="text-sm text-muted-foreground">
            {pet.color} • {pet.size}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-2" />
            {pet.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" />
            {pet.status === "lost" ? "Perdido el" : "Encontrado el"} {formatDate(pet.lastSeen)}
          </div>
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-2">{pet.description}</p>

        {pet.reward && (
          <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">Recompensa</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Contacto: {pet.contactName}</p>
          
          {/* Botón para redirigir a Mis Mascotas si es dueño */}
          {isOwner && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 mb-2">
                Esta es tu mascota. Para marcarla como encontrada o eliminarla, ve a:
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Ir a Mis Mascotas
              </Button>
            </div>
          )}
          
          {/* Botones de contacto - Solo si NO es dueño */}
          {!isOwner && (
            <div className="flex gap-2">
              {pet.contactPhone && pet.contactPhone !== 'No disponible' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`https://wa.me/${pet.contactPhone.replace(/\D/g, '')}`, '_blank')}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  WhatsApp
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 opacity-50" 
                  disabled
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Sin teléfono
                </Button>
              )}
              {pet.contactEmail && pet.contactEmail !== 'No disponible' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`mailto:${pet.contactEmail}`, '_blank')}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 opacity-50" 
                  disabled
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Sin email
                </Button>
              )}
            </div>
          )}
          
          {/* Botón de eliminar reporte - Solo visible para el usuario que reportó y si no tiene dueño */}
          {canDelete && (
            <Button
              onClick={handleDeleteReport}
              disabled={deleting}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar mi reporte
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}







