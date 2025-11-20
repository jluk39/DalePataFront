import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { HeroSection } from "../../components/hero-section.jsx"
import { MyPetsGrid } from "../../components/my-pets-grid.jsx"
import UserProtectedRoute from "../../components/user/user-protected-route.jsx"

export default function HomePage() {
  return (
    <UserProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <HeroSection />
            <MyPetsGrid />
          </main>
        </div>
      </div>
    </UserProtectedRoute>
  )
}







