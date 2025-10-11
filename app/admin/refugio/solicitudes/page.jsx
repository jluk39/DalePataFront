"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card.jsx"
import { Button } from "../../../../components/ui/button.jsx"
import { Input } from "../../../../components/ui/input.jsx"
import { Badge } from "../../../../components/ui/badge.jsx"
import { Search, Check, X, Eye, Clock, User, Heart, Phone, Mail, MapPin, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.jsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog.jsx"
import { ApiService } from "../../../../lib/api.js"

export default function AdoptionRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        setError(null)
        const requestsData = await ApiService.getAdoptionRequests()
        setRequests(requestsData)
      } catch (error) {
        console.error('Error fetching adoption requests:', error)
        setError(error.message)
        setRequests([]) // No mock data, just empty array
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.mascota_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.adoptante_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.adoptante_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || request.estado === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendiente</Badge>
      case "aprobada":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aprobada</Badge>
      case "rechazada":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rechazada</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground border-border">{estado}</Badge>
    }
  }

  const handleApprove = async (requestId) => {
    alert('Funcionalidad no disponible: endpoint de adopciones no implementado')
  }

  const handleReject = async (requestId) => {
    alert('Funcionalidad no disponible: endpoint de adopciones no implementado')
  }

  const openDetailModal = (request) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando solicitudes de adopción...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Solicitudes de Adopción</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de adopción de tus mascotas</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por mascota, adoptante o email..."
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
                <SelectItem value="aprobada">Aprobadas</SelectItem>
                <SelectItem value="rechazada">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-foreground font-semibold">{requests.length}</p>
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
                <p className="text-foreground font-semibold">{requests.filter((r) => r.estado === "pendiente").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Aprobadas</p>
                <p className="text-foreground font-semibold">{requests.filter((r) => r.estado === "aprobada").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Rechazadas</p>
                <p className="text-foreground font-semibold">{requests.filter((r) => r.estado === "rechazada").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-white">Solicitudes de Adopción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Mascota</TableHead>
                  <TableHead className="text-slate-300">Adoptante</TableHead>
                  <TableHead className="text-slate-300">Contacto</TableHead>
                  <TableHead className="text-slate-300">Estado</TableHead>
                  <TableHead className="text-slate-300">Fecha</TableHead>
                  <TableHead className="text-slate-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={request.mascota_imagen || "/placeholder.svg"}
                          alt={request.mascota_nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{request.mascota_nombre}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{request.adoptante_nombre}</p>
                        <p className="text-slate-400 text-sm">{request.adoptante_direccion}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-300 text-sm">{request.adoptante_email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-300 text-sm">{request.adoptante_telefono}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.estado)}</TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(request.fecha_solicitud).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-800"
                          onClick={() => openDetailModal(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.estado === "pendiente" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              onClick={() => handleApprove(request.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => handleReject(request.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              {error ? (
                <div>
                  <p className="text-destructive mb-2">Error al cargar las solicitudes</p>
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No se encontraron solicitudes</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription className="text-slate-400">
              Información completa del adoptante y la solicitud
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Pet and Adopter Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Mascota</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedRequest.mascota_imagen || "/placeholder.svg"}
                        alt={selectedRequest.mascota_nombre}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium text-lg">{selectedRequest.mascota_nombre}</p>
                        {getStatusBadge(selectedRequest.estado)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Adoptante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-white">{selectedRequest.adoptante_nombre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedRequest.adoptante_email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedRequest.adoptante_telefono}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{selectedRequest.adoptante_direccion}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Experiencia con mascotas</h4>
                  <p className="text-slate-300 bg-slate-800 p-3 rounded-lg">{selectedRequest.experiencia_mascotas}</p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Motivo de adopción</h4>
                  <p className="text-slate-300 bg-slate-800 p-3 rounded-lg">{selectedRequest.motivo_adopcion}</p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Situación de vivienda</h4>
                  <p className="text-slate-300 bg-slate-800 p-3 rounded-lg">{selectedRequest.situacion_vivienda}</p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Disponibilidad de tiempo</h4>
                  <p className="text-slate-300 bg-slate-800 p-3 rounded-lg">{selectedRequest.disponibilidad_tiempo}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.estado === "pendiente" && (
                <div className="flex space-x-3 pt-4 border-t border-slate-700">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedRequest.id)
                      setShowDetailModal(false)
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar Solicitud
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-500/10 bg-transparent"
                    onClick={() => {
                      handleReject(selectedRequest.id)
                      setShowDetailModal(false)
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar Solicitud
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
