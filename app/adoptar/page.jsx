"use client"

import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { AdoptionFilters } from "../../components/adoption-filters.jsx"
import { AdoptionGrid } from "../../components/adoption-grid.jsx"
import { ProtectedRoute } from "../../components/protected-route.jsx"

export default function AdoptarPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Adoptar una Mascota</h1>
              <p className="text-muted-foreground">Encuentra tu compañero perfecto y dale una segunda oportunidad</p>
            </div>

            <div className="flex gap-6">
              <aside className="w-80">
                <AdoptionFilters />
              </aside>
              <div className="flex-1">
                <AdoptionGrid />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}







