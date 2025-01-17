'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { EditingPipeline } from '@/types/generated';
import { columns } from './columns';
import { CreateEditingPipelineModal } from './CreateEditingPipelineModal';
import { getEditingPipelines } from '@/services/config/pipelines';
import { useToast } from '@/hooks/useToast';

export function EditingPipelinesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [data, setData] = useState<EditingPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  async function fetchData() {
    try {
      const items = await getEditingPipelines();
      setData(items);
    } catch (err) {
      toast.error('Failed to fetch editing pipelines');
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
        <h1 className="text-2xl font-bold">Editing Pipelines</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add Editing Pipeline
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}

      <CreateEditingPipelineModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchData(); // Refresh data after creating
        }}
      />
    </div>
  );
}
