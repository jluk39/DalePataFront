import { Sidebar } from "../../../components/sidebar.js"
import { Header } from "../../../components/header.js"
import { PetProfile } from "../../../components/pet-profile.jsx"
import { AdoptionForm } from "../../../components/adoption-form.jsx"

export default function PetDetailPage({ params }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <PetProfile petId={params.id} />
              </div>
              <div>
                <AdoptionForm petId={params.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
