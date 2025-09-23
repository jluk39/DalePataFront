import { Card, CardContent } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Calendar, Clock, MapPin, Phone, User, Stethoscope, FileText } from "lucide-react"





export function AppointmentCard({ appointment, isHistory = false }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        className: "bg-green-100 text-green-800",
        label: "Confirmado"
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800", 
        label: "Pendiente"
      },
      urgent: {
        className: "bg-red-100 text-red-800",
        label: "Urgente"
      },
      completed: {
        className: "bg-blue-100 text-blue-800",
        label: "Completado"
      },
      cancelled: {
        className: "bg-gray-100 text-gray-800",
        label: "Cancelado"
      }
    }

    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Pet Image */}
          <div className="flex-shrink-0">
            <img
              src={appointment.petImage || "/placeholder.svg"}
              alt={appointment.petName}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{appointment.petName}</h3>
                <p className="text-muted-foreground">{appointment.appointmentType}</p>
              </div>
              {getStatusBadge(appointment.status)}
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.time} hs</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.veterinarian}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.clinic}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.phone}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>

            {/* History-specific information */}
            {isHistory && appointment.diagnosis && (
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <span className="font-medium text-sm">Diagnóstico: </span>
                  <span className="text-sm">{appointment.diagnosis}</span>
                </div>
                {appointment.treatment && (
                  <div>
                    <span className="font-medium text-sm">Tratamiento: </span>
                    <span className="text-sm">{appointment.treatment}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {!isHistory && (
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  Ver Detalles
                </Button>
                {appointment.canReschedule && (
                  <Button size="sm" variant="outline">
                    Reprogramar
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Contactar Clínica
                </Button>
                {appointment.status !== "urgent" && (
                  <Button size="sm" variant="destructive">
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}







