"use client"

import { useState, useEffect } from "react"
import { AdoptionCard } from "./adoption-card.jsx"
import { ApiService } from "../lib/api.js"

export function AdoptionGrid() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true)
        const petsData = await ApiService.fetchPets()
        setPets(petsData)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch pets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  const sortedPets = [...pets].sort((a, b) => {
    switch (sortBy) {
      case "age-asc":
        return parseInt(a.age) - parseInt(b.age)
      case "age-desc":
        return parseInt(b.age) - parseInt(a.age)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return b.id - a.id // Most recent first
    }
  })

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Cargando mascotas...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error al cargar las mascotas: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{pets.length} mascotas disponibles</p>
        <select 
          className="border border-border rounded-md px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Ordenar por: Más recientes</option>
          <option value="age-asc">Ordenar por: Edad (menor a mayor)</option>
          <option value="age-desc">Ordenar por: Edad (mayor a menor)</option>
          <option value="name">Ordenar por: Nombre A-Z</option>
        </select>
      </div>

      {sortedPets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay mascotas disponibles para adopción en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPets.map((pet) => (
            <AdoptionCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  )
}






