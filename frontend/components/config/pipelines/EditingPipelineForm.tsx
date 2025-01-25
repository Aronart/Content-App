import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditingPipelineCreate } from '@/types/generated';

interface EditingPipelineFormProps {
  initialData?: Partial<EditingPipelineCreate>;
  onSubmit: (data: EditingPipelineCreate) => Promise<void>;
  isLoading?: boolean;
}

export const EditingPipelineForm: React.FC<EditingPipelineFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<EditingPipelineCreate>({
    name: initialData.name || '',
    transformation_config: initialData.transformation_config || {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transformation_config">Transformation Config (JSON)</Label>
        <textarea
          id="transformation_config"
          name="transformation_config"
          value={JSON.stringify(formData.transformation_config, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData((prev) => ({
                ...prev,
                transformation_config: parsed,
              }));
            } catch (error) {
              // Allow invalid JSON while typing
              console.warn('Invalid JSON:', error);
            }
          }}
          className="w-full h-48 p-2 border rounded"
          placeholder="Enter transformation config in JSON format"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Pipeline'}
      </Button>
    </form>
  );
};
