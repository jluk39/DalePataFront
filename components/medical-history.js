import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Badge } from "./ui/badge.jsx"
import { Button } from "./ui/button.jsx"
import { Calendar, Plus, Stethoscope } from "lucide-react"

// Mock medical history data
const mockMedicalHistory = [
  {
    id: 1,
    date: "2024-01-15",
    type: "Consulta General",
    veterinarian: "Dr. María González",
    clinic: "Veterinaria San Martín",
    diagnosis: "Revisión rutinaria - Estado saludable",
    treatment: "Ninguno requerido",
    medications: [],
    notes: "Mascota en excelente estado de salud. Continuar con rutina actual.",
    nextAppointment: "2024-04-15",
  },
  {
    id: 2,
    date: "2023-12-10",
    type: "Vacunación",
    veterinarian: "Dr. Carlos Ruiz",
    clinic: "Veterinaria San Martín",
    diagnosis: "Vacunación anual completa",
    treatment: "Vacunas múltiples",
    medications: ["Vacuna antirrábica", "Vacuna séxtuple"],
    notes: "Vacunación completada sin complicaciones. Próxima dosis en 12 meses.",
    nextAppointment: "2024-12-10",
  },
  {
    id: 3,
    date: "2023-09-22",
    type: "Emergencia",
    veterinarian: "Dr. Ana López",
    clinic: "Clínica Veterinaria 24h",
    diagnosis: "Gastroenteritis leve",
    treatment: "Dieta blanda y medicación",
    medications: ["Metronidazol", "Probióticos"],
    notes: "Recuperación completa en 5 días. Evitar cambios bruscos en la dieta.",
    nextAppointment: null,
  },
]

export function MedicalHistory({ pet }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Historial Médico de {pet.name}</h2>
          <p className="text-muted-foreground">Registro completo de consultas y tratamientos</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Consulta
        </Button>
      </div>

      <div className="space-y-4">
        {mockMedicalHistory.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{record.type}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {record.date}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{record.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Información de la Consulta</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Veterinario:</span> {record.veterinarian}
                    </p>
                    <p>
                      <span className="font-medium">Clínica:</span> {record.clinic}
                    </p>
                    <p>
                      <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tratamiento</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Tratamiento:</span> {record.treatment}
                    </p>
                    {record.medications.length > 0 && (
                      <div>
                        <span className="font-medium">Medicamentos:</span>
                        <ul className="list-disc list-inside ml-2">
                          {record.medications.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {record.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notas</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{record.notes}</p>
                </div>
              )}

              {record.nextAppointment && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Calendar className="w-4 h-4" />
                  <span>Próxima cita</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}






