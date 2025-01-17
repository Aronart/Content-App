'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateSourceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSourceConfigModal({ isOpen, onClose }: CreateSourceConfigModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Source Configuration</DialogTitle>
        </DialogHeader>
        {/* TODO: Add form fields */}
      </DialogContent>
    </Dialog>
  );
}
