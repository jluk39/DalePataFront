"use client"

import { useAuth } from "../../components/backend-auth-provider.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Button } from "../../components/ui/button.jsx"
import { Input } from "../../components/ui/input.jsx"
import { Label } from "../../components/ui/label.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.jsx"
import { Badge } from "../../components/ui/badge.jsx"
import { User, Mail, Phone, Save, Eye, EyeOff, Lock } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert.jsx"
import { useToast } from "../../hooks/use-toast.js"
import { ApiService } from "../../lib/api.js"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function PerfilPage() {
  const { user, loading, updateUser } = useAuth()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
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
        apellido: user.apellido || '',
        telefono: user.telefono || '',
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
    setSubmitting(true)

    try {
      const updatedUser = await ApiService.updateUserProfile(formData)
      
      // Actualizar el contexto de autenticación
      updateUser(updatedUser)
      
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

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
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada correctamente.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating password:', error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()
  }

  console.log('PerfilPage render - loading:', loading, 'user:', !!user)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cargando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Por favor, inicia sesión para acceder a tu perfil.</p>
            <Button asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Mi Perfil</h1>
        
        <div className="grid gap-6">
          {/* Panel de avatar y datos básicos */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="" alt={`${user.nombre} ${user.apellido}`} />
                <AvatarFallback className="text-xl">
                  {getInitials(user.nombre, user.apellido)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{user.nombre} {user.apellido}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="secondary">
                    {user.userType === "usuario" ? "Usuario" : user.userType}
                  </Badge>
                  {user.telefono && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {user.telefono}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Formulario de información personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tus datos personales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      type="text"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
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
                    <Label htmlFor="telefono">Teléfono</Label>
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
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={submitting}
                >
                  {submitting ? (
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

          {/* Cambiar Contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Cambiar Contraseña
              </CardTitle>
              <CardDescription>
                Actualiza tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
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
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
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
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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
                  disabled={submitting}
                >
                  {submitting ? (
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
        </div>
      </div>
    </div>
  )
}