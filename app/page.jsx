import { Sidebar } from "../components/sidebar.js"
import { Header } from "../components/header-debug.js"
import { HeroSection } from "../components/hero-section.jsx"
import { PetGrid } from "../components/pet-grid.jsx"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <HeroSection />
          <PetGrid />
        </main>
      </div>
    </div>
  )
}







