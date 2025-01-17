'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ContentFlow } from '@/types/generated';
import { columns } from './columns';
import { CreateContentFlowModal } from './CreateContentFlowModal';
import { getContentFlows } from '@/services/config/flows';
import { useToast } from '@/hooks/useToast';

export function ContentFlowsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [data, setData] = useState<ContentFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  async function fetchData() {
    try {
      const items = await getContentFlows();
      setData(items);
    } catch (err) {
      toast.error('Failed to fetch content flows');
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
        <h1 className="text-2xl font-bold">Content Flows</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Content Flow
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      <CreateContentFlowModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchData(); // Refresh data after creating
        }}
      />
    </div>
  );
}
