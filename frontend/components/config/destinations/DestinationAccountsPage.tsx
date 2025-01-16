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
import type { DestinationAccount } from '@/types';

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

  const handleCreate = async (data: any) => {
    try {
      await createDestinationAccount(data);
      await fetchAccounts();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Destination account created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create destination account',
        status: 'error'
      });
    }
  };

  const handleEdit = async (data: any) => {
    try {
      if (!selectedAccount?.id) return;
      await updateDestinationAccount(selectedAccount.id, data);
      await fetchAccounts();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Destination account updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update destination account',
        status: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedAccount?.id) return;
      await deleteDestinationAccount(selectedAccount.id);
      await fetchAccounts();
      setIsDeleteOpen(false);
      toast({
        title: 'Success',
        description: 'Destination account deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete destination account',
        status: 'error'
      });
    }
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { 
      key: 'platform', 
      header: 'Platform',
      render: (value: string) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '',
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Destination Accounts</h1>
        <Button onClick={() => {
          setSelectedAccount(null);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={accounts}
        onEdit={(account) => {
          setSelectedAccount(account);
          setIsFormOpen(true);
        }}
        onDelete={(account) => {
          setSelectedAccount(account);
          setIsDeleteOpen(true);
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? 'Edit Account' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          <DestinationAccountForm
            initialData={selectedAccount || {}}
            onSubmit={selectedAccount ? handleEdit : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete this destination account? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
