"use client"

import { useState } from "react"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"
import { Textarea } from "../ui/textarea.jsx"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx"
import { Upload, X } from "lucide-react"
import { ApiService } from "../../lib/api.js"

export default function UserAddPetModal({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    sexo: "",
    peso: "",
    color: "",
    descripcion: "",
    tamaño: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (field, value) => {
    console.log(`📝 Campo actualizado: ${field} = "${value}"`)
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede superar los 5MB')
        return
      }

      // Validar formato
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validFormats.includes(file.type)) {
        setError('Formato de imagen no válido. Use JPEG, PNG o WebP')
        return
      }

      setError(null)
      setImageFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      
      // Validar campos obligatorios básicos para usuarios
      const camposFaltantes = []
      
      if (!formData.nombre || !formData.nombre.trim()) {
        camposFaltantes.push('Nombre')
      }

      if (!formData.sexo || formData.sexo === '') {
        camposFaltantes.push('Sexo')
      }

      if (!formData.especie || formData.especie === '') {
        camposFaltantes.push('Especie')
      }

      if (camposFaltantes.length > 0) {
        const mensajeError = `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
        console.error('❌ VALIDACIÓN FALLIDA:', mensajeError)
        setError(mensajeError)
        setLoading(false)
        return
      }

      // Crear FormData para enviar con imagen
      const formDataToSend = new FormData()

      // Agregar campos obligatorios
      formDataToSend.append('nombre', formData.nombre.trim())
      formDataToSend.append('sexo', formData.sexo)
      formDataToSend.append('especie', formData.especie)
      
      // Para usuarios, establecer valores por defecto para campos de refugio
      formDataToSend.append('estado_salud', 'Saludable') // Default para mascotas de usuarios
      formDataToSend.append('en_adopcion', 'false') // Las mascotas de usuarios no están en adopción por defecto

      // Agregar campos opcionales solo si tienen valor
      if (formData.raza && formData.raza.trim()) {
        formDataToSend.append('raza', formData.raza.trim())
      }
      if (formData.fecha_nacimiento && formData.fecha_nacimiento !== '') {
        formDataToSend.append('fecha_nacimiento', formData.fecha_nacimiento)
      }
      if (formData.peso && formData.peso !== '') {
        formDataToSend.append('peso', formData.peso)
      }
      if (formData.color && formData.color.trim()) {
        formDataToSend.append('color', formData.color.trim())
      }
      if (formData.descripcion && formData.descripcion.trim()) {
        formDataToSend.append('descripcion', formData.descripcion.trim())
      }
      if (formData.tamaño && formData.tamaño.trim()) {
        formDataToSend.append('tamaño', formData.tamaño.trim())
      }

      // Agregar imagen si existe
      if (imageFile) {
        formDataToSend.append('imagen', imageFile)
      }

      // Llamar al API
      const resultado = await ApiService.createPet(formDataToSend)

      // Llamar callback si existe
      if (onSubmit) {
        onSubmit(resultado)
      }

      // Reset form
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        fecha_nacimiento: "",
        sexo: "",
        peso: "",
        color: "",
        descripcion: "",
        tamaño: "",
      })
      setImageFile(null)
      setImagePreview(null)
      setError(null)
      onOpenChange(false)

      // Mostrar mensaje de éxito
      alert(`✅ Mascota "${resultado.nombre}" registrada exitosamente`)
      
      // Recargar la página para mostrar la nueva mascota
      window.location.reload()
    } catch (error) {
      console.error("Error adding pet:", error)
      setError(error.message || 'Error al registrar la mascota')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Registrar Mi Mascota</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Agrega información básica de tu mascota
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">Foto de la mascota</Label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-input border-border text-foreground"
                />
                <p className="text-muted-foreground text-sm mt-1">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-foreground">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className="bg-input border-border text-foreground"
                placeholder="Ej: Max, Luna, Bella"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie" className="text-foreground">
                Especie *
              </Label>
              <Select value={formData.especie} onValueChange={(value) => handleInputChange("especie", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="raza" className="text-foreground">
                Raza
              </Label>
              <Input
                id="raza"
                value={formData.raza}
                onChange={(e) => handleInputChange("raza", e.target.value)}
                className="bg-input border-border text-foreground"
                placeholder="Ej: Golden Retriever, Siamés, Mestizo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo" className="text-foreground">
                Sexo *
              </Label>
              <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Birth Date and Physical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento" className="text-foreground">
                Fecha de nacimiento
              </Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)}
                className="bg-input border-border text-foreground"
                max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                min={new Date(new Date().getFullYear() - 30, 0, 1).toISOString().split('T')[0]} // Máximo 30 años atrás
              />
              <p className="text-muted-foreground text-sm">
                Si no conoces la fecha exacta, puedes usar una aproximada
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso" className="text-foreground">
                Peso (kg)
              </Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={formData.peso}
                onChange={(e) => handleInputChange("peso", e.target.value)}
                className="bg-input border-border text-foreground"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className="text-foreground">
                Color
              </Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="bg-input border-border text-foreground"
                placeholder="Ej: Dorado, Negro, Blanco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamaño" className="text-foreground">
                Tamaño
              </Label>
              <Select value={formData.tamaño} onValueChange={(value) => handleInputChange("tamaño", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecciona el tamaño" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Pequeño">Pequeño</SelectItem>
                  <SelectItem value="Mediano">Mediano</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              className="bg-input border-border text-foreground min-h-[100px]"
              placeholder="Describe la personalidad, comportamiento y características especiales de tu mascota..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading || !formData.nombre || !formData.especie || !formData.sexo}
            >
              {loading ? "Guardando..." : "Registrar Mascota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}