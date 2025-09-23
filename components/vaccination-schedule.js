import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Calendar, Shield, AlertTriangle, CheckCircle, Plus } from "lucide-react"

// Mock vaccination data
const mockVaccinations = [
  {
    id: 1,
    name: "Vacuna Antirrábica",
    lastDate: "2023-12-10",
    nextDate: "2024-12-10",
    status: "vigente",
    veterinarian: "Dr. Carlos Ruiz",
    clinic: "Veterinaria San Martín",
    notes: "Vacuna anual obligatoria",
  },
  {
    id: 2,
    name: "Vacuna Séxtuple",
    lastDate: "2023-12-10",
    nextDate: "2024-12-10",
    status: "vigente",
    veterinarian: "Dr. Carlos Ruiz",
    clinic: "Veterinaria San Martín",
    notes: "Protección contra 6 enfermedades",
  },
  {
    id: 3,
    name: "Vacuna contra Tos de las Perreras",
    lastDate: "2023-06-15",
    nextDate: "2024-03-15",
    status: "próximo",
    veterinarian: "Dr. María González",
    clinic: "Veterinaria San Martín",
    notes: "Recomendada para perros sociales",
  },
  {
    id: 4,
    name: "Vacuna contra Leishmaniasis",
    lastDate: "2023-03-20",
    nextDate: "2024-01-20",
    status: "vencida",
    veterinarian: "Dr. Ana López",
    clinic: "Clínica Veterinaria 24h",
    notes: "Importante en zonas endémicas",
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "vigente":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "próximo":
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case "vencida":
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    default:
      return <Shield className="w-5 h-5 text-gray-500" />
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case "vigente":
      return <Badge className="bg-green-100 text-green-800">Vigente</Badge>
    case "próximo":
      return <Badge className="bg-yellow-100 text-yellow-800">Próximo</Badge>
    case "vencida":
      return <Badge className="bg-red-100 text-red-800">Vencida</Badge>
    default:
      return <Badge variant="secondary">Desconocido</Badge>
  }
}

export function VaccinationSchedule({ pet }) {
  const upcomingVaccinations = mockVaccinations.filter((v) => v.status === "próximo" || v.status === "vencida")
  const currentVaccinations = mockVaccinations.filter((v) => v.status === "vigente")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendario de Vacunas de {pet.name}</h2>
          <p className="text-muted-foreground">Control y seguimiento de vacunaciones</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Registrar Vacuna
        </Button>
      </div>

      {/* Upcoming/Overdue Vaccinations */}
      {upcomingVaccinations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Vacunas Pendientes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingVaccinations.map((vaccination) => (
              <Card key={vaccination.id} className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{vaccination.name}</CardTitle>
                    {getStatusBadge(vaccination.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Próxima fecha</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Última aplicación</p>
                    <p>Veterinario</p>
                  </div>
                  <Button size="sm" className="w-full">
                    Agendar Cita
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Current Vaccinations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Vacunas Vigentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentVaccinations.map((vaccination) => (
            <Card key={vaccination.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(vaccination.status)}
                    <CardTitle className="text-base">{vaccination.name}</CardTitle>
                  </div>
                  {getStatusBadge(vaccination.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Aplicada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Próxima</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>{vaccination.veterinarian}</p>
                  <p>{vaccination.clinic}</p>
                </div>
                {vaccination.notes && (
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded">{vaccination.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}






