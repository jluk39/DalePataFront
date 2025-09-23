import { AppointmentCard } from "./appointment-card.jsx"

const mockAppointmentHistory = [
  {
    id: "4",
    petName: "Max",
    petImage: "/golden-retriever-dog-happy.jpg",
    appointmentType: "Consulta General",
    veterinarian: "Dr. María González",
    clinic: "Veterinaria San Martín",
    date: "2024-02-15",
    time: "11:00",
    address: "Av. San Martín 1234, CABA",
    phone: "+54 11 4567-8901",
    status: "completed",
    notes: "Control de rutina - Todo normal",
    canReschedule: false,
    diagnosis: "Estado de salud excelente",
    treatment: "Continuar con dieta actual",
  },
  {
    id: "5",
    petName: "Luna",
    petImage: "/siamese-cat-cream-brown.jpg",
    appointmentType: "Esterilización",
    veterinarian: "Dr. Pedro Martínez",
    clinic: "Hospital Veterinario Central",
    date: "2024-01-20",
    time: "09:00",
    address: "Rivadavia 3456, CABA",
    phone: "+54 11 7777-8888",
    status: "completed",
    notes: "Cirugía exitosa",
    canReschedule: false,
    diagnosis: "Procedimiento completado sin complicaciones",
    treatment: "Reposo 7 días, antibióticos",
  },
  {
    id: "6",
    petName: "Rocky",
    petImage: "/black-dog-mixed-breed.jpg",
    appointmentType: "Vacunación",
    veterinarian: "Dra. Ana López",
    clinic: "Centro Veterinario Belgrano",
    date: "2024-01-10",
    time: "16:30",
    address: "Av. Cabildo 2345, CABA",
    phone: "+54 11 5555-1234",
    status: "completed",
    notes: "Vacunas múltiples aplicadas",
    canReschedule: false,
    diagnosis: "Inmunización completa",
    treatment: "Próxima vacuna en 12 meses",
  },
]

export function AppointmentHistory() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground">{mockAppointmentHistory.length} turnos completados</p>
      </div>

      <div className="space-y-4">
        {mockAppointmentHistory.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} isHistory />
        ))}
      </div>
    </div>
  )
}






