'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EditingPipelineForm } from './EditingPipelineForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import {
  getEditingPipeline,
  getEditingPipelines,
  createEditingPipeline,
  updateEditingPipeline,
  deleteEditingPipeline,
} from '@/services/configService';
import { EditingPipeline, EditingPipelineCreate } from '@/types/generated';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

export function EditingPipelinesPage() {
  const [pipelines, setPipelines] = React.useState<EditingPipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = React.useState<EditingPipeline | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const toast = useToast();

  const fetchPipelines = async () => {
    try {
      setIsLoading(true);
      const data = await getEditingPipelines();
      setPipelines(data);
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch editing pipelines',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreate = async (data: EditingPipelineCreate) => {
    try {
      setIsLoading(true);
      await createEditingPipeline(data);
      await fetchPipelines();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Editing pipeline created successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error creating pipeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to create editing pipeline',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: EditingPipelineCreate) => {
    try {
      setIsLoading(true);
      if (!selectedPipeline?.id) throw new Error('No pipeline selected');
      await updateEditingPipeline(selectedPipeline.id, data);
      await fetchPipelines();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Editing pipeline updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating pipeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to update editing pipeline',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!selectedPipeline?.id) throw new Error('No pipeline selected');
      await deleteEditingPipeline(selectedPipeline.id);
      await fetchPipelines();
      setIsDeleteOpen(false);
      setSelectedPipeline(null);
      toast({
        title: 'Success',
        description: 'Editing pipeline deleted successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error deleting pipeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete editing pipeline',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pipeline: EditingPipeline) => {
    setSelectedPipeline(pipeline);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (pipeline: EditingPipeline) => {
    setSelectedPipeline(pipeline);
    setIsDeleteOpen(true);
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Editing Pipelines</h1>
        <Button
          onClick={() => {
            setSelectedPipeline(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Pipeline
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pipelines}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPipeline ? 'Edit Editing Pipeline' : 'Add Editing Pipeline'}
            </DialogTitle>
          </DialogHeader>
          <EditingPipelineForm
            initialData={selectedPipeline || undefined}
            onSubmit={selectedPipeline ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Editing Pipeline"
        message="Are you sure you want to delete this editing pipeline? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
