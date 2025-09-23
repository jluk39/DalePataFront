import { LostFoundCard } from "./lost-found-card.jsx"

const mockFoundPets = [
  {
    id: "4",
    name: "Desconocido",
    type: "Perro",
    breed: "Labrador Mix",
    age: "Adulto joven",
    gender: "Hembra",
    color: "Chocolate",
    size: "Grande",
    description: "Encontrada en la plaza de Belgrano. Muy cariñosa y bien cuidada, claramente tiene familia.",
    image: "/brown-mixed-breed-dog.jpg",
    location: "Plaza Belgrano, CABA",
    lastSeen: "2024-03-19",
    contactName: "Pedro Martínez",
    contactPhone: "+54 11 7777-8888",
    contactEmail: "pedro@email.com",
    reward: null,
    status: "found",
    urgent: false,
  },
  {
    id: "5",
    name: "Desconocido",
    type: "Gato",
    breed: "Doméstico",
    age: "Cachorro",
    gender: "Macho",
    color: "Naranja",
    size: "Pequeño",
    description: "Gatito encontrado en la estación de tren. Muy pequeño, necesita cuidados.",
    image: "/orange-tabby-cat.png",
    location: "Estación Retiro, CABA",
    lastSeen: "2024-03-21",
    contactName: "Laura Fernández",
    contactPhone: "+54 11 3333-4444",
    contactEmail: "laura@email.com",
    reward: null,
    status: "found",
    urgent: true,
  },
]

export function FoundPetsGrid() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-muted-foreground">{mockFoundPets.length} mascotas encontradas reportadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFoundPets.map((pet) => (
          <LostFoundCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  )
}






