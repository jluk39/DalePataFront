import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { MapPin, Calendar, Phone, Mail, AlertTriangle, Gift } from "lucide-react"





export function LostFoundCard({ pet }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={pet.status === "lost" ? "bg-destructive" : "bg-primary"}>
            {pet.status === "lost" ? "Perdido" : "Encontrado"}
          </Badge>
          {pet.urgent && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Urgente
            </Badge>
          )}
        </div>
        {pet.reward && (
          <Badge className="absolute top-2 right-2 bg-green-600 text-white">
            <Gift className="h-3 w-3 mr-1" />
            Recompensa
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <p className="text-sm text-muted-foreground">
            {pet.breed} • {pet.age} • {pet.gender}
          </p>
          <p className="text-sm text-muted-foreground">
            {pet.color} • {pet.size}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-2" />
            {pet.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 mr-2" />
            {pet.status === "lost" ? "Perdido el" : "Encontrado el"} {formatDate(pet.lastSeen)}
          </div>
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-2">{pet.description}</p>

        {pet.reward && (
          <div className="mb-4 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">Recompensa</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Contacto</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Phone className="h-3 w-3 mr-1" />
              Llamar
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}







