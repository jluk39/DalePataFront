"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PetCard } from "./pet-card.js"
import { ApiService } from "../lib/api.js"
import { Button } from "./ui/button.jsx"
import { useAuth } from "./backend-auth-provider.js"
import { Plus } from "lucide-react"
import AddPetModal from "./admin/add-pet-modal.jsx"

export function MyPetsGrid() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchMyPets = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Obtener todas las mascotas y filtrar por el usuario actual
        const allPets = await ApiService.fetchPets()
        // Filtrar mascotas que pertenecen al usuario actual
        const myPets = allPets.filter(pet => pet.userId === user.id)
        setPets(myPets)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch my pets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyPets()
  }, [user])

  const handleAddPet = async (newPetData) => {
    alert('Funcionalidad no disponible: endpoint para crear mascotas no implementado')
    // TODO: Implementar creación de mascota
    // Después de crear, recargar la lista de mascotas
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">MIS MASCOTAS</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Mascota
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <AddPetModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
          onSubmit={handleAddPet} 
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">MIS MASCOTAS</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Mascota
          </Button>
        </div>
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-500 mb-4">Error al cargar tus mascotas: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reintentar
          </Button>
        </div>
        <AddPetModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
          onSubmit={handleAddPet} 
        />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">MIS MASCOTAS</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Mascota
          </Button>
        </div>
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver tus mascotas</p>
          <Button onClick={() => router.push('/auth/login')}>
            Iniciar Sesión
          </Button>
        </div>
        <AddPetModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
          onSubmit={handleAddPet} 
        />
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">MIS MASCOTAS</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Mascota
          </Button>
        </div>
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground mb-4">
            Aún no tenés mascotas. Adoptá una
          </p>
          <Button onClick={() => router.push('/adoptar')}>
            Ver Mascotas en Adopción
          </Button>
        </div>
        <AddPetModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
          onSubmit={handleAddPet} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">MIS MASCOTAS</h2>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Mascota
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
      
      <AddPetModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onSubmit={handleAddPet} 
      />
    </div>
  )
}
