'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DestinationAccountForm } from './DestinationAccountForm';

interface CreateDestinationAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDestinationAccountModal({ isOpen, onClose }: CreateDestinationAccountModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Destination Account</DialogTitle>
        </DialogHeader>
        <DestinationAccountForm
          onSubmit={async () => {
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
