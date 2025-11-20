"use client"

import { useAuth } from "../backend-auth-provider.js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (user) {
        // El campo correcto es userType (con U mayúscula)
        const userType = user.userType || user.tipo || user.role || user.user_type
        
        // Si es usuario refugio, redirigir al panel admin
        if (userType === 'refugio') {
          router.push('/admin/refugio')
          return
        }
      }
      
      // Si llegamos aquí, el usuario puede acceder a la página principal
      setIsChecking(false)
    }
  }, [user, loading, router])

  // Mostrar loading mientras verificamos
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Renderizar contenido si el usuario puede acceder
  return <>{children}</>
}