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
import { DestinationAccount, DestinationAccountCreate, Platform } from '@/types/generated';

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

  const handlePlatformChange = (value: Platform) => {
    setFormData((prev) => ({
      ...prev,
      platform: value,
      // Reset platform-specific fields when platform changes
      credentials: {},
      parameters: {},
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
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={handlePlatformChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="reddit">Reddit</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform-specific credential fields */}
      {formData.platform === 'youtube' && (
        <div className="space-y-2">
          <Label htmlFor="credentials.api_key">YouTube API Key</Label>
          <Input
            id="credentials.api_key"
            name="credentials.api_key"
            value={formData.credentials?.api_key || ''}
            onChange={handleChange}
            type="password"
            required
          />
        </div>
      )}

      {/* Add other platform-specific fields here */}

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
