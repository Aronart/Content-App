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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import {
  EditingPipeline,
  getEditingPipelines,
  createEditingPipeline,
  updateEditingPipeline,
  deleteEditingPipeline,
} from '@/services/configService';

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
      toast({
        title: 'Error',
        description: 'Failed to fetch editing pipelines',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPipelines();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createEditingPipeline(data);
      await fetchPipelines();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Editing pipeline created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create editing pipeline',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (data: any) => {
    try {
      if (!selectedPipeline?.id) return;
      await updateEditingPipeline(selectedPipeline.id, data);
      await fetchPipelines();
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Editing pipeline updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update editing pipeline',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedPipeline?.id) return;
      await deleteEditingPipeline(selectedPipeline.id);
      await fetchPipelines();
      setIsDeleteOpen(false);
      toast({
        title: 'Success',
        description: 'Editing pipeline deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete editing pipeline',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'created_at',
      header: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Editing Pipelines</h1>
        <Button onClick={() => {
          setSelectedPipeline(null);
          setIsFormOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Pipeline
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pipelines}
        onEdit={(pipeline) => {
          setSelectedPipeline(pipeline);
          setIsFormOpen(true);
        }}
        onDelete={(pipeline) => {
          setSelectedPipeline(pipeline);
          setIsDeleteOpen(true);
        }}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPipeline ? 'Edit Pipeline' : 'Create Pipeline'}
            </DialogTitle>
          </DialogHeader>
          <EditingPipelineForm
            initialData={selectedPipeline || {}}
            onSubmit={selectedPipeline ? handleEdit : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Pipeline"
        message="Are you sure you want to delete this editing pipeline? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
