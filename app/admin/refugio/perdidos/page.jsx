"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs.jsx"
import { LostPetsGridAdmin } from "../../../../components/admin/lost-pets-grid-admin.jsx"
import { MapaPerdidosAdmin } from "../../../../components/admin/mapa-perdidos-admin.jsx"
import { ApiService } from "../../../../lib/api.js"

export default function AdminPerdidosPage() {
  const [lostPets, setLostPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLostPets()
  }, [])

  const loadLostPets = async () => {
    try {
      setLoading(true)
      const data = await ApiService.fetchLostPets()
      
      // Transformar datos para incluir información de contacto
      const transformedData = data.map(pet => {
        const contacto = pet.reportado_por || pet.duenio || {}
        
        return {
          ...pet,
          name: pet.nombre || pet.name,
          species: pet.especie || pet.species,
          breed: pet.raza || pet.breed,
          description: pet.descripcion || pet.description,
          image: pet.imagen || pet.image || '/placeholder.jpg',
          location: pet.perdida_direccion || pet.location,
          lat: pet.perdida_lat || pet.lat,
          lon: pet.perdida_lon || pet.lon,
          contactName: contacto.nombre || 'No disponible',
          contactPhone: contacto.telefono || 'No disponible',
          contactEmail: contacto.email || 'No disponible',
          reportadoPorId: pet.reportado_por?.id || null,
          duenioId: pet.duenio?.id || null
        }
      })
      
      setLostPets(transformedData)
    } catch (error) {
      console.error('Error al cargar mascotas perdidas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mascotas Perdidas - Reportes</h1>
        <p className="text-muted-foreground">
          Visualiza los reportes de mascotas perdidas para contactar a los usuarios
        </p>
      </div>

      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="lista">Vista de Lista</TabsTrigger>
          <TabsTrigger value="mapa">Vista de Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <LostPetsGridAdmin loading={loading} />
        </TabsContent>

        <TabsContent value="mapa">
          {!loading && <MapaPerdidosAdmin mascotas={lostPets} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
