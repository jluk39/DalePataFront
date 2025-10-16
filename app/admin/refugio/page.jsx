"use client"

import { useAuth } from "../../../components/backend-auth-provider.js"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Heart, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ApiService } from "../../../lib/api.js"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPets: 0,
    adoptionRequests: 0,
    adoptedPets: 0,
    pendingRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch pets data to calculate stats
        const petsData = await ApiService.getAdminPets()
        
        // Filtrar mascotas por refugio_id del usuario logueado
        const filteredPets = user?.id 
          ? petsData.filter(pet => pet.refugio_id === user.id)
          : petsData
        
        console.log('📊 Estadísticas filtradas por refugio:', {
          total: petsData.length,
          filtradas: filteredPets.length,
          refugio_id: user?.id
        })
        
        // Calculate stats from filtered pets data
        const totalPets = filteredPets.length
        const availablePets = filteredPets.filter(pet => pet.en_adopcion).length
        
        setStats({
          totalPets: totalPets,
          adoptionRequests: 0, // Will need adoption requests endpoint
          adoptedPets: 0, // Will need adoption history endpoint
          pendingRequests: 0, // Will need adoption requests endpoint
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError(error.message)
        // No mock data, just zeros
        setStats({
          totalPets: 0,
          adoptionRequests: 0,
          adoptedPets: 0,
          pendingRequests: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const statCards = [
    {
      title: "Mascotas Registradas",
      value: stats.totalPets,
      icon: Heart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Solicitudes Pendientes",
      value: stats.pendingRequests,
      icon: FileText,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Adopciones Exitosas",
      value: stats.adoptedPets,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Solicitudes",
      value: stats.adoptionRequests,
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Bienvenido, {user?.nombre || "Refugio"}</h1>
        <p className="text-muted-foreground mt-2">Gestiona tus mascotas y solicitudes de adopción desde aquí</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/refugio/mascotas">
              <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <Heart className="w-5 h-5 mr-3" />
                Agregar Nueva Mascota
              </Button>
            </Link>
            <Link href="/admin/refugio/solicitudes">
              <Button
                variant="outline"
                className="w-full justify-start border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="w-5 h-5 mr-3" />
                Ver Solicitudes Pendientes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-muted-foreground text-sm">Nueva solicitud para Max recibida</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-muted-foreground text-sm">Luna fue adoptada exitosamente</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <p className="text-muted-foreground text-sm">Solicitud para Bella pendiente de revisión</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
