// This page was previously marked for removal.
// It's now a minimal component to prevent runtime errors if accessed directly.
// No actual settings functionality is implemented here.

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Configuración</h1>
      <p className="mt-2 text-muted-foreground">
        Esta página de configuración se ha mantenido para evitar errores de ruta.
        Actualmente no hay opciones de configuración funcionales aquí.
      </p>
    </div>
  );
}
