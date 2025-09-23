"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider.js"

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('ProtectedRoute state:', { user: !!user, loading })
    
    if (!loading && !user) {
      console.log('Redirecting to login - no user found')
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    console.log('ProtectedRoute: Loading...')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute: No user, returning null')
    return null
  }

  console.log('ProtectedRoute: User authenticated, rendering children')
  return children
}