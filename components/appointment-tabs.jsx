"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx"
import { Button } from "./ui/button.jsx"
import { Plus } from "lucide-react"
import { UpcomingAppointments } from "./upcoming-appointments.jsx"
import { AppointmentHistory } from "./appointment-history.jsx"
import { VeterinaryDirectory } from "./veterinary-directory.jsx"
import Link from "next/link"

export function AppointmentTabs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div></div>
        <Link href="/turnos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Turno
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="proximos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proximos">Próximos Turnos</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="veterinarias">Veterinarias</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="space-y-6">
          <UpcomingAppointments />
        </TabsContent>

        <TabsContent value="historial" className="space-y-6">
          <AppointmentHistory />
        </TabsContent>

        <TabsContent value="veterinarias" className="space-y-6">
          <VeterinaryDirectory />
        </TabsContent>
      </Tabs>
    </div>
  )
}






