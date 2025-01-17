'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditingPipelineForm } from './EditingPipelineForm';

interface CreateEditingPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEditingPipelineModal({ isOpen, onClose }: CreateEditingPipelineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Editing Pipeline</DialogTitle>
        </DialogHeader>
        <EditingPipelineForm
          onSubmit={async () => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
