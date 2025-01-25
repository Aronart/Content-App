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
import { ContentFlow, ContentFlowCreate } from '@/types/generated';

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
      console.error('Error fetching flows:', error);
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

  const handleCreate = async (data: ContentFlowCreate) => {
    try {
      setIsLoading(true);
      await createContentFlow(data);
      await fetchFlows();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Content flow created successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error creating flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to create content flow',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: ContentFlowCreate) => {
    try {
      setIsLoading(true);
      if (!selectedFlow?.id) throw new Error('No flow selected');
      await updateContentFlow(selectedFlow.id, data);
      await fetchFlows();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Content flow updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content flow',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!selectedFlow?.id) throw new Error('No flow selected');
      await deleteContentFlow(selectedFlow.id);
      await fetchFlows();
      setIsDeleteOpen(false);
      setSelectedFlow(null);
      toast({
        title: 'Success',
        description: 'Content flow deleted successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error deleting flow:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content flow',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (flow: ContentFlow) => {
    setSelectedFlow(flow);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (flow: ContentFlow) => {
    setSelectedFlow(flow);
    setIsDeleteOpen(true);
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { key: 'source_config_name', header: 'Source' },
    { key: 'destination_account_name', header: 'Destination' },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Content Flows</h1>
        <Button
          onClick={() => {
            setSelectedFlow(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Flow
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={flows}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFlow ? 'Edit Content Flow' : 'Add Content Flow'}
            </DialogTitle>
          </DialogHeader>
          <ContentFlowForm
            initialData={selectedFlow || undefined}
            onSubmit={selectedFlow ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Content Flow"
        message="Are you sure you want to delete this content flow? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
