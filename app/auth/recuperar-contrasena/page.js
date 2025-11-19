"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { useAuth } from "../../../components/backend-auth-provider.js"
import Link from "next/link"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

export default function RecuperarContraseñaPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Validación básica
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError("Por favor ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    try {
      await requestPasswordReset(email.trim().toLowerCase())
      setSuccess(true)
      setEmail("") // Limpiar el campo
    } catch (error) {
      setError(error.message || "Ocurrió un error al procesar tu solicitud")
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
            <CardTitle className="text-2xl font-bold text-primary">Recuperar Contraseña</CardTitle>
            <CardDescription>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    ¡Correo enviado!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                  </p>
                  <p className="text-xs text-gray-500">
                    Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                  </p>
                </div>
                <div className="text-center text-sm">
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </Button>
                <div className="text-center text-sm">
                  ¿Recordaste tu contraseña?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Iniciar sesión
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
