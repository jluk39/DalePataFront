import { Sidebar } from "../../../components/sidebar.js"
import { Header } from "../../../components/header.js"
import { NewAppointmentForm } from "../../../components/new-appointment-form.jsx"

export default function NuevoTurnoPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Agendar Nuevo Turno</h1>
              <p className="text-muted-foreground">Programa una cita veterinaria para tu mascota</p>
            </div>

            <NewAppointmentForm />
          </div>
        </main>
      </div>
    </div>
  )
}






