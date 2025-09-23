"use client"

import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Calendar, MapPin, Edit } from "lucide-react"

// Mock data - in real app this would come from your backend
const mockPets = [
  {
    id: 1,
    name: "Luna",
    species: "Perro",
    breed: "Golden Retriever",
    age: "3 años",
    gender: "Hembra",
    weight: "28 kg",
    microchip: "123456789",
    image: "/golden-retriever-dog-happy.jpg",
    lastVet: "2024-01-15",
    nextVaccination: "2024-03-15",
    status: "Saludable",
  },
  {
    id: 2,
    name: "Max",
    species: "Gato",
    breed: "Siamés",
    age: "2 años",
    gender: "Macho",
    weight: "4.5 kg",
    microchip: "987654321",
    image: "/siamese-cat-cream-brown.jpg",
    lastVet: "2024-01-20",
    nextVaccination: "2024-04-20",
    status: "Saludable",
  },
]

export function MyPetsList({ onSelectPet, selectedPet }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockPets.map((pet) => (
        <Card
          key={pet.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedPet?.id === pet.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectPet(pet)}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img
                src={pet.image || "/placeholder.svg"}
                alt={pet.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{pet.name}</h3>
                  <Badge variant="secondary">{pet.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {pet.breed} • {pet.age} • {pet.gender}
                </p>
                <p className="text-sm text-muted-foreground mb-3">Peso</p>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Última consulta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>Próxima vacuna</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle edit pet
                  }}
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}






