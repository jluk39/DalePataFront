"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Settings, User } from "lucide-react"
import { Button } from "./ui/button.jsx"
import { useAuth } from "./backend-auth-provider.js"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleProfileClick = () => {
    console.log("Profile clicked")
    setDropdownOpen(false)
    router.push("/perfil")
  }

  const handleSignOut = () => {
    console.log("Sign out clicked")
    setDropdownOpen(false)
    signOut()
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  console.log("Header render - user:", !!user, "dropdownOpen:", dropdownOpen)

  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">🐾</span>
        </div>
        <h1 className="text-xl font-bold text-primary">DalePata</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                console.log("User button clicked, current state:", dropdownOpen)
                setDropdownOpen(!dropdownOpen)
              }}
              className="relative"
            >
              <User className="w-5 h-5" />
              <span className="sr-only">Menú de usuario</span>
            </Button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="px-3 py-2 text-sm font-medium border-b border-gray-100">
                  {user.nombre} {user.apellido}
                </div>
                <div className="px-3 py-1 text-xs text-gray-500 border-b border-gray-100">
                  {user.email}
                </div>
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => console.log("Settings clicked")}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/registro">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}