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
import { ContentFlow } from '@/types';
import {
  getSourceConfigs,
  getEditingPipelines,
  getDestinationAccounts,
} from '@/services/configService';
import type { SourceConfig, EditingPipeline, DestinationAccount } from '@/types';

interface ContentFlowFormProps {
  initialData?: Partial<ContentFlow>;
  onSubmit: (data: Partial<ContentFlow>) => Promise<void>;
  isLoading?: boolean;
}

export const ContentFlowForm: React.FC<ContentFlowFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<ContentFlow>>(initialData);
  const [sourceConfigs, setSourceConfigs] = React.useState<SourceConfig[]>([]);
  const [editingPipelines, setEditingPipelines] = React.useState<EditingPipeline[]>([]);
  const [destinationAccounts, setDestinationAccounts] = React.useState<DestinationAccount[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const [sources, pipelines, destinations] = await Promise.all([
        getSourceConfigs(),
        getEditingPipelines(),
        getDestinationAccounts(),
      ]);
      setSourceConfigs(sources);
      setEditingPipelines(pipelines);
      setDestinationAccounts(destinations);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch required data',
        status: 'error'
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save content flow',
        status: 'error'
      });
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_config_id">Source Configuration</Label>
        <Select
          value={formData.source_config_id?.toString()}
          onValueChange={(value) => handleChange('source_config_id', parseInt(value))}
          required
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
          value={formData.editing_pipeline_id?.toString()}
          onValueChange={(value) => handleChange('editing_pipeline_id', parseInt(value))}
          required
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
          value={formData.destination_account_id?.toString()}
          onValueChange={(value) => handleChange('destination_account_id', parseInt(value))}
          required
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
        <Label htmlFor="quota_settings">Quota Settings</Label>
        <textarea
          id="quota_settings"
          name="quota_settings"
          value={
            typeof formData.quota_settings === 'object'
              ? JSON.stringify(formData.quota_settings, null, 2)
              : formData.quota_settings || ''
          }
          onChange={(e) => {
            try {
              handleChange('quota_settings', JSON.parse(e.target.value));
            } catch {
              handleChange('quota_settings', e.target.value);
            }
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter quota settings in JSON format"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule_settings">Schedule Settings</Label>
        <textarea
          id="schedule_settings"
          name="schedule_settings"
          value={
            typeof formData.schedule_settings === 'object'
              ? JSON.stringify(formData.schedule_settings, null, 2)
              : formData.schedule_settings || ''
          }
          onChange={(e) => {
            try {
              handleChange('schedule_settings', JSON.parse(e.target.value));
            } catch {
              handleChange('schedule_settings', e.target.value);
            }
          }}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter schedule settings in JSON format"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active ?? true}
          onCheckedChange={(checked) => handleChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="require_approval"
          checked={formData.require_approval ?? true}
          onCheckedChange={(checked) => handleChange('require_approval', checked)}
        />
        <Label htmlFor="require_approval">Require Approval</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading || isLoadingData}
        >
          {initialData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
