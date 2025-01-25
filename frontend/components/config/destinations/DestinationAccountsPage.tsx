'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DestinationAccountForm } from './DestinationAccountForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import {
  getDestinationAccount,
  getDestinationAccounts,
  createDestinationAccount,
  updateDestinationAccount,
  deleteDestinationAccount,
} from '@/services/configService';
import { DestinationAccount, DestinationAccountCreate } from '@/types/generated';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

export function DestinationAccountsPage() {
  const [accounts, setAccounts] = React.useState<DestinationAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<DestinationAccount | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const toast = useToast();

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getDestinationAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch destination accounts',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (data: DestinationAccountCreate) => {
    try {
      setIsLoading(true);
      await createDestinationAccount(data);
      await fetchAccounts();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Destination account created successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to create destination account',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: DestinationAccountCreate) => {
    try {
      setIsLoading(true);
      if (!selectedAccount?.id) throw new Error('No account selected');
      await updateDestinationAccount(selectedAccount.id, data);
      await fetchAccounts();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Destination account updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to update destination account',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!selectedAccount?.id) throw new Error('No account selected');
      await deleteDestinationAccount(selectedAccount.id);
      await fetchAccounts();
      setIsDeleteOpen(false);
      setSelectedAccount(null);
      toast({
        title: 'Success',
        description: 'Destination account deleted successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete destination account',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (account: DestinationAccount) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (account: DestinationAccount) => {
    setSelectedAccount(account);
    setIsDeleteOpen(true);
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { key: 'platform', header: 'Platform' },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Destination Accounts</h1>
        <Button
          onClick={() => {
            setSelectedAccount(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? 'Edit Destination Account' : 'Add Destination Account'}
            </DialogTitle>
          </DialogHeader>
          <DestinationAccountForm
            initialData={selectedAccount || undefined}
            onSubmit={selectedAccount ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Destination Account"
        message="Are you sure you want to delete this destination account? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
