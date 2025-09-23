import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { MapPin, Calendar, Heart, Share2 } from "lucide-react"
import { Button } from "./ui/button.jsx"



// Mock data - in real app this would come from API
const mockPetData = {
  "1": {
    id: "1",
    name: "Max",
    breed: "Golden Retriever", 
    age: "2 años",
    gender: "Macho",
    color: "Dorado",
    description: "Perro muy amigable y juguetón"
  }
}

export function PetProfile({ petId }) {
  const pet = mockPetData[petId] || mockPetData["1"]

  return (
    <div className="space-y-6">
      {/* Main Photo and Basic Info */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={pet.image || "/placeholder.svg"}
              alt={pet.name}
              className="w-full h-80 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="secondary" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {pet.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Rescatado el {pet.rescueDate}
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {pet.status}
              </Badge>
            </div>

            <p className="text-foreground leading-relaxed">{pet.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Características */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Raza</p>
              <p className="font-medium">{pet.breed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Edad</p>
              <p className="font-medium">{pet.age}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Género</p>
              <p className="font-medium">{pet.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tamaño</p>
              <p className="font-medium">{pet.size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso</p>
              <p className="font-medium">{pet.weight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{pet.color}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalidad */}
      <Card>
        <CardHeader>
          <CardTitle>Personalidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {pet.personality.map((trait) => (
              <Badge key={trait} variant="outline">
                {trait}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial Médico */}
      <Card>
        <CardHeader>
          <CardTitle>Historial Médico</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pet.medicalHistory.map((item, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Requisitos */}
      <Card>
        <CardHeader>
          <CardTitle>Requisitos para Adopción</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pet.requirements.map((requirement, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                {requirement}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}







