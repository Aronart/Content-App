'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { GlobalConfig, GlobalConfigUpdate } from '@/types/generated';
import { getGlobalConfig, updateGlobalConfig } from '@/services/globalConfigService';

export function GlobalConfigForm() {
  const [config, setConfig] = useState<GlobalConfigUpdate>({
    require_approval: true,
    enable_automatic_posting: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const data = await getGlobalConfig();
        setConfig({
          require_approval: data.require_approval,
          enable_automatic_posting: data.enable_automatic_posting,
        });
      } catch (error) {
        console.error('Error fetching global config:', error);
        toast({
          title: 'Error',
          description: 'Failed to load global configuration',
          status: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [toast]);

  const handleToggle = async (field: keyof GlobalConfigUpdate) => {
    try {
      setIsLoading(true);
      const newValue = !config[field];
      const data = await updateGlobalConfig({ [field]: newValue });
      setConfig({
        require_approval: data.require_approval,
        enable_automatic_posting: data.enable_automatic_posting,
      });
      toast({
        title: 'Success',
        description: 'Global configuration updated',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating global config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update global configuration',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleToggle('require_approval');
    await handleToggle('enable_automatic_posting');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="require-approval">Require Approval</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, content must be manually approved before posting
            </p>
          </div>
          <Switch
            id="require-approval"
            checked={config.require_approval}
            onCheckedChange={() => handleToggle('require_approval')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-automatic-posting">Enable Automatic Posting</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, approved content will be automatically posted according to schedule
            </p>
          </div>
          <Switch
            id="enable-automatic-posting"
            checked={config.enable_automatic_posting}
            onCheckedChange={() => handleToggle('enable_automatic_posting')}
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
}
