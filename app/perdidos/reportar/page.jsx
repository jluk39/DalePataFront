import { Sidebar } from "../../../components/sidebar.js"
import { Header } from "../../../components/header.js"
import { ReportPetForm } from "../../../components/report-pet-form.jsx"

export default function ReportarPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Reportar Mascota</h1>
              <p className="text-muted-foreground">
                Completa el formulario para reportar una mascota que hayas visto perdida o encontrada en la vía pública
              </p>
            </div>

            <ReportPetForm />
          </div>
        </main>
      </div>
    </div>
  )
}






