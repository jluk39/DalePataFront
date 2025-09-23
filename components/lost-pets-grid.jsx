import { LostFoundCard } from "./lost-found-card.jsx"

const mockLostPets = [
  {
    id: "1",
    name: "Max",
    type: "Perro",
    breed: "Golden Retriever",
    age: "3 años",
    gender: "Macho",
    color: "Dorado",
    size: "Grande",
    description: "Max se perdió en el parque Centenario. Lleva collar azul con placa de identificación.",
    image: "/golden-retriever-dog-happy.jpg",
    location: "Parque Centenario, CABA",
    lastSeen: "2024-03-15",
    contactName: "María González",
    contactPhone: "+54 11 1234-5678",
    contactEmail: "maria@email.com",
    reward: "$50.000",
    status: "lost",
    urgent: true,
  },
  {
    id: "2",
    name: "Luna",
    type: "Gato",
    breed: "Siamés",
    age: "2 años",
    gender: "Hembra",
    color: "Crema y marrón",
    size: "Pequeño",
    description: "Luna es muy tímida. Se escapó por la ventana durante una tormenta.",
    image: "/siamese-cat-cream-brown.jpg",
    location: "Villa Crespo, CABA",
    lastSeen: "2024-03-18",
    contactName: "Carlos Ruiz",
    contactPhone: "+54 11 9876-5432",
    contactEmail: "carlos@email.com",
    reward: null,
    status: "lost",
    urgent: false,
  },
  {
    id: "3",
    name: "Rocky",
    type: "Perro",
    breed: "Mestizo",
    age: "5 años",
    gender: "Macho",
    color: "Negro y blanco",
    size: "Mediano",
    description: "Rocky es muy amigable. Se perdió cerca del mercado de San Telmo.",
    image: "/black-dog-mixed-breed.jpg",
    location: "San Telmo, CABA",
    lastSeen: "2024-03-20",
    contactName: "Ana López",
    contactPhone: "+54 11 5555-1234",
    contactEmail: "ana@email.com",
    reward: "$30.000",
    status: "lost",
    urgent: true,
  },
]

export function LostPetsGrid() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground">{mockLostPets.length} mascotas perdidas reportadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLostPets.map((pet) => (
          <LostFoundCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}






