"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.jsx"
import { ApiService } from "../../lib/api.js"

export default function TestPage() {
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (test, success, message, data = null) => {
    const result = {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [...prev, result])
  }

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health')
      const data = await response.json()
      addResult('Backend Connection', true, 'Backend conectado correctamente', data)
    } catch (error) {
      addResult('Backend Connection', false, `Error: ${error.message}`)
    }
  }

  const testRegistration = async () => {
    try {
      const testUser = {
        nombre: 'Test',
        apellido: 'Usuario',
        email: `test+${Date.now()}@example.com`,
        password: 'Password123!',
        telefono: '+54 11 1234-5678'
      }

      const result = await ApiService.register(testUser)
      addResult('User Registration', true, 'Usuario registrado exitosamente', result)
    } catch (error) {
      addResult('User Registration', false, `Error: ${error.message}`)
    }
  }

  const testEmailCheck = async () => {
    try {
      const result = await ApiService.checkEmailAvailability('test@example.com')
      addResult('Email Check', true, 'Verificación de email exitosa', result)
    } catch (error) {
      addResult('Email Check', false, `Error: ${error.message}`)
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    await testBackendConnection()
    await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
    
    await testEmailCheck()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testRegistration()
    
    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Panel de Pruebas API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={runAllTests} disabled={isLoading}>
                {isLoading ? 'Ejecutando...' : 'Ejecutar Todas las Pruebas'}
              </Button>
              <Button onClick={testBackendConnection} variant="outline">
                Test Conexión Backend
              </Button>
              <Button onClick={testEmailCheck} variant="outline">
                Test Verificación Email
              </Button>
              <Button onClick={testRegistration} variant="outline">
                Test Registro Usuario
              </Button>
              <Button onClick={clearResults} variant="destructive">
                Limpiar Resultados
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Resultados:</h3>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      result.success
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">
                          {result.success ? '✅' : '❌'} {result.test}
                        </span>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.data && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs opacity-75">
                              Ver datos de respuesta
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <span className="text-xs opacity-75">{result.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}