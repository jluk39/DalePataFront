"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { useAuth } from "../../../components/backend-auth-provider.js"
import { ApiService } from "../../../lib/api.js"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "../../../lib/supabase/client.js"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(null)
  const [isSupabaseFlow, setIsSupabaseFlow] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()

  useEffect(() => {
    // Verificar si es el flujo de Supabase (viene con hash fragment)
    const hash = window.location.hash
    
    if (hash.includes('access_token')) {
      // Flujo de Supabase - el token viene en el hash
      setIsSupabaseFlow(true)
      setToken('supabase') // Marcador para indicar que usamos Supabase
    } else if (hash.includes('error')) {
      // Error de Supabase (token expirado, etc.)
      const errorMatch = hash.match(/error_description=([^&]+)/)
      if (errorMatch) {
        const errorDesc = decodeURIComponent(errorMatch[1].replace(/\+/g, ' '))
        setError(errorDesc)
      } else {
        setError("El enlace de recuperación ha expirado o es inválido")
      }
      setToken(null)
    } else {
      // Flujo JWT tradicional - el token viene como query param
      const urlToken = searchParams.get('token')
      if (!urlToken) {
        setError("Token de recuperación no válido o faltante")
      } else {
        setIsSupabaseFlow(false)
        setToken(urlToken)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validaciones
    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!token) {
      setError("Token de recuperación no válido")
      setIsLoading(false)
      return
    }

    try {
      if (isSupabaseFlow) {
        // Flujo de Supabase - actualizar contraseña directamente
        const supabase = createClient()
        
        // Obtener el email del usuario actual de Supabase
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        if (!supabaseUser?.email) {
          throw new Error('No se pudo obtener la información del usuario')
        }

        const { error: supabaseError } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        // Sincronizar la contraseña con el backend
        try {
          await ApiService.syncPasswordFromSupabase(supabaseUser.email, newPassword)
        } catch (syncError) {
          console.error('Error syncing password with backend:', syncError)
          // Continuar aunque falle la sincronización
        }

        // Cerrar sesión de Supabase después de cambiar contraseña
        await supabase.auth.signOut()
      } else {
        // Flujo JWT tradicional
        await resetPassword(token, newPassword)
      }
      
      setSuccess(true)
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      setError(error.message || "Error al restablecer la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/30">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-300/25 to-orange-300/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-300/25 to-pink-300/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-200/15 to-amber-200/15 rounded-full blur-3xl" />
        
        {/* Paw pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pawPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Main pad */}
              <ellipse cx="60" cy="70" rx="18" ry="22" fill="#f97316" opacity="0.4" />
              {/* Top left toe */}
              <ellipse cx="42" cy="45" rx="10" ry="14" fill="#fb923c" opacity="0.4" />
              {/* Top center toe */}
              <ellipse cx="60" cy="38" rx="10" ry="14" fill="#fb923c" opacity="0.4" />
              {/* Top right toe */}
              <ellipse cx="78" cy="45" rx="10" ry="14" fill="#fb923c" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pawPattern)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-md bg-white/95 shadow-2xl border-orange-100/50 ring-1 ring-orange-900/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Restablecer Contraseña</CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Contraseña restablecida!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tu contraseña ha sido actualizada exitosamente.
                  </p>
                  <p className="text-xs text-gray-500">
                    Serás redirigido al inicio de sesión en unos segundos...
                  </p>
                </div>
              </div>
            ) : !token ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enlace inválido
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    El enlace de recuperación no es válido o ha expirado.
                  </p>
                </div>
                <div className="text-center text-sm">
                  <Link href="/auth/recuperar-contrasena" className="text-primary hover:underline">
                    Solicitar nuevo enlace
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
                </Button>
                <div className="text-center text-sm">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
