'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DestinationAccount } from '@/types/generated';
import { columns } from './columns';
import { CreateDestinationAccountModal } from './CreateDestinationAccountModal';
import { getDestinationAccounts } from '@/services/config/destinations';
import { useToast } from '@/hooks/useToast';

export function DestinationAccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [data, setData] = useState<DestinationAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  async function fetchData() {
    try {
      const items = await getDestinationAccounts();
      setData(items);
    } catch (err) {
      toast.error('Failed to fetch destination accounts');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Destination Accounts</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Destination Account
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      <CreateDestinationAccountModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchData(); // Refresh data after creating
        }}
      />
    </div>
  );
}
