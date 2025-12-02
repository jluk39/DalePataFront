"use client"

import { useState, useEffect } from 'react'
import { ApiService } from '../../lib/api.js'
import { Bell, Check, CheckCheck, AlertCircle, PartyPopper } from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../../components/sidebar.js'
import { Header } from '../../components/header.js'
import UserProtectedRoute from '../../components/user/user-protected-route.jsx'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await ApiService.getVirtualNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (solicitudId) => {
    ApiService.markNotificationAsRead(solicitudId)
    // Actualizar el estado local inmediatamente
    setNotifications(prev =>
      prev.map(n => n.solicitudId === solicitudId ? { ...n, leida: true } : n)
    )
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.solicitudId)
    ApiService.markAllNotificationsAsRead(allIds)
    // Actualizar el estado local inmediatamente
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })))
  }

  const goToRequest = (solicitudId) => {
    // Marcar como leída antes de navegar
    markAsRead(solicitudId)
    // Pequeño delay para asegurar que se guarde en localStorage
    setTimeout(() => {
      router.push('/seguimiento')
    }, 100)
  }

  if (loading) {
    return (
      <UserProtectedRoute>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </main>
          </div>
        </div>
      </UserProtectedRoute>
    )
  }

  return (
    <UserProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Notificaciones</h1>
                  <p className="text-muted-foreground mt-1">
                    {notifications.length === 0 
                      ? 'No tienes notificaciones' 
                      : `${notifications.filter(n => !n.leida).length} sin leer`
                    }
                  </p>
                </div>
                {notifications.length > 0 && notifications.some(n => !n.leida) && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm">
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Marcar todas como leídas
                  </Button>
                )}
              </div>

              {notifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No hay notificaciones</h3>
                  <p className="text-muted-foreground">
                    Te notificaremos cuando haya novedades en tus solicitudes de adopción
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notifications.map(notif => (
                    <Card 
                      key={notif.id}
                      className={`transition-all cursor-pointer hover:shadow-md ${
                        !notif.leida 
                          ? 'bg-blue-50 border-blue-200 border-l-4 hover:bg-blue-100' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => goToRequest(notif.solicitudId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full flex-shrink-0 ${
                            notif.estado === 'aprobada' 
                              ? 'bg-green-100' 
                              : 'bg-red-100'
                          }`}>
                            {notif.estado === 'aprobada' ? (
                              <PartyPopper className="w-6 h-6 text-green-600" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-base ${!notif.leida ? 'font-bold' : 'font-medium'}`}>
                              {notif.estado === 'aprobada' 
                                ? `¡Felicitaciones! Tu solicitud de adopción para ${notif.mascota} ha sido aprobada.`
                                : `Tu solicitud de adopción para ${notif.mascota} ha sido rechazada.`
                              }
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {new Date(notif.fecha).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'America/Argentina/Buenos_Aires'
                              })}
                            </p>
                            {notif.estado === 'aprobada' && (
                              <p className="text-sm text-green-700 mt-2 font-medium">
                                👉 Haz clic para ver los detalles
                              </p>
                            )}
                          </div>

                          {!notif.leida && (
                            <div className="flex-shrink-0">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </UserProtectedRoute>
  )
}
