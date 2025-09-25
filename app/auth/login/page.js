"use client"

import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { ApiService } from "../../../lib/api.js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await ApiService.login(email, password)
      
      // Guardar token y datos del usuario
      if (result.token) {
        ApiService.setToken(result.token)
      }
      
      if (result.user) {
        ApiService.setUser(result.user)
      }
      
      // Redirigir al usuario
      router.push("/")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
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