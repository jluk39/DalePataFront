"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"
import { Button } from "../ui/button.jsx"
import { MapPin, Calendar, Phone, Mail, MessageCircle } from "lucide-react"
import { ApiService } from "../../lib/api.js"
import { Loader2 } from "lucide-react"

/**
 * Componente de Grid para Admin - Vista de solo lectura
 * No incluye funcionalidades de reportar, marcar como encontrado o eliminar
 */
export function LostPetsGridAdmin({ loading: parentLoading }) {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLostPets()
  }, [])

  const loadLostPets = async () => {
    try {
      setLoading(true)
      const data = await ApiService.fetchLostPets()
      console.log('✅ Mascotas perdidas cargadas (Admin):', data)
      
      const transformedData = data.map(pet => {
        const contacto = pet.reportado_por || pet.duenio || {}
        
        return {
          id: pet.id.toString(),
          name: pet.nombre || pet.name,
          type: pet.especie || pet.species,
          breed: pet.raza || pet.breed || 'Raza no especificada',
          age: pet.edad || pet.age || 'Edad desconocida',
          gender: pet.genero || pet.sexo || pet.gender || 'No especificado',
          color: pet.color || 'Color no especificado',
          size: pet.tamaño || 'Tamaño no especificado',
          description: pet.descripcion || pet.description || 'Sin descripción',
          image: pet.imagen || pet.image || '/placeholder.jpg',
          location: pet.perdida_direccion || pet.location,
          lastSeen: pet.perdida_fecha || pet.lostDate,
          contactName: contacto.nombre || 'No disponible',
          contactPhone: contacto.telefono || 'No disponible',
          contactEmail: contacto.email || 'No disponible',
          status: 'lost',
          lat: pet.perdida_lat || pet.lat,
          lon: pet.perdida_lon || pet.lon
        }
      })
      
      setPets(transformedData)
    } catch (error) {
      console.error('Error al cargar mascotas perdidas:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading || parentLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando mascotas perdidas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {error}</p>
        <button 
          onClick={loadLostPets}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay mascotas perdidas reportadas en este momento</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground">{pets.length} mascotas perdidas reportadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 left-2">
                <Badge className="bg-destructive">Perdido</Badge>
              </div>
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
                  Perdido el {formatDate(pet.lastSeen)}
                </div>
              </div>

              <p className="text-sm text-foreground mb-4 line-clamp-2">{pet.description}</p>

              <div className="space-y-2">
                <p className="text-sm font-medium">Contacto: {pet.contactName}</p>
                
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
