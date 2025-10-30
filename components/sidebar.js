"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, MapPin } from "lucide-react"
import { cn } from "../lib/utils.js"

const navigation = [
  {
    name: "Inicio",
    href: "/",
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
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">🐾</span>
          </div>
          <h1 className="text-xl font-bold">DalePata</h1>
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
  )
}






