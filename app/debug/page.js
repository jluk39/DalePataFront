"use client"

import { useAuth } from "../../components/backend-auth-provider.js"
import { ApiService } from "../../lib/api.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { Button } from "../../components/ui/button.jsx"
import { useState } from "react"

export default function DebugPage() {
  const { user, loading } = useAuth()
  const [debugInfo, setDebugInfo] = useState(null)

  const checkLocalStorage = () => {
    const token = ApiService.getToken()
    const savedUser = ApiService.getUser()
    
    const info = {
      token: token ? `${token.substring(0, 20)}...` : null,
      tokenLength: token ? token.length : 0,
      hasToken: !!token,
      savedUser: savedUser,
      hasUser: !!savedUser,
      authContextUser: user,
      authContextLoading: loading,
      localStorage: {}
    }

    // Revisar todo el localStorage
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.includes('dalepata')) {
          info.localStorage[key] = localStorage.getItem(key)
        }
      }
    }

    setDebugInfo(info)
  }

  const clearAuth = () => {
    ApiService.logout()
    setDebugInfo(null)
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug de Autenticación</CardTitle>
            <CardDescription>Información del estado de autenticación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={checkLocalStorage}>Revisar Estado</Button>
              <Button onClick={clearAuth} variant="destructive">Limpiar Auth</Button>
            </div>

            {debugInfo && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Estado General:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tiene Token:</strong> {debugInfo.hasToken ? '✅ Sí' : '❌ No'}
                    </div>
                    <div>
                      <strong>Longitud Token:</strong> {debugInfo.tokenLength}
                    </div>
                    <div>
                      <strong>Usuario Guardado:</strong> {debugInfo.hasUser ? '✅ Sí' : '❌ No'}
                    </div>
                    <div>
                      <strong>Auth Context Loading:</strong> {debugInfo.authContextLoading ? '⏳ Sí' : '✅ No'}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Token (primeros 20 chars):</h3>
                  <code className="bg-gray-100 p-2 rounded block text-xs">
                    {debugInfo.token || 'No token'}
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Usuario Guardado:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                    {debugInfo.savedUser ? JSON.stringify(debugInfo.savedUser, null, 2) : 'No user saved'}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Usuario en Context:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                    {debugInfo.authContextUser ? JSON.stringify(debugInfo.authContextUser, null, 2) : 'No user in context'}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">LocalStorage DalePata:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                    {JSON.stringify(debugInfo.localStorage, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🧪 Test de Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Estado Actual:</strong>
                {loading ? ' ⏳ Cargando...' : user ? ' ✅ Autenticado' : ' ❌ No autenticado'}
              </div>
              
              {user && (
                <div>
                  <strong>Usuario:</strong> {user.nombre} {user.apellido} ({user.email})
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={() => window.location.href = '/perfil'}
                  disabled={!user}
                >
                  Ir a Perfil
                </Button>
                <Button 
                  onClick={() => window.location.href = '/auth/login'}
                  variant="outline"
                >
                  Ir a Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}