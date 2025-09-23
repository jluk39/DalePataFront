import { VeterinaryCard } from "./veterinary-card.jsx"

const mockVeterinaries = [
  {
    id: "1",
    name: "Veterinaria San Martín",
    address: "Av. San Martín 1234, CABA",
    phone: "+54 11 4567-8901",
    email: "info@vetsanmartin.com",
    website: "www.vetsanmartin.com",
    hours: "Lun-Vie: 8:00-20:00, Sáb: 9:00-18:00",
    services: ["Consultas Generales", "Vacunación", "Cirugías", "Emergencias"],
    veterinarians: ["Dr. María González", "Dr. Juan Pérez"],
    rating: 4.8,
    reviews: 156,
    emergency: false,
    image: "/veterinary-clinic-1.jpg",
  },
  {
    id: "2",
    name: "Clínica Veterinaria 24hs",
    address: "Corrientes 5678, CABA",
    phone: "+54 11 9876-5432",
    email: "emergencias@vet24hs.com",
    website: "www.vet24hs.com",
    hours: "24 horas, todos los días",
    services: ["Emergencias 24hs", "Internación", "Cirugías", "Diagnóstico por Imágenes"],
    veterinarians: ["Dr. Carlos Ruiz", "Dra. Laura Fernández", "Dr. Miguel Torres"],
    rating: 4.6,
    reviews: 203,
    emergency: true,
    image: "/veterinary-clinic-2.jpg",
  },
  {
    id: "3",
    name: "Centro Veterinario Belgrano",
    address: "Av. Cabildo 2345, CABA",
    phone: "+54 11 5555-1234",
    email: "turnos@vetbelgrano.com",
    website: "www.vetbelgrano.com",
    hours: "Lun-Vie: 9:00-19:00, Sáb: 9:00-15:00",
    services: ["Consultas", "Vacunación", "Peluquería", "Guardería"],
    veterinarians: ["Dra. Ana López", "Dr. Roberto Silva"],
    rating: 4.7,
    reviews: 89,
    emergency: false,
    image: "/veterinary-clinic-3.jpg",
  },
]

export function VeterinaryDirectory() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">{mockVeterinaries.length} veterinarias disponibles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockVeterinaries.map((vet) => (
          <VeterinaryCard key={vet.id} veterinary={vet} />
        ))}
      </div>
    </div>
  )
}






