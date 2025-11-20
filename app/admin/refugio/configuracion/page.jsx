"use client"

import { useAuth } from "../../../../components/backend-auth-provider.js"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card.jsx"
import { Button } from "../../../../components/ui/button.jsx"
import { Input } from "../../../../components/ui/input.jsx"
import { Label } from "../../../../components/ui/label.jsx"
import { useState, useEffect } from "react"
import { ApiService } from "../../../../lib/api.js"
import { User, Mail, Phone, MapPin, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "../../../../hooks/use-toast.js"
import { Alert, AlertDescription } from "../../../../components/ui/alert.jsx"
import { Toaster } from "../../../../components/ui/toaster-simple.jsx"

export default function ConfiguracionPage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedUser = await ApiService.updateUserProfile(formData)
      
      // Actualizar el contexto de autenticación
      updateUser(updatedUser)
      
      toast({
        title: "✅ Perfil actualizado",
        description: "Los cambios en tu información personal han sido guardados exitosamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "❌ Error al actualizar",
        description: error.message || "No se pudieron guardar los cambios en tu perfil. Inténtalo nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "⚠️ Contraseñas no coinciden",
        description: "La nueva contraseña y su confirmación deben ser idénticas.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "⚠️ Contraseña muy corta",
        description: "La nueva contraseña debe tener al menos 6 caracteres para mayor seguridad.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await ApiService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      toast({
        title: "🔐 Contraseña actualizada",
        description: "Tu nueva contraseña ha sido establecida correctamente. Recuerda mantenerla segura.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating password:', error)
      toast({
        title: "❌ Error de contraseña",
        description: error.message || "No se pudo cambiar la contraseña. Verifica que la contraseña actual sea correcta.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configuración de Cuenta</h1>
        <p className="text-muted-foreground mt-2">Gestiona tus datos personales y configuración del refugio</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Información Personal */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información De Refugio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nombre" className="text-foreground">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Nombre refugio completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    className="mt-1 bg-muted cursor-not-allowed"
                    placeholder="tu@email.com"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    En caso de necesitar modificar tu correo, contacta al soporte.
                  </p>
                </div>

                <div>
                  <Label htmlFor="telefono" className="text-foreground">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="direccion" className="text-foreground">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Tu dirección completa"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cambiar Contraseña */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Cambiar Contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPassword" className="text-foreground">Contraseña Actual</Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Contraseña actual"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-foreground">Nueva Contraseña</Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Nueva contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Contraseña</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    placeholder="Confirmar contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                La nueva contraseña debe tener al menos 6 caracteres. Se recomienda usar una combinación de letras, números y símbolos.
              </AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Actualizando...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  )
}