"use client"

import { Button } from "./ui/button.jsx"
import { useRouter } from "next/navigation"
import { useAuth } from "./backend-auth-provider.js"

export function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()

  const handleExplorarMascotas = () => {
    router.push('/adoptar')
  }

  return (
    <div className="bg-accent text-accent-foreground rounded-2xl p-8 mb-8 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">
          {user ? `¡Hola, ${user.nombre}!` : '¡Hola!'}
        </h2>
        <p className="text-xl mb-6">Encontrá tu nueva mascota</p>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleExplorarMascotas}
        >
          Explorar Mascotas
        </Button>
      </div>

      {/* Hero Image */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
        <img
          src="/golden-retriever-dog-happy.jpg"
          alt="Perro golden retriever feliz"
          className="w-72 h-48 object-cover rounded-lg"
        />
      </div>
    </div>
  )
}






