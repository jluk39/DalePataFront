"use client"

import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { AppointmentTabs } from "../../components/appointment-tabs.jsx"
import { ProtectedRoute } from "../../components/protected-route.jsx"

export default function TurnosPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Turnos Veterinarios</h1>
              <p className="text-muted-foreground">Gestiona las citas médicas de tus mascotas</p>
            </div>

            <AppointmentTabs />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}







