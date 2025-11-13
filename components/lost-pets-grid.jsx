"use client"

import { useEffect, useState } from "react"
import { LostFoundCard } from "./lost-found-card.jsx"
import { ApiService } from "../lib/api.js"
import { Loader2 } from "lucide-react"

export function LostPetsGrid() {
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
      console.log('✅ Mascotas perdidas cargadas:', data)
      
      // Transformar datos para el componente LostFoundCard
      const transformedData = data.map(pet => ({
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
        contactName: pet.reportado_por?.nombre || pet.duenio?.nombre || 'No disponible',
        contactPhone: pet.reportado_por?.telefono || pet.duenio?.telefono || 'No disponible',
        contactEmail: pet.reportado_por?.email || 'No disponible',
        status: 'lost',
        lat: pet.perdida_lat || pet.lat,
        lon: pet.perdida_lon || pet.lon
      }))
      
      setPets(transformedData)
    } catch (error) {
      console.error('Error al cargar mascotas perdidas:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
          <LostFoundCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}







