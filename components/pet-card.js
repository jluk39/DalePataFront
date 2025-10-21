"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Edit2, Trash2 } from "lucide-react"
import { useAuth } from "./backend-auth-provider.js"
import { ApiService } from "../lib/api.js"
import EditPetModal from "./admin/edit-pet-modal.jsx"

export function PetCard({ pet, showFavoriteButton = true, showOwnerActions = false, onPetDeleted, onPetUpdated }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // Here you would typically make an API call to save/remove the favorite
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    setShowEditModal(true)
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation()
    
    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}? Esta acción no se puede deshacer.`)
    
    if (!confirmed) return
    
    setDeleting(true)
    
    try {
      await ApiService.deletePet(pet.id)
      
      // Notificar al componente padre
      if (onPetDeleted) {
        onPetDeleted(pet.id)
      }
      
      alert(`✅ ${pet.name} ha sido eliminado exitosamente`)
      
      // Recargar página para mostrar cambios
      window.location.reload()
      
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert(`❌ Error al eliminar a ${pet.name}: ${error.message}`)
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
        
        {/* Botones en la esquina superior derecha */}
        <div className="absolute top-2 right-2 flex gap-1">
          {showOwnerActions && user && (
            <>
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

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{pet.location || "Buenos Aires"}</span>
          </div>

          {pet.shelter && (
            <div className="text-sm text-muted-foreground">
              <strong>Refugio:</strong> {pet.shelter}
            </div>
          )}

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
            {pet.isOwned ? 
              `Tu mascota ${pet.species?.toLowerCase()} adoptada ${pet.adoptionDate ? `el ${pet.adoptionDate}` : ''}` :
              `${pet.species} en busca de un hogar lleno de amor`
            }
          </p>
        </div>
      </CardContent>
      
      {/* Modal de edición */}
      {showEditModal && (
        <EditPetModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          pet={pet}
          onPetUpdated={onPetUpdated}
        />
      )}
    </Card>
  )
}






