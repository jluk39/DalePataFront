"use client"

import { useAuth } from "../../components/backend-auth-provider.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"

export default function TestPerfilPage() {
  const { user, loading } = useAuth()

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
            <CardTitle>No Autenticado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Por favor, inicia sesión para ver tu perfil.</p>
            <div className="mt-4">
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Ir al login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario - TEST</CardTitle>
          <CardDescription>Información del usuario autenticado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Nombre:</strong> {user.nombre} {user.apellido}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Teléfono:</strong> {user.telefono || "No especificado"}
            </div>
            <div>
              <strong>Tipo:</strong> {user.userType}
            </div>
            <div>
              <strong>ID:</strong> {user.id}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Estado de Autenticación:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}