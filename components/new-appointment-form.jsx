"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Label } from "./ui/label.jsx"
import { Textarea } from "./ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { Calendar } from "./ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function NewAppointmentForm() {
  const [selectedDate, setSelectedDate] = useState()
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    appointmentType: "",
    veterinary: "",
    veterinarian: "",
    preferredTime: "",
    reason: "",
    symptoms: "",
    urgency: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Appointment request:", { ...formData, date: selectedDate })
    alert("¡Solicitud de turno enviada! Te contactaremos para confirmar la disponibilidad.")
  }

  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pet Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petName">Nombre de la Mascota</Label>
              <Input
                id="petName"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                required
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Turno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipo de Consulta</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta-general">Consulta General</SelectItem>
                <SelectItem value="vacunacion">Vacunación</SelectItem>
                <SelectItem value="cirugia">Cirugía</SelectItem>
                <SelectItem value="emergencia">Emergencia</SelectItem>
                <SelectItem value="control">Control de Rutina</SelectItem>
                <SelectItem value="esterilizacion">Esterilización</SelectItem>
                <SelectItem value="dental">Limpieza Dental</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Veterinaria</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, veterinary: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar veterinaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vet-san-martin">Veterinaria San Martín</SelectItem>
                  <SelectItem value="vet-24hs">Clínica Veterinaria 24hs</SelectItem>
                  <SelectItem value="vet-belgrano">Centro Veterinario Belgrano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Veterinario (Opcional)</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, veterinarian: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin preferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-gonzalez">Dr. María González</SelectItem>
                  <SelectItem value="dr-ruiz">Dr. Carlos Ruiz</SelectItem>
                  <SelectItem value="dra-lopez">Dra. Ana López</SelectItem>
                  <SelectItem value="dr-perez">Dr. Juan Pérez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha Preferida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Horario Preferido</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar horario" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time} hs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Urgencia</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar urgencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Rutina - Puede esperar</SelectItem>
                <SelectItem value="soon">Pronto - En los próximos días</SelectItem>
                <SelectItem value="urgent">Urgente - Lo antes posible</SelectItem>
                <SelectItem value="emergency">Emergencia - Inmediato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Médica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivo de la Consulta</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Describe brevemente el motivo de la consulta..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="symptoms">Síntomas Observados (si aplica)</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="Describe los síntomas que has observado en tu mascota..."
              rows={3}
            />
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

          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Cualquier información adicional que consideres importante..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Solicitar Turno
        </Button>
      </div>
    </form>
  )
}







