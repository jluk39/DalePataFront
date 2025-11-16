"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { LostFoundTabs } from "../../components/lost-found-tabs.jsx"
import { MapaPerdidos } from "../../components/mapa-perdidos.jsx"
import UserProtectedRoute from "../../components/user/user-protected-route.jsx"
import { ApiService } from "../../lib/api.js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.jsx"

export default function PerdidosPage() {
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
        // Determinar contacto (prioridad: reportado_por > duenio)
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
    <UserProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Mascotas Perdidas y Encontradas</h1>
              <p className="text-muted-foreground">Ayuda a reunir mascotas con sus familias</p>
            </div>

            <Tabs defaultValue="lista" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="lista">Vista de Lista</TabsTrigger>
                <TabsTrigger value="mapa">Vista de Mapa</TabsTrigger>
              </TabsList>

              <TabsContent value="lista">
                <LostFoundTabs />
              </TabsContent>

              <TabsContent value="mapa">
                {!loading && <MapaPerdidos mascotas={lostPets} />}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </UserProtectedRoute>
  )
}







