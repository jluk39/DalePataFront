"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Share2, MessageCircle } from "lucide-react"

// Mock favorite pets data
const mockFavoritePets = [
  {
    id: 1,
    name: "Alvin",
    age: "8 años",
    gender: "Macho",
    species: "Gato",
    breed: "Mestizo",
    location: "Buenos Aires, Argentina",
    image: "/orange-tabby-cat.png",
    description: "Gato muy cariñoso que busca un hogar tranquilo. Le encanta dormir al sol.",
    vaccinated: true,
    sterilized: true,
    urgent: false,
    contact: "Refugio San Francisco",
    dateAdded: "2024-01-10",
  },
  {
    id: 2,
    name: "Blas",
    age: "4 años",
    gender: "Macho",
    species: "Perro",
    breed: "Pastor Alemán Mix",
    location: "Córdoba, Argentina",
    image: "/black-german-shepherd-mix-dog.jpg",
    description: "Perro muy activo y leal. Ideal para familias con experiencia en perros grandes.",
    vaccinated: true,
    sterilized: true,
    urgent: true,
    contact: "Fundación Patitas",
    dateAdded: "2024-01-08",
  },
  {
    id: 3,
    name: "Maylon",
    age: "2 años",
    gender: "Hembra",
    species: "Perro",
    breed: "Golden Retriever",
    location: "Rosario, Argentina",
    image: "/golden-retriever-puppy.png",
    description: "Cachorra muy juguetona y sociable. Perfecta para familias con niños.",
    vaccinated: true,
    sterilized: false,
    urgent: false,
    contact: "Hogar de Peludos",
    dateAdded: "2024-01-05",
  },
]

export function FavoritePets() {
  const [favorites, setFavorites] = useState(mockFavoritePets)

  const removeFavorite = (petId) => {
    setFavorites(favorites.filter((pet) => pet.id !== petId))
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No tienes mascotas favoritas</h3>
        <p className="text-muted-foreground mb-4">Explora las mascotas en adopción y guarda tus favoritas aquí</p>
        <Button>Explorar Mascotas</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {favorites.length} mascota{favorites.length !== 1 ? "s" : ""} guardada{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((pet) => (
          <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
              {pet.urgent && <Badge className="absolute top-2 left-2 bg-red-500 text-white">Urgente</Badge>}
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{pet.location}</span>
                </div>

                <div className="flex gap-2">
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
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Contacto</p>
                  <p>Guardado</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Contactar
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






