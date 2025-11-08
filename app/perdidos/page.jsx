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
      setLostPets(data)
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







