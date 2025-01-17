import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditingPipeline, EditingPipelineCreate } from '@/types/generated';

interface EditingPipelineFormProps {
  initialData?: Partial<EditingPipeline>;
  onSubmit: (data: Partial<EditingPipeline>) => Promise<void>;
  isLoading?: boolean;
}

export const EditingPipelineForm: React.FC<EditingPipelineFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Partial<EditingPipeline>>(initialData);

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
        <Label htmlFor="transformation_config">Transformation Config (JSON)</Label>
        <textarea
          id="transformation_config"
          name="transformation_config"
          value={
            typeof formData.transformation_config === 'object'
              ? JSON.stringify(formData.transformation_config, null, 2)
              : formData.transformation_config || ''
          }
          onChange={handleChange}
          className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter transformation config as JSON"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
