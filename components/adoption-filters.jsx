"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Label } from "./ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { Button } from "./ui/button.jsx"
import { Slider } from "./ui/slider.jsx"

export function AdoptionFilters({ onFiltersChange }) {
  const [filters, setFilters] = useState({
    species: "all",
    gender: "all",
    ageRange: [0, 15]
  })

  const handleSpeciesChange = (value) => {
    const newFilters = { ...filters, species: value }
    setFilters(newFilters)
  }

  const handleGenderChange = (value) => {
    const newFilters = { ...filters, gender: value }
    setFilters(newFilters)
  }

  const handleAgeRangeChange = (value) => {
    const newFilters = { ...filters, ageRange: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(filters)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      species: "all",
      gender: "all",
      ageRange: [0, 15]
    }
    setFilters(clearedFilters)
    if (onFiltersChange) {
      onFiltersChange(clearedFilters)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Animal */}
        <div className="space-y-2">
          <Label>Tipo de Animal</Label>
          <Select value={filters.species} onValueChange={handleSpeciesChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los animales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los animales</SelectItem>
              <SelectItem value="Perro">Perro</SelectItem>
              <SelectItem value="Gato">Gato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <Label>Edad (años)</Label>
          <Slider 
            value={filters.ageRange} 
            onValueChange={handleAgeRangeChange}
            max={15} 
            step={1} 
            className="w-full" 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.ageRange[0]} años</span>
            <span>{filters.ageRange[1] >= 15 ? "15+ años" : `${filters.ageRange[1]} años`}</span>
          </div>
        </div>

        {/* Género */}
        <div className="space-y-2">
          <Label>Sexo</Label>
          <Select value={filters.gender} onValueChange={handleGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Cualquier género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier sexo</SelectItem>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Button onClick={handleApplyFilters} className="w-full">
            Aplicar Filtros
          </Button>
          <Button onClick={handleClearFilters} variant="outline" className="w-full">
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}






