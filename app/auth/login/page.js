"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { useAuth } from "../../../components/backend-auth-provider.js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Usar la función signIn del AuthProvider que actualiza el estado global
      const result = await signIn(email, password)
      
      // Redirigir según el tipo de usuario
      if (result.user) {
        // El campo correcto es userType (con U mayúscula)
        const userType = result.user.userType || result.user.tipo || result.user.role || result.user.user_type
        
        if (userType === 'refugio') {
          // Usuarios refugio van directamente al panel admin
          router.push("/admin/refugio")
        } else {
          // Otros usuarios van a la página de inicio
          router.push("/inicio")
        }
      } else {
        // Fallback: ir a página de inicio
        router.push("/inicio")
      }
      
      router.refresh() // Forzar actualización de la página
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrió un error")
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
            <CardTitle className="text-2xl font-bold text-primary">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus datos para acceder a DalePata</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-right">
                <Link href="/auth/recuperar-contrasena" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/registro" className="text-primary hover:underline">
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}