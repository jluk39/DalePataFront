"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Phone, Clock, Star, Calendar, Stethoscope } from "lucide-react"

// Mock favorite veterinarians data
const mockFavoriteVeterinarians = [
  {
    id: 1,
    name: "Dr. María González",
    clinic: "Veterinaria San Martín",
    specialty: "Medicina General",
    rating: 4.8,
    reviews: 127,
    location: "Palermo, Buenos Aires",
    phone: "+54 11 4567-8901",
    hours: "Lun-Vie: 9:00-19:00, Sáb: 9:00-14:00",
    image: "/female-veterinarian.jpg",
    services: ["Consultas", "Vacunación", "Cirugía"],
    emergency: false,
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    name: "Dr. Carlos Ruiz",
    clinic: "Clínica Veterinaria 24h",
    specialty: "Emergencias",
    rating: 4.9,
    reviews: 89,
    location: "Villa Crespo, Buenos Aires",
    phone: "+54 11 2345-6789",
    hours: "24 horas",
    image: "/male-veterinarian.png",
    services: ["Emergencias", "Cirugía", "Internación"],
    emergency: true,
    dateAdded: "2024-01-10",
  },
  {
    id: 3,
    name: "Dra. Ana López",
    clinic: "Centro Veterinario Integral",
    specialty: "Dermatología",
    rating: 4.7,
    reviews: 156,
    location: "Belgrano, Buenos Aires",
    phone: "+54 11 3456-7890",
    hours: "Lun-Vie: 8:00-18:00",
    image: "/female-veterinarian-specialist.jpg",
    services: ["Dermatología", "Alergias", "Consultas"],
    emergency: false,
    dateAdded: "2024-01-08",
  },
]

export function FavoriteVeterinarians() {
  const [favorites, setFavorites] = useState(mockFavoriteVeterinarians)

  const removeFavorite = (vetId) => {
    setFavorites(favorites.filter((vet) => vet.id !== vetId))
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No tienes veterinarias favoritas</h3>
        <p className="text-muted-foreground mb-4">
          Guarda tus veterinarias de confianza para acceder rápidamente a su información
        </p>
        <Button>Explorar Veterinarias</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {favorites.length} veterinaria{favorites.length !== 1 ? "s" : ""} guardada{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((vet) => (
          <Card key={vet.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={vet.image || "/placeholder.svg"}
                  alt={vet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{vet.name}</h3>
                      <p className="text-sm text-muted-foreground">{vet.clinic}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFavorite(vet.id)}>
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{vet.rating}</span>
                      <span className="text-sm text-muted-foreground">({vet.reviews} reseñas)</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{vet.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{vet.hours}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Especialidad:</p>
                      <Badge variant="secondary">{vet.specialty}</Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Servicios:</p>
                      <div className="flex flex-wrap gap-1">
                        {vet.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {vet.emergency && <Badge className="bg-red-500 text-white">Atención de Emergencia</Badge>}

                    <div className="text-xs text-muted-foreground">
                      <p>Guardado</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="w-3 h-3 mr-2" />
                        Llamar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Calendar className="w-3 h-3 mr-2" />
                        Agendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}






