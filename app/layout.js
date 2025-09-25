import React, { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "../components/backend-auth-provider.js"
import "./globals.css"

export const metadata = {
  title: "DalePata - Rescate y Adopción de Mascotas",
  description: "Plataforma para el rescate y adopción de mascotas perdidas y encontradas",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}



