import { AppointmentCard } from "./appointment-card.jsx"

const mockUpcomingAppointments = [
  {
    id: "1",
    petName: "Max",
    petImage: "/golden-retriever-dog-happy.jpg",
    appointmentType: "Consulta General",
    veterinarian: "Dr. María González",
    clinic: "Veterinaria San Martín",
    date: "2024-03-25",
    time: "10:30",
    address: "Av. San Martín 1234, CABA",
    phone: "+54 11 4567-8901",
    status: "confirmed",
    notes: "Control de rutina y vacunas",
    canReschedule: true,
  },
  {
    id: "2",
    petName: "Luna",
    petImage: "/siamese-cat-cream-brown.jpg",
    appointmentType: "Emergencia",
    veterinarian: "Dr. Carlos Ruiz",
    clinic: "Clínica Veterinaria 24hs",
    date: "2024-03-23",
    time: "15:00",
    address: "Corrientes 5678, CABA",
    phone: "+54 11 9876-5432",
    status: "urgent",
    notes: "Revisión por vómitos frecuentes",
    canReschedule: false,
  },
  {
    id: "3",
    petName: "Rocky",
    petImage: "/black-dog-mixed-breed.jpg",
    appointmentType: "Vacunación",
    veterinarian: "Dra. Ana López",
    clinic: "Centro Veterinario Belgrano",
    date: "2024-03-28",
    time: "14:15",
    address: "Av. Cabildo 2345, CABA",
    phone: "+54 11 5555-1234",
    status: "pending",
    notes: "Vacuna antirrábica anual",
    canReschedule: true,
  },
]

export function UpcomingAppointments() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground">{mockUpcomingAppointments.length} turnos próximos</p>
      </div>

      <div className="space-y-4">
        {mockUpcomingAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  )
}






