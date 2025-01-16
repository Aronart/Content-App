'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ContentFlowForm } from './ContentFlowForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import {
  getContentFlow,
  getContentFlows,
  createContentFlow,
  updateContentFlow,
  deleteContentFlow,
} from '@/services/configService';
import type { ContentFlow } from '@/types';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

export function ContentFlowsPage() {
  const [flows, setFlows] = React.useState<ContentFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = React.useState<ContentFlow | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const toast = useToast();

  const fetchFlows = async () => {
    try {
      setIsLoading(true);
      const data = await getContentFlows();
      setFlows(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch content flows',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createContentFlow(data);
      await fetchFlows();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Content flow created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create content flow',
        status: 'error'
      });
    }
  };

  const handleEdit = async (data: any) => {
    try {
      if (!selectedFlow?.id) return;
      await updateContentFlow(selectedFlow.id, data);
      await fetchFlows();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Content flow updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update content flow',
        status: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedFlow?.id) return;
      await deleteContentFlow(selectedFlow.id);
      await fetchFlows();
      setIsDeleteOpen(false);
      toast({
        title: 'Success',
        description: 'Content flow deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete content flow',
        status: 'error'
      });
    }
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'created_at',
      header: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Content Flows</h1>
        <Button onClick={() => {
          setSelectedFlow(null);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Flow
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={flows}
        onEdit={(flow) => {
          setSelectedFlow(flow);
          setIsFormOpen(true);
        }}
        onDelete={(flow) => {
          setSelectedFlow(flow);
          setIsDeleteOpen(true);
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFlow ? 'Edit Flow' : 'Create Flow'}
            </DialogTitle>
          </DialogHeader>
          <ContentFlowForm
            initialData={selectedFlow || {}}
            onSubmit={selectedFlow ? handleEdit : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Flow"
        message="Are you sure you want to delete this content flow? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
