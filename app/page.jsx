import { Button } from "../components/ui/button.jsx"
import { Card } from "../components/ui/card.jsx"
import { Heart, Users, Shield, Sparkles, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo Section */}
      <div className="bg-background py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/">
            <Image
              src="/images/dalepata-logo3.png"
              alt="DalePata"
              width={200}
              height={80}
              className="h-24 w-auto"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-accent text-accent-foreground overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-balance">
                Conectamos corazones con patitas
              </h1>
              <p className="text-xl text-accent-foreground/90 text-pretty">
                DalePata es más que una plataforma de adopción. Somos una comunidad
                dedicada a dar una segunda oportunidad a cada mascota que lo necesita.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/adoptar">Adoptar Ahora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-white/10 text-accent-foreground border-accent-foreground/20 hover:bg-white/20">
                  <Link href="#mision">Nuestra Misión</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img
                src="/images/hero-section.png"
                alt="Mascotas felices"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" 
              fill="currentColor" 
              className="text-background" 
            />
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mision" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestra Misión</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trabajamos incansablemente para conectar a mascotas sin hogar con familias amorosas,
              creando vínculos que transforman vidas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Amor Incondicional</h3>
              <p className="text-muted-foreground">
                Cada mascota merece un hogar lleno de cariño y cuidados
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidad</h3>
              <p className="text-muted-foreground">
                Construimos una red de apoyo entre adoptantes y rescatistas
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Protección</h3>
              <p className="text-muted-foreground">
                Verificamos adoptantes para garantizar el bienestar animal
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segunda Oportunidad</h3>
              <p className="text-muted-foreground">
                Cada adopción es una historia de esperanza y transformación
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Mascotas Adoptadas</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1,000+</div>
              <div className="text-xl">Familias Felices</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-xl">Refugios Asociados</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para cambiar una vida?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Encuentra a tu compañero perfecto y dale la oportunidad que merece.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/adoptar">Ver Mascotas Disponibles</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent text-accent-foreground">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="md:col-span-1">
              <Image
                src="/images/dalepata-logo2.png"
                alt="DalePata"
                width={150}
                height={60}
                className="h-16 w-auto mb-4"
              />
              <p className="text-sm text-accent-foreground/80">
                Conectando corazones con patitas desde 2024. Una segunda oportunidad para cada mascota.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/inicio" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                    Panel Principal
                  </Link>
                </li>
                <li>
                  <Link href="/adoptar" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                    Adoptar
                  </Link>
                </li>
                <li>
                  <Link href="/perdidos" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                    Mascotas Perdidas
                  </Link>
                </li>
                <li>
                  <Link href="/admin/refugio" className="text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                    Login Refugios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-accent-foreground/80">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@dalepata.com" className="hover:text-accent-foreground transition-colors">
                    info@dalepata.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-accent-foreground/80">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+541112345678" className="hover:text-accent-foreground transition-colors">
                    +54 11 1234-5678
                  </a>
                </li>
                <li className="flex items-center gap-2 text-accent-foreground/80">
                  <MapPin className="w-4 h-4" />
                  <span>Buenos Aires, Argentina</span>
                </li>
              </ul>
            </div>

            {/* Redes sociales */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/dalepata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/dalepata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/dalepata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-accent-foreground/10 pt-8 text-center">
            <p className="text-sm text-accent-foreground/80">
              © {new Date().getFullYear()} DalePata. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}







