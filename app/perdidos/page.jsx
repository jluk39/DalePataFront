import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { LostFoundTabs } from "../../components/lost-found-tabs.jsx"
import UserProtectedRoute from "../../components/user/user-protected-route.jsx"

export default function PerdidosPage() {
  return (
    <UserProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Mascotas Perdidas y Encontradas</h1>
              <p className="text-muted-foreground">Ayuda a reunir mascotas con sus familias</p>
            </div>

            <LostFoundTabs />
          </main>
        </div>
      </div>
    </UserProtectedRoute>
  )
}







