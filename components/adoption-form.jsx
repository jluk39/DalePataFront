"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Label } from "./ui/label.jsx"
import { Textarea } from "./ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { Checkbox } from "./ui/checkbox.jsx"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.jsx"



export function AdoptionForm({ petId }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",

    // Housing Info
    housingType: "",
    ownRent: "",
    hasYard: "",
    landlordPermission: false,

    // Experience
    petExperience: "",
    currentPets: "",
    vetReference: "",

    // Motivation
    adoptionReason: "",
    timeCommitment: "",
    emergencyPlan: "",
  })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Adoption application submitted:", formData)
    alert("¡Solicitud de adopción enviada! Te contactaremos pronto.")
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Solicitud de Adopción</CardTitle>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Información de Vivienda</h3>
            <div>
              <Label>Tipo de Vivienda</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, housingType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>¿Tienes patio?</Label>
              <RadioGroup onValueChange={(value) => setFormData({ ...formData, hasYard: value })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="yard-yes" />
                  <Label htmlFor="yard-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="yard-no" />
                  <Label htmlFor="yard-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="landlord"
                checked={formData.landlordPermission}
                onCheckedChange={(checked) => setFormData({ ...formData, landlordPermission: checked })}
              />
              <Label htmlFor="landlord">Tengo permiso del propietario (si alquilo)</Label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Experiencia con Mascotas</h3>
            <div>
              <Label htmlFor="petExperience">¿Has tenido mascotas antes?</Label>
              <Textarea
                id="petExperience"
                placeholder="Describe tu experiencia con mascotas..."
                value={formData.petExperience}
                onChange={(e) => setFormData({ ...formData, petExperience: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="currentPets">¿Tienes mascotas actualmente?</Label>
              <Textarea
                id="currentPets"
                placeholder="Describe las mascotas que tienes actualmente..."
                value={formData.currentPets}
                onChange={(e) => setFormData({ ...formData, currentPets: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="vetReference">Veterinario de referencia</Label>
              <Input
                id="vetReference"
                placeholder="Nombre y contacto del veterinario"
                value={formData.vetReference}
                onChange={(e) => setFormData({ ...formData, vetReference: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Motivación y Compromiso</h3>
            <div>
              <Label htmlFor="adoptionReason">¿Por qué quieres adoptar esta mascota?</Label>
              <Textarea
                id="adoptionReason"
                placeholder="Explica tus razones para adoptar..."
                value={formData.adoptionReason}
                onChange={(e) => setFormData({ ...formData, adoptionReason: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="timeCommitment">¿Cuánto tiempo puedes dedicar diariamente?</Label>
              <Input
                id="timeCommitment"
                placeholder="Ej: 3-4 horas diarias"
                value={formData.timeCommitment}
                onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="emergencyPlan">Plan en caso de emergencia o viaje</Label>
              <Textarea
                id="emergencyPlan"
                placeholder="¿Qué harías con la mascota en caso de emergencia?"
                value={formData.emergencyPlan}
                onChange={(e) => setFormData({ ...formData, emergencyPlan: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Anterior
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} className="ml-auto">
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Enviar Solicitud
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}







