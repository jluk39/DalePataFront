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
import { ApiService } from "../lib/api.js"
import { useAuth } from "./backend-auth-provider.js"

export function AdoptionForm({ petId }) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    housingType: "",
    hasYard: "",
    landlordPermission: false,
    petExperience: "",
    currentPets: "",
    adoptionReason: "",
    timeCommitment: "",
  })

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.housingType) newErrors.housingType = "Selecciona el tipo de vivienda"
    if (!formData.hasYard) newErrors.hasYard = "Indica si tienes patio"
    return newErrors
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.petExperience) {
      newErrors.petExperience = "Indica si has tenido mascotas antes"
    }
    if (!formData.currentPets) {
      newErrors.currentPets = "Indica si tienes mascotas actualmente"
    }
    return newErrors
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.adoptionReason.trim()) {
      newErrors.adoptionReason = "Explica tu motivación para adoptar"
    } else if (formData.adoptionReason.trim().length < 20) {
      newErrors.adoptionReason = "Proporciona más detalles (mínimo 20 caracteres)"
    }
    if (!formData.timeCommitment.trim()) {
      newErrors.timeCommitment = "Indica el tiempo que puedes dedicar"
    }
    return newErrors
  }

  const handleNext = () => {
    let validationErrors = {}
    switch(step) {
      case 1: validationErrors = validateStep1(); break
      case 2: validationErrors = validateStep2(); break
      case 3: validationErrors = validateStep3(); break
    }
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0 && step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    const validationErrors = validateStep3()
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length === 0) {
      // Verificar que el usuario esté autenticado
      if (!user) {
        setErrors({ submit: 'Debes iniciar sesión para enviar una solicitud de adopción' })
        return
      }

      setLoading(true)
      
      try {
        console.log("📤 Enviando solicitud de adopción:", { petId, formData, user: user.email })
        
        const result = await ApiService.createAdoptionRequest(petId, formData)
        
        console.log("✅ Solicitud enviada exitosamente:", result)
        setSuccess(true)
        
        // Limpiar formulario
        setFormData({
          housingType: "",
          hasYard: "",
          landlordPermission: false,
          petExperience: "",
          currentPets: "",
          adoptionReason: "",
          timeCommitment: "",
        })
        
        // Opcional: mostrar mensaje de éxito por más tiempo
        setTimeout(() => {
          setSuccess(false)
          setStep(1)
        }, 5000)
        
      } catch (error) {
        console.error("❌ Error al enviar solicitud:", error)
        setErrors({ submit: error.message })
      } finally {
        setLoading(false)
      }
    }
  }

  // Mostrar mensaje de éxito si la solicitud fue enviada
  if (success) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>¡Solicitud Enviada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-green-600 text-lg font-semibold">
            ✅ Tu solicitud de adopción ha sido enviada exitosamente
          </div>
          <p className="text-muted-foreground">
            El refugio revisará tu solicitud y se pondrá en contacto contigo pronto.
          </p>
          <p className="text-sm text-muted-foreground">
            Recibirás una notificación por email cuando haya novedades.
          </p>
          <Button 
            onClick={() => {
              setSuccess(false)
              setStep(1)
            }}
            variant="outline"
          >
            Enviar otra solicitud
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Verificar autenticación
  if (!user) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>Solicitud de Adopción</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Debes iniciar sesión para enviar una solicitud de adopción
          </p>
          <Button onClick={() => window.location.href = '/auth/login'}>
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Solicitud de Adopción</CardTitle>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {i}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Información de Vivienda</h3>
            <div>
              <Label>Tipo de Vivienda *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, housingType: value })} value={formData.housingType}>
                <SelectTrigger className={errors.housingType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                </SelectContent>
              </Select>
              {errors.housingType && <p className="text-red-500 text-sm mt-1">{errors.housingType}</p>}
            </div>
            <div>
              <Label>¿Tienes patio? *</Label>
              <RadioGroup onValueChange={(value) => setFormData({ ...formData, hasYard: value })} value={formData.hasYard} className={errors.hasYard ? "border border-red-500 rounded p-2" : ""}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="yard-yes" />
                  <Label htmlFor="yard-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="yard-no" />
                  <Label htmlFor="yard-no">No</Label>
                </div>
              </RadioGroup>
              {errors.hasYard && <p className="text-red-500 text-sm mt-1">{errors.hasYard}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="landlord" checked={formData.landlordPermission} onCheckedChange={(checked) => setFormData({ ...formData, landlordPermission: checked })} />
              <Label htmlFor="landlord">Tengo permiso del propietario (si alquilo)</Label>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Experiencia con Mascotas</h3>
            <div>
              <Label>¿Has tenido mascotas antes? *</Label>
              <RadioGroup onValueChange={(value) => setFormData({ ...formData, petExperience: value })} value={formData.petExperience} className={errors.petExperience ? "border border-red-500 rounded p-2" : ""}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="exp-yes" />
                  <Label htmlFor="exp-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="exp-no" />
                  <Label htmlFor="exp-no">No</Label>
                </div>
              </RadioGroup>
              {errors.petExperience && <p className="text-red-500 text-sm mt-1">{errors.petExperience}</p>}
            </div>
            <div>
              <Label>¿Tienes mascotas actualmente? *</Label>
              <RadioGroup onValueChange={(value) => setFormData({ ...formData, currentPets: value })} value={formData.currentPets} className={errors.currentPets ? "border border-red-500 rounded p-2" : ""}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="current-yes" />
                  <Label htmlFor="current-yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="current-no" />
                  <Label htmlFor="current-no">No</Label>
                </div>
              </RadioGroup>
              {errors.currentPets && <p className="text-red-500 text-sm mt-1">{errors.currentPets}</p>}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Motivación y Compromiso</h3>
            <div>
              <Label htmlFor="adoptionReason">¿Por qué quieres adoptar esta mascota? *</Label>
              <Textarea id="adoptionReason" placeholder="Explica tus razones para adoptar..." value={formData.adoptionReason} onChange={(e) => setFormData({ ...formData, adoptionReason: e.target.value })} className={errors.adoptionReason ? "border-red-500" : ""} rows={4} />
              {errors.adoptionReason && <p className="text-red-500 text-sm mt-1">{errors.adoptionReason}</p>}
            </div>
            <div>
              <Label htmlFor="timeCommitment">¿Cuánto tiempo puedes dedicar diariamente? *</Label>
              <Input id="timeCommitment" placeholder="Ej: 3-4 horas diarias" value={formData.timeCommitment} onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })} className={errors.timeCommitment ? "border-red-500" : ""} />
              {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment}</p>}
            </div>
          </div>
        )}
        
        {/* Mostrar errores de envío */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={loading}
            >
              Anterior
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} className="ml-auto">
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="ml-auto" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enviando...
                </>
              ) : (
                'Enviar Solicitud'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
