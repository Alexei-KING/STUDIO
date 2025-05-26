import { Layers3 } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Layers3 className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-semibold text-primary">
        UNEFA<span className="font-normal text-foreground">Hub</span>
      </h1>
    </div>
  );
}
