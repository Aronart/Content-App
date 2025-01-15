'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Platform } from '@/types/platform';
import { SourceConfig } from '@/types';

interface SourceConfigFormProps {
  initialData?: Partial<SourceConfig>;
  onSubmit: (data: Partial<SourceConfig>) => Promise<void>;
  isLoading?: boolean;
}

export const SourceConfigForm: React.FC<SourceConfigFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<SourceConfig>>({
    credentials: {},
    parameters: {},
    schedule_settings: {},
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure all required fields are present and valid
      const dataToSubmit = {
        ...formData,
        credentials: typeof formData.credentials === 'string' 
          ? JSON.parse(formData.credentials) 
          : formData.credentials || {},
        parameters: typeof formData.parameters === 'string' 
          ? JSON.parse(formData.parameters) 
          : formData.parameters || {},
        schedule_settings: typeof formData.schedule_settings === 'string' 
          ? JSON.parse(formData.schedule_settings) 
          : formData.schedule_settings || {},
      };
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'credentials' || name === 'parameters' || name === 'schedule_settings') {
      try {
        setFormData((prev) => ({
          ...prev,
          [name]: JSON.parse(value),
        }));
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
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
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <select
          id="platform"
          name="platform"
          value={formData.platform || ''}
          onChange={handleChange}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Select Platform</option>
          {Object.values(Platform).map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentials">Credentials</Label>
        <textarea
          id="credentials"
          name="credentials"
          value={
            typeof formData.credentials === 'object'
              ? JSON.stringify(formData.credentials, null, 2)
              : formData.credentials || ''
          }
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter credentials in JSON format"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parameters">Parameters</Label>
        <textarea
          id="parameters"
          name="parameters"
          value={
            typeof formData.parameters === 'object'
              ? JSON.stringify(formData.parameters, null, 2)
              : formData.parameters || ''
          }
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter parameters in JSON format"
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
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter schedule settings in JSON format"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {initialData.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
