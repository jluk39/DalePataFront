import { NextResponse } from "next/server"

// Middleware simplificado - sin protección de rutas
// La autenticación se maneja en el frontend con backend API
export async function middleware(request) {
  // Solo permitir que todas las rutas pasen sin restricciones
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)',
  ],
}




