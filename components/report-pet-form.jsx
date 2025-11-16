"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx"
import { Button } from "./ui/button.jsx"
import { Input } from "./ui/input.jsx"
import { Label } from "./ui/label.jsx"
import { Textarea } from "./ui/textarea.jsx"
import { Checkbox } from "./ui/checkbox.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.jsx"
import { Calendar } from "./ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx"
import { CalendarIcon, Loader2, Upload, X, ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MapboxGeocoderInput } from "./mapbox-geocoder.jsx"
import { ApiService } from "../lib/api.js"
import { useToast } from "../hooks/use-toast"
import { useRouter } from "next/navigation"

export function ReportPetForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [date, setDate] = useState()
  const [loading, setLoading] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [locationData, setLocationData] = useState({
    address: '',
    lat: null,
    lon: null
  })
  
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    breed: "",
    gender: "",
    color: "",
    size: "",
    description: "",
  })

  const handleLocationSelect = (location) => {
    console.log('📍 Ubicación seleccionada:', location)
    setLocationData({
      address: location.address,
      lat: location.lat,
      lon: location.lon
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Solo se permiten archivos JPG, PNG o WEBP",
        variant: "destructive"
      })
      return
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Archivo muy grande",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive"
      })
      return
    }

    setImageFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!locationData.address) {
        toast({
          title: "Ubicación requerida",
          description: "Por favor, selecciona una ubicación",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (!formData.petName || !formData.petType) {
        toast({
          title: "Campos requeridos",
          description: "Por favor, completa nombre y tipo de animal",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (!date) {
        toast({
          title: "Fecha requerida",
          description: "Por favor, selecciona la fecha del avistamiento",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (!imageFile) {
        toast({
          title: "Imagen requerida",
          description: "Por favor, sube una foto de la mascota",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (!acceptTerms) {
        toast({
          title: "Consentimiento requerido",
          description: "Debes aceptar que tus datos de contacto sean visibles",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      // Crear FormData para enviar con imagen
      const formDataToSend = new FormData()
      
      // Agregar campos de texto
      formDataToSend.append('nombre', formData.petName)
      formDataToSend.append('especie', formData.petType)
      formDataToSend.append('perdida_direccion', locationData.address)
      
      // Solo agregar género si se seleccionó "Macho" o "Hembra" (no "unknown")
      if (formData.gender && formData.gender !== 'unknown') {
        formDataToSend.append('sexo', formData.gender)
      }
      if (formData.breed) formDataToSend.append('raza', formData.breed)
      if (formData.color) formDataToSend.append('color', formData.color)
      if (formData.size) formDataToSend.append('tamaño', formData.size)
      if (formData.description) formDataToSend.append('descripcion', formData.description)
      
      // Agregar coordenadas si existen
      if (locationData.lat) formDataToSend.append('perdida_lat', locationData.lat.toString())
      if (locationData.lon) formDataToSend.append('perdida_lon', locationData.lon.toString())
      
      // Agregar la fecha seleccionada
      if (date) formDataToSend.append('perdida_fecha', date.toISOString())
      
      // Agregar imagen (obligatoria) - el backend espera el campo "imagen"
      formDataToSend.append('imagen', imageFile)

      const result = await ApiService.reportLostPetSighting(formDataToSend)

      toast({
        title: "✅ Reporte enviado",
        description: "Avistamiento registrado con imagen exitosamente"
      })

      setTimeout(() => {
        router.push('/perdidos')
      }, 1500)

    } catch (error) {
      console.error('Error al enviar reporte:', error)
      toast({
        title: "Error",
        description: error.message || 'No se pudo enviar el reporte',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="petName">Nombre o descripción *</Label>
            <Input
              id="petName"
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
              placeholder="Ej: Perro encontrado, Max, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Animal *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, petType: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="Ej: Labrador, Mestizo"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Género</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                  <SelectItem value="unknown">No estoy seguro</SelectItem>
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
                  <SelectItem value="Pequeño">Pequeño</SelectItem>
                  <SelectItem value="Mediano">Mediano</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ej: Negro, Marrón"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe características distintivas..."
              rows={4}
            />
          </div>

          {/* Sección de carga de imagen */}
          <div>
            <Label>Foto de la Mascota *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Una foto es esencial para identificar a la mascota (máx 5MB)
            </p>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-primary">Click para subir</span> o arrastra una imagen
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PNG o WEBP (máx. 5MB)
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-gray-300 rounded-lg p-4">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4" />
                </Button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {imageFile?.name} ({(imageFile?.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación y Fecha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Lugar donde fue vista *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Escribe la dirección y selecciona una opción
            </p>
            <MapboxGeocoderInput
              onResult={handleLocationSelect}
              placeholder="Ej: Parque Centenario, CABA"
            />
            {locationData.address && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {locationData.address}
              </p>
            )}
          </div>

          <div>
            <Label>Fecha en que fue vista *</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={(newDate) => {
                    setDate(newDate)
                    setCalendarOpen(false)
                  }}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-2 p-4 border rounded-lg bg-muted/50">
            <Checkbox 
              id="terms" 
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
              required
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Acepto que mis datos de contacto sean visibles *
              </label>
              <p className="text-sm text-muted-foreground">
                Tu nombre, teléfono y email serán visibles para otros usuarios que puedan haber visto a esta mascota
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" size="lg" disabled={loading || !acceptTerms}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Reportar Mascota'
          )}
        </Button>
      </div>
    </form>
  )
}
