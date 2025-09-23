"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx"
import { Button } from "./ui/button.jsx"
import { Plus } from "lucide-react"
import { LostPetsGrid } from "./lost-pets-grid.jsx"
import { FoundPetsGrid } from "./found-pets-grid.jsx"
import Link from "next/link"

export function LostFoundTabs() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div></div>
        <Link href="/perdidos/reportar">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Reportar Mascota
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="perdidas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perdidas">Mascotas Perdidas</TabsTrigger>
          <TabsTrigger value="encontradas">Mascotas Encontradas</TabsTrigger>
        </TabsList>

        <TabsContent value="perdidas" className="space-y-6">
          <LostPetsGrid />
        </TabsContent>

        <TabsContent value="encontradas" className="space-y-6">
          <FoundPetsGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}






