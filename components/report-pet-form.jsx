"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Label } from "./ui/label.jsx"
import { Textarea } from "./ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.jsx"
import { Checkbox } from "./ui/checkbox.jsx"
import { Calendar } from "./ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function ReportPetForm() {
  const [reportType, setReportType] = useState("lost")
  const [date, setDate] = useState()
  const [formData, setFormData] = useState({
    // Pet Info
    petName: "",
    petType: "",
    breed: "",
    age: "",
    gender: "",
    color: "",
    size: "",
    description: "",

    // Location & Date
    location: "",
    lastSeenDate: "",

    // Contact Info
    contactName: "",
    contactPhone: "",
    contactEmail: "",

    // Additional Info
    reward: "",
    hasReward: false,
    urgent: false,
    additionalInfo: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Report submitted:", { reportType, ...formData, lastSeenDate: date })
    alert(`¡Reporte de mascota ${reportType === "lost" ? "perdida" : "encontrada"} enviado exitosamente!`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Report Type */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={reportType} onValueChange={(value) => setReportType(value | "found")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost">Mascota Perdida - Busco a mi mascota</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found">Mascota Encontrada - Encontré una mascota</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Pet Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="petName">{reportType === "lost" ? "Nombre de la mascota" : "Nombre (si lo conoces)"}</Label>
            <Input
              id="petName"
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
              placeholder={reportType === "lost" ? "Nombre de tu mascota" : "Desconocido si no sabes"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Animal</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, petType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="conejo">Conejo</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Ej: Labrador, Mestizo, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Edad Aproximada</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cachorro">Cachorro (0-1 año)</SelectItem>
                  <SelectItem value="joven">Joven (1-3 años)</SelectItem>
                  <SelectItem value="adulto">Adulto (3-7 años)</SelectItem>
                  <SelectItem value="senior">Senior (7+ años)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Género</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                  <SelectItem value="desconocido">No estoy seguro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tamaño</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeño">Pequeño</SelectItem>
                  <SelectItem value="mediano">Mediano</SelectItem>
                  <SelectItem value="grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="color">Color/Colores</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="Ej: Negro, Blanco y marrón, Dorado, etc."
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe características distintivas, comportamiento, collar, etc."
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <Label>Foto de la Mascota</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Arrastra una foto aquí o haz clic para seleccionar</p>
              <Button type="button" variant="outline" size="sm">
                Seleccionar Foto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Date */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación y Fecha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="location">
              {reportType === "lost" ? "Lugar donde se perdió" : "Lugar donde fue encontrada"}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Parque Centenario, Villa Crespo, CABA"
            />
          </div>

          <div>
            <Label>{reportType === "lost" ? "Fecha en que se perdió" : "Fecha en que fue encontrada"}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactName">Nombre Completo</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">Teléfono</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+54 11 1234-5678"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportType === "lost" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasReward"
                  checked={formData.hasReward}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasReward: checked })}
                />
                <Label htmlFor="hasReward">Ofrezco recompensa</Label>
              </div>

              {formData.hasReward && (
                <div>
                  <Label htmlFor="reward">Monto de la Recompensa</Label>
                  <Input
                    id="reward"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                    placeholder="Ej: $50.000"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={formData.urgent}
              onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })}
            />
            <Label htmlFor="urgent">
              {reportType === "lost"
                ? "Caso urgente (mascota enferma o en peligro)"
                : "Caso urgente (mascota necesita cuidados inmediatos)"}
            </Label>
          </div>

          <div>
            <Label htmlFor="additionalInfo">Información Adicional</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              placeholder="Cualquier información adicional que pueda ayudar..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          {reportType === "lost" ? "Reportar Mascota Perdida" : "Reportar Mascota Encontrada"}
        </Button>
      </div>
    </form>
  )
}







