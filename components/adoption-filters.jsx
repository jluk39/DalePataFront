import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Label } from "./ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { Checkbox } from "./ui/checkbox.jsx"
import { Button } from "./ui/button.jsx"
import { Slider } from "./ui/slider.jsx"

export function AdoptionFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Búsqueda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Animal */}
        <div className="space-y-2">
          <Label>Tipo de Animal</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perro">Perro</SelectItem>
              <SelectItem value="gato">Gato</SelectItem>
              <SelectItem value="conejo">Conejo</SelectItem>
              <SelectItem value="ave">Ave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tamaño */}
        <div className="space-y-2">
          <Label>Tamaño</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="pequeño" />
              <Label htmlFor="pequeño">Pequeño</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mediano" />
              <Label htmlFor="mediano">Mediano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="grande" />
              <Label htmlFor="grande">Grande</Label>
            </div>
          </div>
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <Label>Edad (años)</Label>
          <Slider defaultValue={[0, 15]} max={15} step={1} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0</span>
            <span>15+</span>
          </div>
        </div>

        {/* Género */}
        <div className="space-y-2">
          <Label>Género</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="macho">Macho</SelectItem>
              <SelectItem value="hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado de Salud */}
        <div className="space-y-2">
          <Label>Estado de Salud</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="vacunado" />
              <Label htmlFor="vacunado">Vacunado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="esterilizado" />
              <Label htmlFor="esterilizado">Esterilizado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="desparasitado" />
              <Label htmlFor="desparasitado">Desparasitado</Label>
            </div>
          </div>
        </div>

        <Button className="w-full">Aplicar Filtros</Button>
      </CardContent>
    </Card>
  )
}






