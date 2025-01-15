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
import { DestinationAccount } from '@/types';

interface DestinationAccountFormProps {
  initialData?: Partial<DestinationAccount>;
  onSubmit: (data: Partial<DestinationAccount>) => Promise<void>;
  isLoading?: boolean;
}

export const DestinationAccountForm: React.FC<DestinationAccountFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<DestinationAccount>>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (value: string) => {
    setFormData((prev) => ({ ...prev, platform: value }));
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
        <Select
          value={formData.platform}
          onValueChange={handlePlatformChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
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
          className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
          className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
