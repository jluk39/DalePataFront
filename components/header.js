"use client"

import { Bell, Settings, User } from "lucide-react"
import { Button } from "./ui/button.jsx"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.jsx"
import { useAuth } from "./backend-auth-provider.js"
import { ApiService } from "../lib/api.js"

const pageNames = {
  "/": "DalePata",
  "/inicio": "Inicio",
  "/adoptar": "Adoptar",
  "/perdidos": "Mascotas Perdidas",
  "/seguimiento": "Seguimiento",
  "/perfil": "Mi Perfil",
  "/favoritos": "Favoritos",
  "/turnos": "Turnos",
  "/historial": "Historial",
  "/admin/refugio/mascotas": "Gestión de Mascotas",
  "/admin/refugio/configuracion": "Configuración",
}

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadNotifications()
      // Actualizar cada minuto
      const interval = setInterval(loadNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const notifications = await ApiService.getVirtualNotifications()
      const unread = notifications.filter(n => !n.leida).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const handleProfileClick = () => {
    router.push("/perfil")
  }

  // Obtener el nombre de la página actual
  const getPageName = () => {
    // Buscar coincidencia exacta
    if (pageNames[pathname]) return pageNames[pathname]
    
    // Buscar coincidencia parcial para rutas dinámicas
    for (const [path, name] of Object.entries(pageNames)) {
      if (pathname.startsWith(path) && path !== "/") {
        return name
      }
    }
    
    return "DalePata"
  }

  return (
    <header className="bg-white border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center ml-14 md:ml-0">
        {/* Logo en móvil, texto en desktop */}
        <div className="md:hidden relative w-60 h-14">
          <Image
            src="/images/dalepata-logo.png"
            alt="DalePata Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <h1 className="hidden md:block text-2xl font-bold text-primary">{getPageName()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex relative"
          onClick={() => router.push('/notificaciones')}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="w-5 h-5" />
                <span className="sr-only">Menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {user.nombre} {user.apellido}
              </div>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {user.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/registro">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}






