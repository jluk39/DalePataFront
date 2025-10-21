"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"
import { Textarea } from "../ui/textarea.jsx"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx"
import { Upload, X } from "lucide-react"
import { ApiService } from "../../lib/api.js"

export default function EditPetModal({ open, onOpenChange, pet, onPetUpdated }) {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad_anios: "",
    sexo: "",
    peso: "",
    color: "",
    estado_salud: "",
    descripcion: "",
    en_adopcion: false,
    tamaño: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar datos de la mascota cuando se abre el modal
  useEffect(() => {
    if (pet && open) {
      setFormData({
        nombre: pet.name || "",
        especie: pet.species || "",
        raza: pet.breed || "",
        edad_anios: pet.age ? parseInt(pet.age) : "",
        sexo: pet.gender || "",
        peso: pet.weight || "",
        color: pet.color || "",
        estado_salud: pet.healthStatus || "",
        descripcion: pet.description || "",
        en_adopcion: pet.availableForAdoption !== false,
        tamaño: pet.size || "",
      })
      
      // Establecer imagen actual como preview
      if (pet.image) {
        setImagePreview(pet.image)
      }
      
      setImageFile(null)
      setError(null)
    }
  }, [pet, open])

  const handleInputChange = (field, value) => {
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
      // Validar campos obligatorios
      if (!formData.nombre.trim()) {
        setError('El nombre es obligatorio')
        setLoading(false)
        return
      }

      if (!formData.sexo) {
        setError('El sexo es obligatorio')
        setLoading(false)
        return
      }

      // Crear FormData si hay nueva imagen, sino enviar JSON
      let dataToSend

      if (imageFile) {
        // Si hay nueva imagen, usar FormData
        dataToSend = new FormData()
        
        dataToSend.append('nombre', formData.nombre.trim())
        dataToSend.append('sexo', formData.sexo)
        dataToSend.append('especie', formData.especie || 'No especificado')
        dataToSend.append('estado_salud', formData.estado_salud || 'Saludable')
        
        if (formData.raza) dataToSend.append('raza', formData.raza.trim())
        if (formData.edad_anios) dataToSend.append('edad_anios', formData.edad_anios)
        if (formData.peso) dataToSend.append('peso', formData.peso)
        if (formData.color) dataToSend.append('color', formData.color.trim())
        if (formData.descripcion) dataToSend.append('descripcion', formData.descripcion.trim())
        if (formData.tamaño) dataToSend.append('tamaño', formData.tamaño.trim())
        
        dataToSend.append('en_adopcion', formData.en_adopcion ? 'true' : 'false')
        dataToSend.append('imagen', imageFile)
      } else {
        // Si no hay nueva imagen, usar JSON
        dataToSend = {
          nombre: formData.nombre.trim(),
          sexo: formData.sexo,
          especie: formData.especie || 'No especificado',
          estado_salud: formData.estado_salud || 'Saludable',
          raza: formData.raza?.trim() || null,
          edad_anios: formData.edad_anios ? parseInt(formData.edad_anios) : null,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          color: formData.color?.trim() || null,
          descripcion: formData.descripcion?.trim() || null,
          tamaño: formData.tamaño?.trim() || null,
          en_adopcion: formData.en_adopcion
        }
      }

      console.log('🔄 Actualizando mascota:', pet.id)

      const result = await ApiService.updatePet(pet.id, dataToSend)

      // Notificar al componente padre
      if (onPetUpdated) {
        onPetUpdated(result)
      }

      // Cerrar modal
      onOpenChange(false)

      // Mostrar éxito
      alert(`✅ Mascota "${result.nombre}" actualizada exitosamente`)

      // Recargar página para mostrar cambios
      window.location.reload()

    } catch (error) {
      console.error("Error updating pet:", error)
      setError(error.message || 'Error al actualizar la mascota')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setImageFile(null)
    setImagePreview(pet?.image || null)
    setError(null)
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) resetForm()
      }}
    >
      <DialogContent className="bg-background border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Mascota</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Actualiza la información de {pet?.name}
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
                  {imageFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full"
                      onClick={() => {
                        setImagePreview(pet?.image || null)
                        setImageFile(null)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
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
                <p className="text-muted-foreground text-sm mt-1">
                  {imageFile ? 'Nueva imagen seleccionada' : 'Selecciona una nueva imagen (opcional)'}
                </p>
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
                placeholder="Ej: Golden Retriever, Siamés"
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

          {/* Age and Physical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edad_anios" className="text-foreground">
                Edad (años)
              </Label>
              <Input
                id="edad_anios"
                type="number"
                min="0"
                max="30"
                value={formData.edad_anios}
                onChange={(e) => handleInputChange("edad_anios", e.target.value)}
                className="bg-input border-border text-foreground"
                placeholder="Ej: 3"
              />
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
              <Label htmlFor="estado_salud" className="text-foreground">
                Estado de salud *
              </Label>
              <Select value={formData.estado_salud} onValueChange={(value) => handleInputChange("estado_salud", value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="Saludable">Saludable</SelectItem>
                  <SelectItem value="En tratamiento">En tratamiento</SelectItem>
                  <SelectItem value="Recuperándose">Recuperándose</SelectItem>
                  <SelectItem value="Necesita atención">Necesita atención</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tamaño */}
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

          {/* Adoption Status */}
          <div className="space-y-2">
            <Label htmlFor="en_adopcion" className="text-foreground">
              Estado de adopción
            </Label>
            <Select
              value={formData.en_adopcion ? "true" : "false"}
              onValueChange={(value) => handleInputChange("en_adopcion", value === "true")}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="true">Disponible para adopción</SelectItem>
                <SelectItem value="false">No disponible para adopción</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={loading || !formData.nombre || !formData.sexo}
            >
              {loading ? "Actualizando..." : "Actualizar Mascota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}