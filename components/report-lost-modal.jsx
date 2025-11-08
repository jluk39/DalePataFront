"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.jsx"
import { Button } from "./ui/button.jsx"
import { Label } from "./ui/label.jsx"
import { Textarea } from "./ui/textarea.jsx"
import { Calendar } from "./ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.jsx"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MapboxGeocoderInput } from "./mapbox-geocoder.jsx"
import { ApiService } from "../lib/api.js"
import { useToast } from "../hooks/use-toast"
import { Alert, AlertDescription } from "./ui/alert.jsx"

/**
 * Modal para reportar una mascota propia como perdida
 * Se usa desde la sección "Mis Mascotas"
 */
export function ReportLostModal({ pet, open, onOpenChange, onSuccess }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState()
  const [description, setDescription] = useState("")
  const [locationData, setLocationData] = useState({
    address: '',
    lat: null,
    lon: null
  })

  const handleLocationSelect = (location) => {
    console.log('📍 Ubicación seleccionada:', location)
    setLocationData({
      address: location.address,
      lat: location.lat,
      lon: location.lon
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar ubicación
      if (!locationData.address) {
        toast({
          title: "Ubicación requerida",
          description: "Por favor, selecciona dónde se perdió tu mascota",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      // Validar fecha
      if (!date) {
        toast({
          title: "Fecha requerida",
          description: "Por favor, selecciona cuándo se perdió",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      // Preparar datos para enviar
      const reportData = {
        perdida_direccion: locationData.address,
        perdida_lat: locationData.lat,
        perdida_lon: locationData.lon,
        descripcion: description || `${pet.name} se perdió el ${format(date, "PPP", { locale: es })}`
      }

      console.log('📤 Reportando mascota perdida:', reportData)

      // Llamar a la API
      const result = await ApiService.reportPetAsLost(pet.id, reportData)

      // Mostrar mensaje de éxito
      toast({
        title: "✅ Mascota reportada como perdida",
        description: result.geocoded 
          ? "Tu mascota aparecerá en el mapa de perdidos con ubicación geocodificada"
          : "Tu mascota aparecerá en la lista de perdidos"
      })

      // Limpiar formulario
      setDate(null)
      setDescription("")
      setLocationData({ address: '', lat: null, lon: null })

      // Cerrar modal y notificar al padre
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }

    } catch (error) {
      console.error('Error al reportar mascota perdida:', error)
      toast({
        title: "Error",
        description: error.message || 'No se pudo reportar la mascota como perdida',
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reportar {pet?.name} como perdida</DialogTitle>
          <DialogDescription>
            Completa la información sobre dónde y cuándo se perdió tu mascota
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Tu mascota aparecerá en el mapa de mascotas perdidas para que otros usuarios puedan ayudar a encontrarla
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>¿Dónde se perdió? *</Label>
            <p className="text-sm text-muted-foreground">
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

          <div className="space-y-2">
            <Label>¿Cuándo se perdió? *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción adicional</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe las circunstancias de la pérdida, si llevaba collar, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reportando...
                </>
              ) : (
                'Reportar como Perdida'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
