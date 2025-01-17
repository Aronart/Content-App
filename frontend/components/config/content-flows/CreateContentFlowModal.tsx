'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContentFlowForm } from './ContentFlowForm';

interface CreateContentFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateContentFlowModal({ isOpen, onClose }: CreateContentFlowModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Content Flow</DialogTitle>
        </DialogHeader>
        <ContentFlowForm
          onSubmit={async () => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
