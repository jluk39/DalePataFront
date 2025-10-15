import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Heart, MapPin, Clock } from "lucide-react"
import Link from "next/link"





export function AdoptionCard({ pet }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={pet.image || "/placeholder.svg"} alt={pet.name} className="w-full h-48 object-cover" />
        {pet.urgent && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Urgente
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{pet.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {pet.location}
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <p>
            {pet.age} • {pet.gender}
          </p>
          {pet.shelter && (
            <p className="text-xs">
              <strong>Refugio:</strong> {pet.shelter}
            </p>
          )}
        </div>

        <p className="text-sm text-foreground mb-3 line-clamp-2">
          {pet.species || 'Mascota'} en busca de un hogar lleno de amor
        </p>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {pet.healthStatus || pet.status || 'Saludable'}
          </Badge>
          <Link href={`/adoptar/${pet.id}`}>
            <Button size="sm">Ver Detalles</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}







