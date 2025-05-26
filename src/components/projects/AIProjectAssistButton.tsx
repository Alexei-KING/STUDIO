'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import { suggestProjectDetailsAction } from '@/lib/actions/project.actions';
import type { SuggestProjectDetailsOutput } from '@/ai/flows/suggest-project-details';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/shared/Spinner';
import type { UseFormSetValue } from 'react-hook-form'; 

interface AIProjectAssistButtonProps {
  currentDescription: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>; 
}

export function AIProjectAssistButton({ currentDescription, setValue }: AIProjectAssistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestDetails = () => {
    if (!currentDescription || currentDescription.trim().length < 10) {
      toast({
        title: 'Descripción Demasiado Corta',
        description: 'Por favor, proporciona una descripción del proyecto más detallada (al menos 10 caracteres).',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await suggestProjectDetailsAction(currentDescription);
      if (result.success) {
        const { projectType, publicObjective, scope } = result.data;
        setValue('projectType', projectType, { shouldValidate: true });
        setValue('publicObjective', publicObjective, { shouldValidate: true });
        setValue('scope', scope, { shouldValidate: true });
        toast({
          title: 'Sugerencias de IA Aplicadas',
          description: 'Se han completado el tipo de proyecto, el objetivo público y el alcance.',
          className: 'bg-accent text-accent-foreground',
        });
      } else {
        toast({
          title: 'Sugerencia de IA Fallida',
          description: result.error, // El error ya está traducido desde la acción
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSuggestDetails}
      disabled={isPending || !currentDescription || currentDescription.trim().length < 10}
      className="w-full sm:w-auto"
    >
      {isPending ? <Spinner size="sm" className="mr-2" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Sugerir con IA
    </Button>
  );
}
