"use client"

import { useState } from "react"
import { Sidebar } from "../../components/sidebar.js"
import { Header } from "../../components/header.js"
import { MedicalRecordsTabs } from "../../components/medical-records-tabs.js"
import { MyPetsList } from "../../components/my-pets-list.js"
import { MedicalHistory } from "../../components/medical-history.js"
import { VaccinationSchedule } from "../../components/vaccination-schedule.js"
import { AddPetModal } from "../../components/add-pet-modal.js"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"
import { ProtectedRoute } from "../../components/protected-route.jsx"

export default function MedicalRecordsPage() {
  const [selectedPet, setSelectedPet] = useState(null)
  const [activeTab, setActiveTab] = useState("mis-mascotas")
  const [showAddPetModal, setShowAddPetModal] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Historial Médico</h1>
                  <p className="text-muted-foreground mt-1">Gestiona la salud y el historial médico de tus mascotas</p>
                </div>
                <Button onClick={() => setShowAddPetModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Mascota
                </Button>
              </div>

              <MedicalRecordsTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="mt-6">
                {activeTab === "mis-mascotas" && <MyPetsList onSelectPet={setSelectedPet} selectedPet={selectedPet} />}
                {activeTab === "historial" && selectedPet && <MedicalHistory pet={selectedPet} />}
                {activeTab === "vacunas" && selectedPet && <VaccinationSchedule pet={selectedPet} />}
              </div>

              {!selectedPet && activeTab !== "mis-mascotas" && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Selecciona una mascota para ver su información médica</p>
                </div>
              )}
            </div>
          </main>
        </div>

        <AddPetModal open={showAddPetModal} onClose={() => setShowAddPetModal(false)} />
      </div>
    </ProtectedRoute>
  )
}







