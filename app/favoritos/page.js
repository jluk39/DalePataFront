"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { FavoritesTabs } from "../../components/favorites-tabs.js"
import { FavoritePets } from "../../components/favorite-pets.js"
import { FavoriteLostPets } from "../../components/favorite-lost-pets.js"
import { FavoriteVeterinarians } from "../../components/favorite-veterinarians.js"
import UserProtectedRoute from "../../components/user/user-protected-route.jsx"

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState("mascotas")

  return (
    <UserProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Mis Favoritos</h1>
                <p className="text-muted-foreground mt-1">
                  Guarda y organiza tus mascotas, veterinarias y reportes favoritos
                </p>
              </div>

              <FavoritesTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="mt-6">
                {activeTab === "mascotas" && <FavoritePets />}
                {activeTab === "perdidos" && <FavoriteLostPets />}
                {activeTab === "veterinarias" && <FavoriteVeterinarians />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </UserProtectedRoute>
  )
}






