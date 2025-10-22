﻿"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx"
import { Textarea } from "../../../components/ui/textarea.jsx"
import { useAuth } from "../../../components/backend-auth-provider.js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [telefono, setTelefono] = useState("")
  const [userType, setUserType] = useState("usuario")
  const [direccion, setDireccion] = useState("")
  
  // Campos específicos para refugio
  const [tipoOrganizacion, setTipoOrganizacion] = useState("")
  const [capacidad, setCapacidad] = useState("")
  
  // Campos específicos para veterinaria
  const [especialidades, setEspecialidades] = useState("")
  const [horarios, setHorarios] = useState("")
  
  // Campos específicos para médico
  const [veterinariaId, setVeterinariaId] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [matricula, setMatricula] = useState("")
  
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { registerByType } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      // Validar que los campos requeridos estén completos
      if (!nombre.trim() || !email.trim()) {
        setError("Por favor, completa todos los campos requeridos")
        setIsLoading(false)
        return
      }

      // Para usuarios comunes, validar apellido
      if (userType === 'usuario' && !apellido.trim()) {
        setError("Por favor, completa todos los campos requeridos")
        setIsLoading(false)
        return
      }

      // Validaciones específicas por tipo de usuario
      if (userType !== 'usuario' && !direccion.trim()) {
        setError("La dirección es obligatoria para este tipo de cuenta")
        setIsLoading(false)
        return
      }

      if (userType === 'refugio') {
        if (!tipoOrganizacion.trim()) {
          setError("El tipo de organización es obligatorio para refugios")
          setIsLoading(false)
          return
        }
        if (!capacidad || capacidad <= 0) {
          setError("La capacidad debe ser un número mayor a 0")
          setIsLoading(false)
          return
        }
      }

      if (userType === 'veterinaria') {
        if (!especialidades.trim()) {
          setError("Las especialidades son obligatorias para veterinarias")
          setIsLoading(false)
          return
        }
        if (!horarios.trim()) {
          setError("Los horarios de atención son obligatorios")
          setIsLoading(false)
          return
        }
      }

      if (userType === 'medico') {
        if (!especialidad.trim() || !matricula.trim()) {
          setError("La especialidad y matrícula son obligatorios para médicos")
          setIsLoading(false)
          return
        }
        if (!veterinariaId || veterinariaId <= 0) {
          setError("Debe seleccionar una veterinaria válida")
          setIsLoading(false)
          return
        }
      }

      // Validación de formato de email más estricta
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email.trim())) {
        setError("Por favor, ingresa un email válido (ejemplo: usuario@gmail.com)")
        setIsLoading(false)
        return
      }

      // Validación de contraseña simple para pruebas
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        setIsLoading(false)
        return
      }

      // Validación de teléfono (opcional pero con formato si se proporciona)
      if (telefono.trim() && telefono.trim().length > 0) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
        if (!phoneRegex.test(telefono.trim())) {
          setError("El teléfono debe tener un formato válido (ej: +54 11 1234-5678)")
          setIsLoading(false)
          return
        }
      }

      // Construir datos según el tipo de usuario
      let userData = {
        nombre: nombre.trim().charAt(0).toUpperCase() + nombre.trim().slice(1).toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        telefono: telefono.trim() || undefined
      }

      // Agregar campos específicos según el tipo
      if (userType === 'usuario') {
        userData.apellido = apellido.trim().charAt(0).toUpperCase() + apellido.trim().slice(1).toLowerCase()
      } else {
        userData.direccion = direccion.trim()
      }

      if (userType === 'refugio') {
        userData.tipo_organizacion = tipoOrganizacion.trim()
        userData.capacidad = parseInt(capacidad)
      }

      if (userType === 'veterinaria') {
        userData.especialidades = especialidades.trim()
        userData.horarios = horarios.trim()
      }

      if (userType === 'medico') {
        userData.especialidad = especialidad.trim()
        userData.matricula = matricula.trim()
        userData.veterinaria_id = parseInt(veterinariaId)
      }

      console.log(`Intentando registrar ${userType} con datos:`, {
        ...userData,
        password: '***hidden***'
      })

      // Usar la función registerByType del AuthProvider que actualiza el estado global
      const result = await registerByType(userData, userType)
      
      console.log('Registro exitoso:', result)
      
      if (result.user) {
        console.log('Usuario registrado y autenticado:', result.user)
        
        // Verificar el tipo tanto del formulario como del usuario retornado
        const finalUserType = result.user.userType || userType
        
        // Redirigir según el tipo de usuario registrado
        if (finalUserType === 'refugio') {
          // Usuarios refugio van directamente al panel admin
          router.push("/admin/refugio")
        } else {
          // Otros usuarios van a la página principal
          router.push("/")
        }
        
        router.refresh() // Forzar actualización de la página
      } else {
        // Si el registro requiere confirmación de email
        router.push("/auth/confirmacion")
      }
    } catch (error) {
      console.error('Error en registro:', error)
      
      // Manejo específico de errores comunes del backend
      let errorMessage = "Ocurrió un error inesperado"
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        
        if (message.includes('email ya está registrado') || message.includes('email already exists')) {
          errorMessage = "Este email ya está registrado. ¿Ya tienes una cuenta? Intenta iniciar sesión."
        } else if (message.includes('email address') && message.includes('invalid')) {
          errorMessage = "El formato del email no es válido. Usa un email real como usuario@gmail.com"
        } else if (message.includes('password')) {
          errorMessage = "La contraseña no cumple con los requisitos mínimos"
        } else if (message.includes('required') || message.includes('requerido')) {
          errorMessage = "Faltan campos obligatorios. Verifica que hayas completado todos los datos."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Crear Cuenta</CardTitle>
            <CardDescription>Únete a la comunidad DalePata</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Selector de tipo de usuario */}
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Cuenta</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">👤 Usuario (Adoptar mascotas)</SelectItem>
                    <SelectItem value="refugio">🏠 Refugio (Publicar mascotas para adopción)</SelectItem>
                    <SelectItem value="veterinaria">🏥 Veterinaria (Clínica veterinaria)</SelectItem>
                    <SelectItem value="medico">👨‍⚕️ Médico Veterinario</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos comunes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    {userType === 'usuario' ? 'Nombre' : 'Nombre de la Organización/Profesional'}
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder={userType === 'usuario' ? 'Tu nombre' : 'Nombre completo o de la organización'}
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                
                {/* Solo mostrar apellido para usuarios comunes */}
                {userType === 'usuario' && (
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      type="text"
                      placeholder="Tu apellido"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>
                
                {/* Dirección obligatoria para organizaciones */}
                {userType !== 'usuario' && (
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      type="text"
                      placeholder="Dirección completa"
                      required
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Campos específicos para refugio */}
              {userType === 'refugio' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium text-sm">Información del Refugio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoOrganizacion">Tipo de Organización</Label>
                      <Select value={tipoOrganizacion} onValueChange={setTipoOrganizacion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Refugio">Refugio</SelectItem>
                          <SelectItem value="Fundación">Fundación</SelectItem>
                          <SelectItem value="ONG">ONG</SelectItem>
                          <SelectItem value="Protectora">Protectora de Animales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacidad">Capacidad (número de animales)</Label>
                      <Input
                        id="capacidad"
                        type="number"
                        placeholder="50"
                        min="1"
                        required
                        value={capacidad}
                        onChange={(e) => setCapacidad(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos específicos para veterinaria */}
              {userType === 'veterinaria' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium text-sm">Información de la Veterinaria</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="especialidades">Especialidades</Label>
                      <Textarea
                        id="especialidades"
                        placeholder="Ej: Cirugía, Medicina General, Dermatología..."
                        required
                        value={especialidades}
                        onChange={(e) => setEspecialidades(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horarios">Horarios de Atención</Label>
                      <Textarea
                        id="horarios"
                        placeholder="Ej: Lun-Vie 8:00-18:00, Sáb 8:00-12:00"
                        required
                        value={horarios}
                        onChange={(e) => setHorarios(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos específicos para médico */}
              {userType === 'medico' && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium text-sm">Información Profesional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad</Label>
                      <Input
                        id="especialidad"
                        type="text"
                        placeholder="Ej: Cirugía, Cardiología..."
                        required
                        value={especialidad}
                        onChange={(e) => setEspecialidad(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matricula">Matrícula Profesional</Label>
                      <Input
                        id="matricula"
                        type="text"
                        placeholder="Ej: VET-12345"
                        required
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="veterinariaId">ID de Veterinaria (temporal)</Label>
                    <Input
                      id="veterinariaId"
                      type="number"
                      placeholder="Ingresa el ID de la veterinaria"
                      min="1"
                      required
                      value={veterinariaId}
                      onChange={(e) => setVeterinariaId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      En el futuro esto será un selector. Por ahora ingresa el ID numérico.
                    </p>
                  </div>
                </div>
              )}

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Debe tener al menos 6 caracteres
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : `Crear Cuenta ${
                  userType === 'usuario' ? 'de Usuario' :
                  userType === 'refugio' ? 'de Refugio' :
                  userType === 'veterinaria' ? 'de Veterinaria' :
                  'de Médico Veterinario'
                }`}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Iniciar Sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}







