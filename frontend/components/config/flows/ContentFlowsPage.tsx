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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import {
  ContentFlow,
  getContentFlows,
  createContentFlow,
  updateContentFlow,
  deleteContentFlow,
  getSourceConfigs,
  getEditingPipelines,
  getDestinationAccounts,
} from '@/services/configService';

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
        variant: 'destructive',
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
        variant: 'destructive',
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
        variant: 'destructive',
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
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'is_active',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'require_approval',
      header: 'Approval',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Required' : 'Not Required'}
        </Badge>
      ),
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
