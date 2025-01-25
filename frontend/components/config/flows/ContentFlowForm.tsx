'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  ContentFlowCreate,
  SourceConfig,
  EditingPipeline,
  DestinationAccount,
  PostSchedule,
} from '@/types/generated';
import {
  getSourceConfigs,
  getEditingPipelines,
  getDestinationAccounts,
} from '@/services/configService';

interface ContentFlowFormProps {
  initialData?: Partial<ContentFlowCreate>;
  onSubmit: (data: ContentFlowCreate) => Promise<void>;
  isLoading?: boolean;
}

export const ContentFlowForm: React.FC<ContentFlowFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<ContentFlowCreate>({
    name: initialData.name || '',
    source_config_id: initialData.source_config_id || 0,
    editing_pipeline_id: initialData.editing_pipeline_id || 0,
    destination_account_id: initialData.destination_account_id || 0,
    source_interval: initialData.source_interval || null,
    post_schedule: initialData.post_schedule || null,
    is_active: initialData.is_active ?? true,
    require_approval: initialData.require_approval ?? true
  });

  const [sourceConfigs, setSourceConfigs] = React.useState<SourceConfig[]>([]);
  const [editingPipelines, setEditingPipelines] = React.useState<EditingPipeline[]>([]);
  const [destinationAccounts, setDestinationAccounts] = React.useState<DestinationAccount[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const toast = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [sources, pipelines, destinations] = await Promise.all([
          getSourceConfigs(),
          getEditingPipelines(),
          getDestinationAccounts(),
        ]);
        setSourceConfigs(sources);
        setEditingPipelines(pipelines);
        setDestinationAccounts(destinations);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load required data'
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? null : parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: numberValue,
    }));
  };

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_config_id">Source Config</Label>
        <Select
          value={formData.source_config_id.toString()}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, source_config_id: parseInt(value, 10) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source config" />
          </SelectTrigger>
          <SelectContent>
            {sourceConfigs.map((config) => (
              <SelectItem key={config.id} value={config.id.toString()}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editing_pipeline_id">Editing Pipeline</Label>
        <Select
          value={formData.editing_pipeline_id.toString()}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, editing_pipeline_id: parseInt(value, 10) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select editing pipeline" />
          </SelectTrigger>
          <SelectContent>
            {editingPipelines.map((pipeline) => (
              <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                {pipeline.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination_account_id">Destination Account</Label>
        <Select
          value={formData.destination_account_id.toString()}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, destination_account_id: parseInt(value, 10) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select destination account" />
          </SelectTrigger>
          <SelectContent>
            {destinationAccounts.map((account) => (
              <SelectItem key={account.id} value={account.id.toString()}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_interval">Source Interval (minutes)</Label>
        <Input
          id="source_interval"
          name="source_interval"
          type="number"
          value={formData.source_interval ?? ''}
          onChange={handleNumberChange}
          min={1}
          placeholder="Enter interval in minutes"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="require_approval"
          checked={formData.require_approval}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, require_approval: checked }))}
        />
        <Label htmlFor="require_approval">Require Approval</Label>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Flow'}
      </Button>
    </form>
  );
};
