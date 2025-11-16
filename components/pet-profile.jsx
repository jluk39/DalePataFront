"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { MapPin, Calendar, Share2, Loader2 } from "lucide-react"
import { Button } from "./ui/button.jsx"
import { ApiService } from "../lib/api.js"
import { showSuccess, showError } from "../lib/sweetalert.js"

export function PetProfile({ petId }) {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleShare = async () => {
    const url = window.location.href
    
    try {
      await navigator.clipboard.writeText(url)
      showSuccess('¡Copiado!', 'Enlace copiado al portapapeles')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      showError('Error', 'No se pudo copiar el enlace')
    }
  }

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const petData = await ApiService.fetchPetById(petId)
        setPet(petData)
      } catch (error) {
        console.error('Error fetching pet details:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (petId) {
      fetchPetDetails()
    }
  }, [petId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando información de la mascota...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-red-500 mb-4">Error al cargar los datos de la mascota</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">No se encontró información de esta mascota</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Photo and Basic Info */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={pet.image || "/placeholder.svg"}
              alt={pet.name}
              className="w-full h-80 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="icon" onClick={handleShare} title="Compartir enlace">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {pet.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Rescatado el {pet.rescueDate}
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {pet.status}
              </Badge>
            </div>

            <p className="text-foreground leading-relaxed">{pet.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Características */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Edad</p>
              <p className="font-medium">{pet.age}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Especie</p>
              <p className="font-medium">{pet.species}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexo</p>
              <p className="font-medium">{pet.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Castrado</p>
              <p className="font-medium">{pet.sterilized ? 'Sí' : 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamaño</p>
              <p className="font-medium">{pet.size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{pet.color}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalidad */}
      {pet.personality && pet.personality.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personalidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pet.personality.map((trait) => (
                <Badge key={trait} variant="outline">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial Médico */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Salud</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pet.medicalHistory && pet.medicalHistory.length > 0 ? (
              pet.medicalHistory.map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {item}
                </li>
              ))
            ) : (
              <p className="text-muted-foreground">No hay información médica disponible</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Información de Contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Refugio</p>
              <p className="font-medium">{pet.shelter}</p>
            </div>
            {pet.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{pet.phone}</p>
              </div>
            )}
            {pet.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{pet.email}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requisitos - Solo mostrar si hay datos */}
      {pet.requirements && pet.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Requisitos para Adopción</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pet.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  {requirement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}







