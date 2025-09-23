"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin } from "lucide-react"

export function PetCard({ pet, showFavoriteButton = true }) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // Here you would typically make an API call to save/remove the favorite
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={pet.image || "/placeholder.svg?height=200&width=200&query=cute pet"}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        {pet.urgent && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Urgente</Badge>}
        {showFavoriteButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
            />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.age} • {pet.gender}
            </p>
            {pet.breed && pet.species && (
              <p className="text-xs text-muted-foreground">
                {pet.species} - {pet.breed}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{pet.location || "Buenos Aires"}</span>
          </div>

          {pet.shelter && (
            <div className="text-sm text-muted-foreground">
              <strong>Refugio:</strong> {pet.shelter}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {pet.vaccinated && (
              <Badge variant="secondary" className="text-xs">
                Vacunado
              </Badge>
            )}
            {pet.sterilized && (
              <Badge variant="secondary" className="text-xs">
                Castrado
              </Badge>
            )}
            {pet.healthStatus && (
              <Badge variant="outline" className="text-xs">
                {pet.healthStatus}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {pet.description || `${pet.species} en busca de un hogar`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}






