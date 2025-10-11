"use client"

import { useAuth } from "../../../components/backend-auth-provider.js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button.jsx"
import { Home, Heart, FileText, Settings, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/refugio",
      icon: Home,
      current: pathname === "/admin/refugio",
    },
    {
      name: "Mis Mascotas",
      href: "/admin/refugio/mascotas",
      icon: Heart,
      current: pathname === "/admin/refugio/mascotas",
    },
    {
      name: "Solicitudes",
      href: "/admin/refugio/solicitudes",
      icon: FileText,
      current: pathname === "/admin/refugio/solicitudes",
    },
    {
      name: "Configuración",
      href: "/admin/refugio/configuracion",
      icon: Settings,
      current: pathname === "/admin/refugio/configuracion",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-sm">🐾</span>
              </div>
              <span className="text-sidebar-foreground font-semibold">DalePata Admin</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-sidebar-border bg-sidebar-accent/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-medium">
                  {user?.nombre?.charAt(0) || user?.email?.charAt(0) || "R"}
                </span>
              </div>
              <div>
                <p className="text-sidebar-foreground font-medium">{user?.nombre || "Refugio"}</p>
                <p className="text-sidebar-foreground/70 text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${item.current ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-foreground/70 hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h1 className="text-foreground font-semibold">Panel de Administración</h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
