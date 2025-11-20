'use client'

import { useToast } from '../../hooks/use-toast.js'
import { Toast } from './toast-simple.jsx'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${index * 80}px` }}
          className="relative"
        >
          <Toast
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => {
              console.log('Dismissing toast:', toast.id)
              dismiss(toast.id)
            }}
            className="relative top-0 right-0 w-96"
          />
        </div>
      ))}
    </div>
  )
}