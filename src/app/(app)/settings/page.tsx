import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Administra la configuración de tu cuenta y de la aplicación."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Opciones de Configuración</CardTitle>
          <CardDescription>
            Esta sección está en desarrollo. Próximamente podrás configurar varios aspectos de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">Preferencias de Notificaciones</h3>
              <p className="text-sm text-muted-foreground">Ajustes para notificaciones por correo y dentro de la app (Próximamente).</p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">Configuración de Tema</h3>
              <p className="text-sm text-muted-foreground">Selector de tema claro/oscuro (Próximamente).</p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold">Gestión de Cuenta</h3>
              <p className="text-sm text-muted-foreground">Cambiar contraseña, actualizar información de perfil (Próximamente).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
