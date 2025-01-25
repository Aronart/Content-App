'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SourceConfigForm } from './SourceConfigForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import {
  getSourceConfig,
  getSourceConfigs,
  createSourceConfig,
  updateSourceConfig,
  deleteSourceConfig,
} from '@/services/configService';
import { SourceConfig, SourceConfigCreate } from '@/types/generated';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

export function SourceConfigsPage() {
  const [configs, setConfigs] = React.useState<SourceConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = React.useState<SourceConfig | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const toast = useToast();

  const fetchConfigs = async () => {
    try {
      setIsLoading(true);
      const data = await getSourceConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch source configurations',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreate = async (data: SourceConfigCreate) => {
    try {
      setIsLoading(true);
      await createSourceConfig(data);
      await fetchConfigs();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Source configuration created successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error creating config:', error);
      toast({
        title: 'Error',
        description: 'Failed to create source configuration',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: SourceConfigCreate) => {
    try {
      setIsLoading(true);
      if (!selectedConfig?.id) throw new Error('No config selected');
      await updateSourceConfig(selectedConfig.id, data);
      await fetchConfigs();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Source configuration updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update source configuration',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!selectedConfig?.id) throw new Error('No config selected');
      await deleteSourceConfig(selectedConfig.id);
      await fetchConfigs();
      setIsDeleteOpen(false);
      setSelectedConfig(null);
      toast({
        title: 'Success',
        description: 'Source configuration deleted successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error deleting config:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete source configuration',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (config: SourceConfig) => {
    setSelectedConfig(config);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (config: SourceConfig) => {
    setSelectedConfig(config);
    setIsDeleteOpen(true);
  };

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { key: 'platform', header: 'Platform' },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Source Configurations</h1>
        <Button
          onClick={() => {
            setSelectedConfig(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={configs}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedConfig ? 'Edit Source Configuration' : 'Add Source Configuration'}
            </DialogTitle>
          </DialogHeader>
          <SourceConfigForm
            initialData={selectedConfig || undefined}
            onSubmit={selectedConfig ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Source Configuration"
        message="Are you sure you want to delete this source configuration? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
