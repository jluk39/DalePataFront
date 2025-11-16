"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "../../components/ui/card.jsx"
import { Badge } from "../../components/ui/badge.jsx"
import { Button } from "../../components/ui/button.jsx"
import { Input } from "../../components/ui/input.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx"
import { showSuccess, showError } from "../../lib/sweetalert.js"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.jsx"
import { Search, Eye, XCircle, Calendar, Clock, Heart, Loader2 } from "lucide-react"
import AdoptionRequestDetailsModal from "../../components/adoption-request-details-modal.jsx"
import UserProtectedRoute from "../../components/user/user-protected-route.jsx"
import { useAuth } from "../../components/backend-auth-provider.js"
import { ApiService } from "../../lib/api.js"
import Link from "next/link"

export default function SeguimientoPage() {
  const { user, loading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [requestToCancel, setRequestToCancel] = useState(null)

  useEffect(() => {
    if (user) {
      fetchRequests()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getMyAdoptionRequests()
      setRequests(data)
    } catch (error) {
      console.error("Error fetching adoption requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const handleCancelClick = (request) => {
    setRequestToCancel(request)
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (!requestToCancel) return

    try {
      await ApiService.cancelAdoptionRequest(requestToCancel.id)
      
      // Actualizar el estado local
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestToCancel.id ? { ...req, estado: "cancelada" } : req
        )
      )

      setShowCancelDialog(false)
      setRequestToCancel(null)
      await showSuccess('¡Cancelada!', 'Solicitud cancelada exitosamente')
    } catch (error) {
      console.error("Error canceling request:", error)
      await showError('Error', `Error al cancelar la solicitud: ${error.message}`)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendiente: {
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "Pendiente"
      },
      enviada: {
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: "Enviada"
      },
      aprobada: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Aprobada"
      },
      rechazada: {
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Rechazada"
      },
      cancelada: {
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Cancelada"
      }
    }

    const config = statusConfig[status] || statusConfig.pendiente
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (date) => {
    if (!date) return "Sin fecha"
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.mascota?.nombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" || request.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: requests.length,
    pendientes: requests.filter(r => r.estado === "pendiente" || r.estado === "enviada").length,
    aprobadas: requests.filter(r => r.estado === "aprobada").length,
    rechazadas: requests.filter(r => r.estado === "rechazada").length,
  }

  if (authLoading || loading) {
    return (
      <UserProtectedRoute>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Cargando solicitudes...</p>
              </div>
            </main>
          </div>
        </div>
      </UserProtectedRoute>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center max-w-md">
              <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver el estado de tus solicitudes</p>
              <Button asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <UserProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Seguimiento de Solicitudes</h1>
                <p className="text-muted-foreground">Rastrea el estado de tus solicitudes de adopción</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Total</p>
                        <p className="text-foreground font-semibold text-xl">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Pendientes</p>
                        <p className="text-foreground font-semibold text-xl">{stats.pendientes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Heart className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Aprobadas</p>
                        <p className="text-foreground font-semibold text-xl">{stats.aprobadas}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Rechazadas</p>
                        <p className="text-foreground font-semibold text-xl">{stats.rechazadas}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Buscar por nombre de mascota o solicitante..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground"
                        />
                      </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48 bg-background border-border text-foreground">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="pendiente">Pendientes</SelectItem>
                        <SelectItem value="enviada">Enviadas</SelectItem>
                        <SelectItem value="aprobada">Aprobadas</SelectItem>
                        <SelectItem value="rechazada">Rechazadas</SelectItem>
                        <SelectItem value="cancelada">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Requests List */}
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-12">
                      <div className="text-center">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay solicitudes</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || filterStatus !== "all"
                            ? "No se encontraron solicitudes con los filtros aplicados"
                            : "Aún no has enviado ninguna solicitud de adopción"}
                        </p>
                        {!searchTerm && filterStatus === "all" && (
                          <Button onClick={() => (window.location.href = "/adoptar")}>
                            Explorar Mascotas
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredRequests.map((request) => (
                    <Card key={request.id} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Pet Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={request.mascota?.imagen_url || "/placeholder.svg"}
                              alt={request.mascota?.nombre}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-foreground">
                                  {request.mascota?.nombre}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {request.mascota?.especie} • {request.mascota?.raza}
                                </p>
                              </div>
                              {getStatusBadge(request.estado)}
                            </div>

                            {/* Request Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Enviada: <span className="text-foreground">{formatDate(request.created_at)}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Refugio: <span className="text-foreground">{request.refugio?.nombre || "No especificado"}</span>
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(request)}
                              >
                                <Eye className="w-3 h-3 mr-2" />
                                Ver Detalles
                              </Button>
                              {(request.estado === "pendiente" || request.estado === "enviada") && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelClick(request)}
                                >
                                  <XCircle className="w-3 h-3 mr-2" />
                                  Cancelar Solicitud
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Details Modal */}
      <AdoptionRequestDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        request={selectedRequest}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">¿Cancelar solicitud?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              ¿Estás seguro de que deseas cancelar la solicitud de adopción de{" "}
              <span className="font-semibold text-foreground">{requestToCancel?.mascota?.nombre}</span>? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted hover:bg-muted/80 text-foreground border-border">
              No, mantener
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UserProtectedRoute>
  )
}
