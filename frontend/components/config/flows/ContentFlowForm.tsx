'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import {
  ContentFlow,
  SourceConfig,
  EditingPipeline,
  DestinationAccount,
} from '@/types';
import {
  getSourceConfigs,
  getEditingPipelines,
  getDestinationAccounts,
} from '@/services/configService';

interface ContentFlowFormProps {
  initialData?: Partial<ContentFlow>;
  onSubmit: (data: Omit<ContentFlow, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
}

export const ContentFlowForm: React.FC<ContentFlowFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const toast = useToast();
  const [formData, setFormData] = React.useState<Partial<ContentFlow>>({
    name: '',
    source_config_id: 0,
    editing_pipeline_id: 0,
    destination_account_id: 0,
    quota_settings: {},
    schedule_settings: {},
    is_active: true,
    require_approval: false,
    ...initialData,
  });

  const [sourceConfigs, setSourceConfigs] = React.useState<SourceConfig[]>([]);
  const [editingPipelines, setEditingPipelines] = React.useState<EditingPipeline[]>([]);
  const [destinationAccounts, setDestinationAccounts] = React.useState<DestinationAccount[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [sources, pipelines, accounts] = await Promise.all([
          getSourceConfigs(),
          getEditingPipelines(),
          getDestinationAccounts(),
        ]);
        setSourceConfigs(sources);
        setEditingPipelines(pipelines);
        setDestinationAccounts(accounts);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch required data',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData as Omit<ContentFlow, 'id' | 'created_at' | 'updated_at'>);
      toast({
        title: 'Success',
        description: 'Content flow saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save content flow',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="source_config">Source Configuration</Label>
          <Select
            value={formData.source_config_id?.toString()}
            onValueChange={(value) => handleChange('source_config_id', parseInt(value))}
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

        <div className="grid gap-2">
          <Label htmlFor="editing_pipeline">Editing Pipeline</Label>
          <Select
            value={formData.editing_pipeline_id?.toString()}
            onValueChange={(value) => handleChange('editing_pipeline_id', parseInt(value))}
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

        <div className="grid gap-2">
          <Label htmlFor="destination_account">Destination Account</Label>
          <Select
            value={formData.destination_account_id?.toString()}
            onValueChange={(value) => handleChange('destination_account_id', parseInt(value))}
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

        <div className="grid gap-2">
          <Label htmlFor="quota_settings">Quota Settings</Label>
          <Textarea
            id="quota_settings"
            name="quota_settings"
            value={JSON.stringify(formData.quota_settings || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange('quota_settings', parsed);
              } catch {
                // Allow invalid JSON while typing
                handleChange('quota_settings', e.target.value);
              }
            }}
            className="font-mono"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            Enter quota settings in JSON format
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="schedule_settings">Schedule Settings</Label>
          <Textarea
            id="schedule_settings"
            name="schedule_settings"
            value={JSON.stringify(formData.schedule_settings || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange('schedule_settings', parsed);
              } catch {
                // Allow invalid JSON while typing
                handleChange('schedule_settings', e.target.value);
              }
            }}
            className="font-mono"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            Enter schedule settings in JSON format
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => handleChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="require_approval"
            checked={formData.require_approval}
            onCheckedChange={(checked) => handleChange('require_approval', checked)}
          />
          <Label htmlFor="require_approval">Require Approval</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Flow'}
      </Button>
    </form>
  );
};
