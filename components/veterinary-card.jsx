import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { MapPin, Phone, Mail, Globe, Clock, Star, AlertCircle } from "lucide-react"





export function VeterinaryCard({ veterinary }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{veterinary.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{veterinary.rating}</span>
                <span className="ml-1 text-sm text-muted-foreground">({veterinary.reviews} reseñas)</span>
              </div>
              {veterinary.emergency && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  24hs
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{veterinary.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{veterinary.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{veterinary.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>{veterinary.website}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{veterinary.hours}</span>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-medium mb-2">Servicios</h4>
          <div className="flex flex-wrap gap-1">
            {veterinary.services.map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>

        {/* Veterinarians */}
        <div>
          <h4 className="font-medium mb-2">Veterinarios</h4>
          <div className="text-sm text-muted-foreground">{veterinary.veterinarians.join(", ")}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            Agendar Turno
          </Button>
          <Button size="sm" variant="outline">
            Ver Más Info
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}







