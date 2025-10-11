"use client"

import { useState } from "react"
import { Button } from "../ui/button.jsx"
import { Input } from "../ui/input.jsx"
import { Label } from "../ui/label.jsx"
import { Textarea } from "../ui/textarea.jsx"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.jsx"
import { Upload, X } from "lucide-react"

export default function AddPetModal({ open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad_anios: "",
    edad_meses: "",
    sexo: "",
    peso: "",
    color: "",
    estado_salud: "",
    descripcion: "",
    necesidades_especiales: "",
    en_adopcion: true,
    imagen_url: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormData((prev) => ({
          ...prev,
          imagen_url: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onSubmit) {
        onSubmit(formData)
      }

      // Reset form
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        edad_anios: "",
        edad_meses: "",
        sexo: "",
        peso: "",
        color: "",
        estado_salud: "",
        descripcion: "",
        necesidades_especiales: "",
        en_adopcion: true,
        imagen_url: "",
      })
      setImagePreview(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding pet:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Mascota</DialogTitle>
          <DialogDescription className="text-slate-400">
            Completa la información de la nueva mascota para el refugio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Foto de la mascota</Label>
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
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData((prev) => ({ ...prev, imagen_url: "" }))
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-slate-400 text-sm mt-1">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-white">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Ej: Max, Luna, Bella"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especie" className="text-white">
                Especie *
              </Label>
              <Select value={formData.especie} onValueChange={(value) => handleInputChange("especie", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Conejo">Conejo</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="raza" className="text-white">
                Raza
              </Label>
              <Input
                id="raza"
                value={formData.raza}
                onChange={(e) => handleInputChange("raza", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Ej: Golden Retriever, Siamés"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo" className="text-white">
                Sexo *
              </Label>
              <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Age and Physical Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edad_anios" className="text-white">
                Edad (años)
              </Label>
              <Input
                id="edad_anios"
                type="number"
                min="0"
                max="30"
                value={formData.edad_anios}
                onChange={(e) => handleInputChange("edad_anios", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad_meses" className="text-white">
                Edad (meses)
              </Label>
              <Input
                id="edad_meses"
                type="number"
                min="0"
                max="11"
                value={formData.edad_meses}
                onChange={(e) => handleInputChange("edad_meses", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso" className="text-white">
                Peso (kg)
              </Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={formData.peso}
                onChange={(e) => handleInputChange("peso", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className="text-white">
                Color
              </Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Ej: Dorado, Negro, Blanco"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_salud" className="text-white">
                Estado de salud *
              </Label>
              <Select value={formData.estado_salud} onValueChange={(value) => handleInputChange("estado_salud", value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Saludable">Saludable</SelectItem>
                  <SelectItem value="En tratamiento">En tratamiento</SelectItem>
                  <SelectItem value="Recuperándose">Recuperándose</SelectItem>
                  <SelectItem value="Necesita atención">Necesita atención</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              placeholder="Describe la personalidad, comportamiento y características especiales de la mascota..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="necesidades_especiales" className="text-white">
              Necesidades especiales
            </Label>
            <Textarea
              id="necesidades_especiales"
              value={formData.necesidades_especiales}
              onChange={(e) => handleInputChange("necesidades_especiales", e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Medicamentos, dieta especial, cuidados específicos..."
            />
          </div>

          {/* Adoption Status */}
          <div className="space-y-2">
            <Label htmlFor="en_adopcion" className="text-white">
              Estado de adopción
            </Label>
            <Select
              value={formData.en_adopcion ? "true" : "false"}
              onValueChange={(value) => handleInputChange("en_adopcion", value === "true")}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
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
              className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading || !formData.nombre || !formData.especie || !formData.sexo || !formData.estado_salud}
            >
              {loading ? "Guardando..." : "Agregar Mascota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
