"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { ApiService } from "../../../lib/api.js"
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
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      if (!nombre.trim() || !apellido.trim() || !email.trim()) {
        setError("Por favor, completa todos los campos requeridos")
        setIsLoading(false)
        return
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

      const userData = {
        nombre: nombre.trim().charAt(0).toUpperCase() + nombre.trim().slice(1).toLowerCase(),
        apellido: apellido.trim().charAt(0).toUpperCase() + apellido.trim().slice(1).toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        telefono: telefono.trim() || undefined // Solo enviar si no está vacío
      }

      console.log('Intentando registrar usuario con datos:', {
        ...userData,
        password: '***hidden***'
      })

      const result = await ApiService.register(userData)
      
      console.log('Registro exitoso:', result)
      
      // Guardar token y datos del usuario si vienen en la respuesta
      if (result.token) {
        ApiService.setToken(result.token)
        console.log('Token guardado')
      }
      
      if (result.user) {
        ApiService.setUser(result.user)
        console.log('Usuario guardado:', result.user)
        // Si el registro es exitoso y retorna el usuario, ir al dashboard
        router.push("/")
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
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Crear Cuenta</CardTitle>
            <CardDescription>Únete a la comunidad DalePata</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
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







