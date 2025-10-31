import * as React from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const Toast = React.forwardRef(({ className, variant = "default", title, description, onClose, autoClose = true, ...props }, ref) => {
  React.useEffect(() => {
    if (!autoClose || !onClose) return
    
    const timer = setTimeout(() => {
      onClose()
    }, 5000) // Auto close after 5 seconds

    return () => clearTimeout(timer)
  }, [onClose, autoClose])

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
      ref={ref}
      className={cn(
        "w-96 rounded-lg border bg-background p-4 shadow-lg animate-in slide-in-from-right fade-in duration-300",
        variant === "destructive" && "border-red-200 bg-red-50",
        variant === "default" && "border-green-200 bg-green-50",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 space-y-1">
          {title && (
            <div className={cn(
              "text-sm font-medium",
              variant === "destructive" ? "text-red-800" : "text-green-800"
            )}>
              {title}
            </div>
          )}
          {description && (
            <div className={cn(
              "text-sm",
              variant === "destructive" ? "text-red-700" : "text-green-700"
            )}>
              {description}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Toast close button clicked')
            onClose?.()
          }}
          className={cn(
            "rounded-sm opacity-70 transition-opacity hover:opacity-100 cursor-pointer p-1 hover:bg-gray-100",
            variant === "destructive" ? "text-red-500 hover:bg-red-100" : "text-green-500 hover:bg-green-100"
          )}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})

Toast.displayName = "Toast"

const ToastProvider = ({ children }) => {
  return <div>{children}</div>
}

const ToastViewport = ({ children }) => {
  return <div>{children}</div>
}

const ToastTitle = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

const ToastDescription = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

const ToastClose = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <X className="h-4 w-4" />
    </button>
  )
}

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
}