
import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

interface DeleteProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const DeleteProjectModal = ({ open, onOpenChange, projectId }: DeleteProjectModalProps) => {
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText === project?.name) {
      console.log('Delete Project:', {
        projectId,
        projectName: project?.name,
        confirmed: true
      });
      // Here you'll connect to backend
      onOpenChange(false);
    }
  };

  const isConfirmValid = confirmText === project?.name;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">Delete Project</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              This action cannot be undone. This will permanently delete the project 
              <strong className="text-red-600"> "{project?.name}" </strong>
              and remove all associated data including tasks, team assignments, and progress.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="confirmText">
                Type <strong>{project?.name}</strong> to confirm deletion:
              </Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={project?.name}
                className="border-red-300 focus:border-red-500"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectModal;
