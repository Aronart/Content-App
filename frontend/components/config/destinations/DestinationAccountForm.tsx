'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DestinationAccountCreate, Platform } from '@/types/generated';

interface DestinationAccountFormProps {
  initialData?: Partial<DestinationAccountCreate>;
  onSubmit: (data: DestinationAccountCreate) => Promise<void>;
  isLoading?: boolean;
}

export const DestinationAccountForm: React.FC<DestinationAccountFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<DestinationAccountCreate>({
    name: initialData.name || '',
    platform: initialData.platform || Platform.YOUTUBE,
    credentials: initialData.credentials || {},
    parameters: initialData.parameters || {},
    schedule_settings: initialData.schedule_settings || {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'credentials' || name === 'parameters' || name === 'schedule_settings') {
      try {
        setFormData((prev) => ({
          ...prev,
          [name]: JSON.parse(value),
        }));
      } catch (error) {
        // Allow invalid JSON while typing
        console.warn('Invalid JSON:', error);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={(value: Platform) => setFormData((prev) => ({ ...prev, platform: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Platform).map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentials">Credentials (JSON)</Label>
        <textarea
          id="credentials"
          name="credentials"
          value={JSON.stringify(formData.credentials, null, 2)}
          onChange={handleChange}
          className="w-full h-32 p-2 border rounded"
          placeholder="Enter credentials in JSON format"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parameters">Parameters (JSON)</Label>
        <textarea
          id="parameters"
          name="parameters"
          value={JSON.stringify(formData.parameters, null, 2)}
          onChange={handleChange}
          className="w-full h-32 p-2 border rounded"
          placeholder="Enter parameters in JSON format"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule_settings">Schedule Settings (JSON)</Label>
        <textarea
          id="schedule_settings"
          name="schedule_settings"
          value={JSON.stringify(formData.schedule_settings, null, 2)}
          onChange={handleChange}
          className="w-full h-32 p-2 border rounded"
          placeholder="Enter schedule settings in JSON format"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Account'}
      </Button>
    </form>
  );
};
