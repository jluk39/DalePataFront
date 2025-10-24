"use client"

import { useAuth } from "../../../components/backend-auth-provider.js"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Heart, FileText, TrendingUp, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ApiService } from "../../../lib/api.js"
export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    recentPets: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch pets data to calculate stats
        const petsData = await ApiService.getAdminPets()
        
        // Las mascotas ya vienen filtradas por el usuario logueado desde el backend
        const filteredPets = petsData
        
        // Fetch adoption requests (with error handling)
        let adoptionRequestsData = []
        try {
          adoptionRequestsData = await ApiService.getAdoptionRequests()
        } catch (error) {
          console.warn('No se pudieron cargar las solicitudes de adopción:', error)
          adoptionRequestsData = []
        }
        
        console.log('🏠 Mascotas del refugio:', filteredPets.length)
        
        // Calculate real stats from pets data
        const totalPets = filteredPets.length
        const availablePets = filteredPets.filter(pet => pet.en_adopcion).length
        const adoptedPets = filteredPets.filter(pet => !pet.en_adopcion).length
        
        // Mascotas registradas en los últimos 30 días
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const recentPets = filteredPets.filter(pet => {
          const createdDate = new Date(pet.created_at)
          return createdDate >= thirtyDaysAgo
        }).length
        
        // Calculate adoption requests stats
        const totalRequests = adoptionRequestsData?.length || 0
        const pendingRequests = adoptionRequestsData?.filter(req => req.estado === 'pendiente')?.length || 0
        
        setStats({
          totalPets: totalPets,
          availablePets: availablePets,
          adoptedPets: adoptedPets,
          recentPets: recentPets,
          totalRequests: totalRequests,
          pendingRequests: pendingRequests,
        })
        
        // Generate recent activity from actual pets data
        const activity = []
        
        // Últimas mascotas registradas (máximo 3)
        const recentRegistrations = filteredPets
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
        
        recentRegistrations.forEach(pet => {
          const daysAgo = Math.floor((new Date() - new Date(pet.created_at)) / (1000 * 60 * 60 * 24))
          let timeText = 'hoy'
          if (daysAgo === 1) timeText = 'ayer'
          else if (daysAgo > 1) timeText = `hace ${daysAgo} días`
          
          activity.push({
            type: 'registration',
            message: `${pet.nombre} fue registrado ${timeText}`,
            color: 'bg-blue-400',
            time: timeText
          })
        })
        
        // Últimas solicitudes de adopción (máximo 2)
        const recentRequests = (adoptionRequestsData || [])
          .sort((a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud))
          .slice(0, 2)
        
        recentRequests.forEach(request => {
          const daysAgo = Math.floor((new Date() - new Date(request.fecha_solicitud)) / (1000 * 60 * 60 * 24))
          let timeText = 'hoy'
          if (daysAgo === 1) timeText = 'ayer'
          else if (daysAgo > 1) timeText = `hace ${daysAgo} días`
          
          activity.push({
            type: 'request',
            message: `Nueva solicitud para adopción recibida ${timeText}`,
            color: 'bg-green-400',
            time: timeText
          })
        })
        
        // Agregar información sobre adopciones si hay mascotas adoptadas
        if (adoptedPets > 0) {
          activity.push({
            type: 'adoption',
            message: `${adoptedPets} mascota${adoptedPets > 1 ? 's' : ''} en proceso de adopción`,
            color: 'bg-green-400',
            time: 'actual'
          })
        }
        
        // Agregar información sobre disponibilidad
        if (availablePets > 0) {
          activity.push({
            type: 'available',
            message: `${availablePets} mascota${availablePets > 1 ? 's' : ''} disponible${availablePets > 1 ? 's' : ''} para adopción`,
            color: 'bg-primary',
            time: 'actual'
          })
        }
        
        // Si no hay actividad, mostrar mensaje motivacional
        if (activity.length === 0) {
          activity.push({
            type: 'info',
            message: '¡Registra tu primera mascota para empezar!',
            color: 'bg-accent',
            time: ''
          })
        }
        
        setRecentActivity(activity.slice(0, 4)) // Máximo 4 actividades
      } catch (error) {
        console.error('Error fetching stats:', error)
        setError(error.message)
        // Set empty stats on error
        setStats({
          totalPets: 0,
          availablePets: 0,
          adoptedPets: 0,
          recentPets: 0,
        })
        setRecentActivity([{
          type: 'error',
          message: 'Error al cargar datos del refugio',
          color: 'bg-red-400',
          time: ''
        }])
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
      subtitle: "Total en tu refugio"
    },
    {
      title: "Disponibles para Adopción",
      value: stats.availablePets,
      icon: Heart,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      subtitle: "Buscando hogar"
    },
    {
      title: "En Proceso de Adopción",
      value: stats.adoptedPets,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      subtitle: "Adoptadas o en cuidado"
    },
    {
      title: "Registradas Recientemente",
      value: stats.recentPets,
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      subtitle: "Últimos 30 días"
    },
    {
      title: "Solicitudes de Adopción",
      value: stats.totalRequests || 0,
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      subtitle: "Total recibidas"
    },
    {
      title: "Solicitudes Pendientes",
      value: stats.pendingRequests || 0,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      subtitle: "Por revisar"
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
                    <p className="text-3xl font-bold text-foreground mt-2">{loading ? '...' : stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    )}
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
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm">{activity.message}</p>
                      {activity.time && (
                        <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No hay actividad reciente</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registra mascotas para ver actividad aquí
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
