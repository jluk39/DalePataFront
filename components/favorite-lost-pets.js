"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Calendar, Phone, Share2 } from "lucide-react"

// Mock favorite lost pets data
const mockFavoriteLostPets = [
  {
    id: 1,
    name: "Milo",
    type: "perdido",
    species: "Perro",
    breed: "Beagle",
    age: "5 años",
    gender: "Macho",
    location: "Palermo, Buenos Aires",
    lastSeen: "2024-01-12",
    image: "/beagle-dog-brown-white.jpg",
    description: "Perro beagle con collar azul. Muy amigable, responde a su nombre.",
    reward: "$50.000",
    contact: "María González",
    phone: "+54 11 1234-5678",
    dateAdded: "2024-01-12",
  },
  {
    id: 2,
    name: "Desconocido",
    type: "encontrado",
    species: "Gato",
    breed: "Siamés",
    age: "Adulto joven",
    gender: "Hembra",
    location: "Villa Crespo, Buenos Aires",
    lastSeen: "2024-01-10",
    image: "/siamese-cat-cream-brown.jpg",
    description: "Gata siamés encontrada en la plaza. Muy dócil, parece estar bien cuidada.",
    reward: null,
    contact: "Carlos Ruiz",
    phone: "+54 11 9876-5432",
    dateAdded: "2024-01-10",
  },
]

export function FavoriteLostPets() {
  const [favorites, setFavorites] = useState(mockFavoriteLostPets)

  const removeFavorite = (petId) => {
    setFavorites(favorites.filter((pet) => pet.id !== petId))
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No tienes reportes favoritos</h3>
        <p className="text-muted-foreground mb-4">
          Guarda reportes de mascotas perdidas o encontradas para ayudar a reunirlas con sus familias
        </p>
        <Button>Ver Reportes</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {favorites.length} reporte{favorites.length !== 1 ? "s" : ""} guardado{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((pet) => (
          <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
              <Badge
                className={`absolute top-2 left-2 ${
                  pet.type === "perdido" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {pet.type === "perdido" ? "Perdido" : "Encontrado"}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => removeFavorite(pet.id)}
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{pet.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed} • {pet.age} • {pet.gender}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{pet.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{pet.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {pet.type === "perdido" ? "Perdido" : "Encontrado"}
                    </span>
                  </div>
                </div>

                {pet.reward && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Recompensa
                  </Badge>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>Contacto</p>
                  <p>Guardado</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="w-3 h-3 mr-2" />
                    Llamar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}






