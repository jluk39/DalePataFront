"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Edit2, Trash2, AlertCircle } from "lucide-react"
import { useAuth } from "./backend-auth-provider.js"
import { ApiService } from "../lib/api.js"
import EditPetModal from "./admin/edit-pet-modal.jsx"
import UserEditPetModal from "./user/user-edit-pet-modal.jsx"
import { ReportLostModal } from "./report-lost-modal.jsx"
import { showSuccess, showError, showConfirm } from "../lib/sweetalert.js"

export function PetCard({ pet, showFavoriteButton = true, showOwnerActions = false, onPetDeleted, onPetUpdated, useUserModals = false }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showReportLostModal, setShowReportLostModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [markingAsFound, setMarkingAsFound] = useState(false)

  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // Here you would typically make an API call to save/remove the favorite
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setShowEditModal(true)
  }

  const handleMarkAsFoundClick = async (e) => {
    e.stopPropagation()
    
    const confirmed = await showConfirm(
      '¿Confirmar que fue encontrada?',
      `¿Confirmas que ${pet.name} ha sido encontrada? Esto actualizará el estado de la mascota y notificará que ya no está perdida.`,
      'Sí, marcar como encontrada',
      'Cancelar'
    )
    
    if (!confirmed) return
    
    setMarkingAsFound(true)
    
    try {
      await ApiService.markPetAsFound(pet.id, 'Mascota encontrada por el dueño')
      
      await showSuccess('¡Qué buena noticia!', `${pet.name} ha sido marcada como encontrada.`)
      
      // Recargar página para actualizar el estado
      window.location.reload()
      
    } catch (error) {
      console.error('Error marking pet as found:', error)
      showError('Error al marcar como encontrada', error.message)
    } finally {
      setMarkingAsFound(false)
    }
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation()
    
    const confirmed = await showConfirm(
      '¿Eliminar mascota?',
      `¿Estás seguro de que quieres eliminar a ${pet.name}? Esta acción no se puede deshacer.`,
      'Sí, eliminar',
      'Cancelar'
    )
    
    if (!confirmed) return
    
    setDeleting(true)
    
    try {
      await ApiService.deletePet(pet.id)
      
      // Notificar al componente padre
      if (onPetDeleted) {
        onPetDeleted(pet.id)
      }
      
      await showSuccess('Eliminado', `${pet.name} ha sido eliminado exitosamente`)
      
      // Recargar página para mostrar cambios
      window.location.reload()
      
    } catch (error) {
      console.error('Error deleting pet:', error)
      showError('Error al eliminar', error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={pet.image || "/placeholder.svg?height=200&width=200&query=cute pet"}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        {pet.urgent && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Urgente</Badge>}
        {pet.isLost && <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Perdida</Badge>}
        
        {/* Botones en la esquina superior derecha */}
        <div className="absolute top-2 right-2 flex gap-1">
          {showOwnerActions && user && (
            <>
              {/* Solo mostrar botón de reportar perdida si NO está perdida */}
              {!pet.isLost && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-white/80 hover:bg-white"
                  onClick={() => setShowReportLostModal(true)}
                  title="Reportar como perdida"
                >
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-white/80 hover:bg-white"
                onClick={handleEditClick}
                title="Editar mascota"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-white/80 hover:bg-white"
                onClick={handleDeleteClick}
                disabled={deleting}
                title="Eliminar mascota"
              >
                <Trash2 className={`w-4 h-4 ${deleting ? 'text-gray-400' : 'text-red-600'}`} />
              </Button>
            </>
          )}
          
          {showFavoriteButton && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-white/80 hover:bg-white"
              onClick={toggleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
              />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.age} • {pet.gender}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {pet.vaccinated && (
              <Badge variant="secondary" className="text-xs">
                Vacunado
              </Badge>
            )}
            {pet.sterilized && (
              <Badge variant="secondary" className="text-xs">
                Castrado
              </Badge>
            )}
            {pet.healthStatus && (
              <Badge variant="outline" className="text-xs">
                {pet.healthStatus}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {pet.description || "Aún no hay una descripción. Puedes agregar una editando la mascota"}
          </p>

          {/* Botón grande de "Marcar como encontrada" solo si está perdida */}
          {showOwnerActions && pet.isLost && (
            <Button
              onClick={handleMarkAsFoundClick}
              disabled={markingAsFound}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {markingAsFound ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Marcando...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Marcar como Encontrada
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Modal de edición */}
      {showEditModal && (
        useUserModals ? (
          <UserEditPetModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            pet={pet}
            onPetUpdated={onPetUpdated}
          />
        ) : (
          <EditPetModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            pet={pet}
            onPetUpdated={onPetUpdated}
          />
        )
      )}

      {/* Modal para reportar como perdida */}
      {showOwnerActions && (
        <ReportLostModal
          pet={pet}
          open={showReportLostModal}
          onOpenChange={setShowReportLostModal}
          onSuccess={() => {
            // Opcionalmente recargar la lista o mostrar un mensaje
            console.log('Mascota reportada como perdida exitosamente')
          }}
        />
      )}
    </Card>
  )
}






