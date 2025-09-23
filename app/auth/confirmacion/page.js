import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">¡Cuenta Creada!</CardTitle>
            <CardDescription>Revisa tu correo para confirmar tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Te hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, revisa tu bandeja de
              entrada y haz clic en el enlace para activar tu cuenta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





