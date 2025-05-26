'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteProjectAction } from '@/lib/actions/project.actions';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/shared/Spinner';

interface DeleteProjectDialogProps {
  projectId: string;
  projectName: string;
  onDeleted?: () => void;
}

export function DeleteProjectDialog({ projectId, projectName, onDeleted }: DeleteProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (result.success) {
        toast({
          title: 'Project Deleted',
          description: `"${projectName}" has been successfully deleted.`,
          className: 'bg-accent text-accent-foreground border-accent',
        });
        setIsOpen(false);
        if (onDeleted) onDeleted();
      } else {
        toast({
          title: 'Error Deleting Project',
          description: result.message || 'An unknown error occurred.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete Project</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project
            <strong className="mx-1">{projectName}</strong>
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
