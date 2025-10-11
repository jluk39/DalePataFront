"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card.jsx"
import { Button } from "../../../../components/ui/button.jsx"
import { Input } from "../../../../components/ui/input.jsx"
import { Badge } from "../../../../components/ui/badge.jsx"
import { Plus, Search, Edit, Trash2, Eye, Heart, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.jsx"
import AddPetModal from "../../../../components/admin/add-pet-modal.jsx"
import { ApiService } from "../../../../lib/api.js"

export default function PetManagement() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true)
        setError(null)
        const petsData = await ApiService.getAdminPets()
        setPets(petsData)
      } catch (error) {
        console.error('Error fetching pets:', error)
        setError(error.message)
        setPets([]) // No mock data, just empty array
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.raza.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "available" && pet.en_adopcion) ||
      (filterStatus === "unavailable" && !pet.en_adopcion)

    return matchesSearch && matchesFilter
  })

  const handleAddPet = async (newPetData) => {
    alert('Funcionalidad no disponible: endpoint para crear mascotas no implementado')
  }

  const handleUpdatePet = async (petId, updatedData) => {
    alert('Funcionalidad no disponible: endpoint para actualizar mascotas no implementado')
  }

  const handleDeletePet = async (petId) => {
    alert('Funcionalidad no disponible: endpoint para eliminar mascotas no implementado')
  }

  const getStatusBadge = (pet) => {
    if (pet.en_adopcion) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Disponible</Badge>
    } else {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">No disponible</Badge>
    }
  }

  const getHealthBadge = (estado) => {
    if (estado === "Saludable") {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Saludable</Badge>
    } else if (estado === "En tratamiento") {
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">En tratamiento</Badge>
    } else {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{estado}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando mascotas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Mascotas</h1>
          <p className="text-slate-400">Administra las mascotas de tu refugio</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Mascota
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, especie o raza..."
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
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="unavailable">No disponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="text-foreground font-semibold">{pets.length}</p>
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
                <p className="text-muted-foreground text-sm">Disponibles</p>
                <p className="text-foreground font-semibold">{pets.filter((p) => p.en_adopcion).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">En cuidado</p>
                <p className="text-foreground font-semibold">{pets.filter((p) => !p.en_adopcion).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pets Table */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Mascotas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground font-medium">Mascota</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Especie/Raza</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Edad</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Estado</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Salud</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Fecha</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.map((pet) => (
                  <TableRow key={pet.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={pet.imagen_url || "/placeholder.svg"}
                          alt={pet.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-foreground font-medium">{pet.nombre}</p>
                          <p className="text-muted-foreground text-sm">{pet.sexo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{pet.especie}</p>
                        <p className="text-muted-foreground text-sm">{pet.raza}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{pet.edad_anios}</TableCell>
                    <TableCell>{getStatusBadge(pet)}</TableCell>
                    <TableCell>{getHealthBadge(pet.estado_salud)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {pet.created_at ? new Date(pet.created_at).toLocaleDateString("es-ES", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent/20"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-accent/20"
                          title="Editar mascota"
                          onClick={() => {
                            // TODO: Implementar modal de edición
                            console.log('Edit pet:', pet.id)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Eliminar mascota"
                          onClick={() => handleDeletePet(pet.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPets.length === 0 && !loading && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              {error ? (
                <div>
                  <p className="text-destructive mb-2">Error al cargar las mascotas</p>
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No se encontraron mascotas</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Pet Modal */}
      <AddPetModal open={showAddModal} onOpenChange={setShowAddModal} onSubmit={handleAddPet} />
    </div>
  )
}
