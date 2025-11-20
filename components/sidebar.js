"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Heart, MapPin, ClipboardList, Menu, X } from "lucide-react"
import { cn } from "../lib/utils.js"
import { Button } from "./ui/button.jsx"

const navigation = [
  {
    name: "Inicio",
    href: "/inicio",
    icon: Home,
  },
  {
    name: "Adoptar",
    href: "/adoptar",
    icon: Heart,
  },
  {
    name: "Perdidos",
    href: "/perdidos",
    icon: MapPin,
  },
  {
    name: "Seguimiento",
    href: "/seguimiento",
    icon: ClipboardList,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Overlay para cerrar sidebar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-4 py-6 mt-16 md:mt-0">
          <div className="relative w-full h-20 px-4">
            <Image
              src="/images/dalepata-logo2.png"
              alt="DalePata Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}






