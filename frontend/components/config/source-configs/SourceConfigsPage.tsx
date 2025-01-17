'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { SourceConfig } from '@/types/generated';
import { columns } from './columns';
import { CreateSourceConfigModal } from './CreateSourceConfigModal';
import { getSourceConfigs } from '@/services/config/sources';
import { useToast } from '@/hooks/useToast';

export function SourceConfigsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [data, setData] = useState<SourceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  async function fetchData() {
    try {
      const items = await getSourceConfigs();
      setData(items);
    } catch (err) {
      toast.error('Failed to fetch source configurations');
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
        <h1 className="text-2xl font-bold">Source Configurations</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Source Config
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      <CreateSourceConfigModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchData(); // Refresh data after creating
        }}
      />
    </div>
  );
}
