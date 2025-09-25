"use client"

import { useAuth } from "../../components/backend-auth-provider.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Button } from "../../components/ui/button.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.jsx"
import { Badge } from "../../components/ui/badge.jsx"
import { User, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"

export default function PerfilPage() {
  const { user, loading } = useAuth()

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

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Mi Perfil</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Panel de información del usuario */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="" alt={`${user.nombre} ${user.apellido}`} />
                  <AvatarFallback className="text-xl">
                    {getInitials(user.nombre, user.apellido)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.nombre} {user.apellido}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {user.userType === "usuario" ? "Usuario" : user.userType}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
                  </div>
                  {user.telefono && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{user.telefono}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de información */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Tu información personal registrada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <strong className="text-muted-foreground">Nombre:</strong>
                      <p className="font-medium">{user.nombre || "No especificado"}</p>
                    </div>
                    <div>
                      <strong className="text-muted-foreground">Apellido:</strong>
                      <p className="font-medium">{user.apellido || "No especificado"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <strong className="text-muted-foreground">Email:</strong>
                      <p className="font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <strong className="text-muted-foreground">Teléfono:</strong>
                      <p className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {user.telefono || "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <strong className="text-muted-foreground">Estado de Usuario:</strong>
                    <pre className="bg-gray-100 p-4 rounded text-sm mt-2 overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}