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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import {
  SourceConfig,
  getSourceConfigs,
  createSourceConfig,
  updateSourceConfig,
  deleteSourceConfig,
} from '@/services/configService';

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
      toast({
        title: 'Error',
        description: 'Failed to fetch source configs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createSourceConfig(data);
      await fetchConfigs();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Source config created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create source config',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (data: any) => {
    try {
      if (!selectedConfig?.id) return;
      await updateSourceConfig(selectedConfig.id, data);
      await fetchConfigs();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Source config updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update source config',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedConfig?.id) return;
      await deleteSourceConfig(selectedConfig.id);
      await fetchConfigs();
      setIsDeleteOpen(false);
      toast({
        title: 'Success',
        description: 'Source config deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error && error.message.includes('content flows') 
          ? 'Cannot delete source config that is being used by content flows. Please delete the associated content flows first.'
          : 'Failed to delete source config',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { 
      key: 'platform', 
      header: 'Type',
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
        <h1 className="text-3xl font-bold tracking-tight">Source Configurations</h1>
        <Button onClick={() => {
          setSelectedConfig(null);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={configs}
        onEdit={(config) => {
          setSelectedConfig(config);
          setIsFormOpen(true);
        }}
        onDelete={(config) => {
          setSelectedConfig(config);
          setIsDeleteOpen(true);
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedConfig ? 'Edit Source' : 'Create Source'}
            </DialogTitle>
          </DialogHeader>
          <SourceConfigForm
            initialData={selectedConfig || {}}
            onSubmit={selectedConfig ? handleEdit : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Source"
        message="Are you sure you want to delete this source configuration? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
