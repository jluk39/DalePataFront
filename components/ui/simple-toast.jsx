'use client'

import { useState, useCallback, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

// Context para manejar los toasts
const ToastContext = createContext()

// Hook para usar los toasts
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Provider de toasts
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((props) => addToast(props), [addToast])

  return (
    <ToastContext.Provider value={{ toast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

// Componente Toast individual
export function Toast({ id, title, description, variant, onRemove }) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div
      className={`
        w-96 rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-right fade-in duration-300
        ${variant === "destructive" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
      `}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          {title && (
            <div className={`text-sm font-medium ${
              variant === "destructive" ? "text-red-800" : "text-green-800"
            }`}>
              {title}
            </div>
          )}
          {description && (
            <div className={`text-sm ${
              variant === "destructive" ? "text-red-700" : "text-green-700"
            }`}>
              {description}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            console.log('Closing toast:', id)
            onRemove(id)
          }}
          className={`
            rounded-sm p-1 transition-all hover:opacity-100 cursor-pointer
            ${variant === "destructive" 
              ? "text-red-500 hover:bg-red-100 opacity-70" 
              : "text-green-500 hover:bg-green-100 opacity-70"
            }
          `}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Componente Toaster para mostrar todos los toasts
export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}