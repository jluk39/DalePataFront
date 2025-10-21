"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../backend-auth-provider.js"

// Helper function para mensajes personalizados
function getAccessDeniedMessage(userType, requiredRole) {
  const messages = {
    usuario: '⚠️ Esta página es solo para refugios. Los usuarios pueden adoptar mascotas desde la página principal.',
    veterinaria: '⚠️ Esta página es solo para refugios. Como veterinaria, tienes tu propio panel de administración.',
    medico: '⚠️ Esta página es solo para refugios. Como médico veterinario, tienes tu propio panel de administración.',
    refugio: '⚠️ Esta página es solo para refugios. Parece que ya deberías tener acceso.',
  }
  
  return messages[userType] || `⚠️ No tienes permisos para acceder a esta página. Tu tipo de usuario "${userType}" no puede acceder a rutas de "${requiredRole}".`
}

// Helper function para redirección
function getRedirectPath(userType) {
  const paths = {
    usuario: '/',
    veterinaria: '/veterinaria/dashboard', // Cuando se implemente
    medico: '/veterinario/dashboard', // Cuando se implemente
    refugio: '/', // En caso de error
  }
  
  return paths[userType] || '/'
}

export default function AdminProtectedRoute({ children, requiredRole = "refugio" }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // No hacer nada si aún está cargando
    if (loading) return

    // Si no hay usuario, redirigir al login
    if (!user) {
      console.log('❌ No authenticated user, redirecting to login')
      router.push('/auth/login')
      return
    }

    // Verificar el tipo de usuario - buscar en diferentes campos posibles
    const userType = user.tipo || user.role || user.user_type || user.userType
    
    console.log('🔐 Admin route protection check:', {
      userEmail: user.email,
      userType,
      requiredRole,
      userId: user.id,
      availableUserFields: Object.keys(user), // Ver qué campos tiene el usuario
      userObject: user // Log completo del usuario para debugging
    })

    // Si el usuario no es del tipo requerido, redirigir
    if (userType !== requiredRole) {
      console.log(`❌ Access denied. User type "${userType}" cannot access "${requiredRole}" route`)
      
      // Mostrar mensaje más específico según el tipo de usuario
      const message = getAccessDeniedMessage(userType, requiredRole)
      alert(message)
      
      // Redirigir a la página apropiada según el tipo de usuario
      const redirectPath = getRedirectPath(userType)
      router.push(redirectPath)
      return
    }

    console.log('✅ Access granted to admin route')
  }, [user, loading, router, requiredRole])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (se está redirigiendo)
  if (!user) {
    return null
  }

  // Verificar tipo de usuario
  const userType = user.tipo || user.role || user.user_type || user.userType
  
  if (userType !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center max-w-lg mx-auto p-8 bg-card rounded-lg border border-border shadow-lg">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">
            {getAccessDeniedMessage(userType, requiredRole)}
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Tipo de usuario requerido:</strong> {requiredRole}
              <br />
              <strong>Tu tipo de usuario:</strong> {userType || 'No especificado'}
              <br />
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(getRedirectPath(userType))}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Ir a Mi Página Principal
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-border text-foreground rounded hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si todo está bien, renderizar el contenido
  return children
}