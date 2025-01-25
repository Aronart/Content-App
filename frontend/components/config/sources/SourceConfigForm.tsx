import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Platform } from '@/types/generated/models/Platform';
import { SourceConfig } from '@/types/generated/models/SourceConfig';
import { SourceConfigCreate } from '@/types/generated/models/SourceConfigCreate';
import { SourceRateLimit } from '@/types/generated/models/SourceRateLimit';
import { API_BASE } from '@/config';
import { SourceType } from '@/types/generated/models/SourceType';
import { ContentSelectionStrategy } from '@/types/generated/models/ContentSelectionStrategy';
import { ContentProcessingType } from '@/types/generated/models/ContentProcessingType';

interface SourceConfigFormProps {
  initialData?: Partial<SourceConfig>;
  onSubmit: (data: SourceConfigCreate) => Promise<void>;
  isLoading?: boolean;
}

export const SourceConfigForm: React.FC<SourceConfigFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SourceConfigCreate>({
    name: initialData.name || '',
    platform: initialData.platform || Platform.YOUTUBE,
    credentials: initialData.credentials || {},
    discovery_parameters: initialData.discovery_parameters || {
      source_type: SourceType.CHANNEL,
      selection_strategy: ContentSelectionStrategy.MOST_RECENT,
      max_items: 10
    },
    sourcing_parameters: initialData.sourcing_parameters || {
      processing_type: ContentProcessingType.FULL,
      output_format: 'mp4'
    },
    rate_limit_id: initialData.rate_limit_id,
    schedule_settings: {}
  });

  const [rateLimits, setRateLimits] = useState<SourceRateLimit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'credentials' | 'discovery' | 'sourcing'>('credentials');

  useEffect(() => {
    const fetchRateLimits = async () => {
      try {
        const response = await fetch(`${API_BASE}/config/source-rate-limits`);
        if (!response.ok) throw new Error('Failed to fetch rate limits');
        const data = await response.json();
        setRateLimits(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching rate limits:', error);
        setError('Failed to load rate limits');
      }
    };

    fetchRateLimits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    try {
      await onSubmit(formData);
      setError(null);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.status === 422) {
        // Handle validation errors from backend
        const validationData = await error.response.json();
        setValidationErrors(validationData.detail.reduce((acc: Record<string, string>, curr: any) => {
          acc[curr.loc[curr.loc.length - 1]] = curr.msg;
          return acc;
        }, {}));
      } else if (error.response?.status === 409) {
        // Handle unique constraint violation
        setError('A source config with this name already exists');
      } else {
        setError('Failed to save configuration');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParameterChange = (type: 'discovery' | 'sourcing', field: string, value: any) => {
    const paramField = type === 'discovery' ? 'discovery_parameters' : 'sourcing_parameters';
    setFormData((prev) => ({
      ...prev,
      [paramField]: {
        ...prev[paramField],
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={validationErrors.name ? 'border-destructive' : ''}
        />
        {validationErrors.name && (
          <p className="text-sm text-destructive">{validationErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={(value: Platform) => {
            setFormData((prev) => ({
              ...prev,
              platform: value,
              // Reset parameters when platform changes
              discovery_parameters: {
                source_type: SourceType.CHANNEL,
                selection_strategy: ContentSelectionStrategy.MOST_RECENT,
                max_items: 10
              },
              sourcing_parameters: {
                processing_type: ContentProcessingType.FULL,
                output_format: 'mp4'
              }
            }));
          }}
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
        <Label htmlFor="rate-limit">Rate Limit</Label>
        <Select
          value={formData.rate_limit_id?.toString() || undefined}
          onValueChange={(value) => setFormData((prev) => ({ 
            ...prev, 
            rate_limit_id: value ? parseInt(value) : null 
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={rateLimits.length ? "Select rate limit" : "No rate limits available"} />
          </SelectTrigger>
          <SelectContent>
            {rateLimits.length > 0 ? (
              rateLimits.map((limit) => (
                <SelectItem key={limit.id} value={limit.id.toString()}>
                  {limit.name} ({limit.max_daily_actions}/day)
                </SelectItem>
              ))
            ) : (
              <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                No rate limits available
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md p-4 space-y-4">
        <div className="flex space-x-1 border-b">
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === 'credentials' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('credentials')}
          >
            Credentials
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === 'discovery' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('discovery')}
          >
            Discovery
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === 'sourcing' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('sourcing')}
          >
            Sourcing
          </button>
        </div>
          
        {activeTab === 'credentials' && (
          <div className="space-y-2">
            <Label htmlFor="credentials">API Credentials</Label>
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
        )}

        {activeTab === 'discovery' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-type">Source Type</Label>
              <Select
                value={formData.discovery_parameters.source_type}
                onValueChange={(value: SourceType) => handleParameterChange('discovery', 'source_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SourceType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="selection-strategy">Selection Strategy</Label>
              <Select
                value={formData.discovery_parameters.selection_strategy}
                onValueChange={(value: ContentSelectionStrategy) => 
                  handleParameterChange('discovery', 'selection_strategy', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContentSelectionStrategy).map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-items">Max Items</Label>
              <Input
                id="max-items"
                type="number"
                min="1"
                max="100"
                value={formData.discovery_parameters.max_items}
                onChange={(e) => handleParameterChange('discovery', 'max_items', parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        {activeTab === 'sourcing' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="processing-type">Processing Type</Label>
              <Select
                value={formData.sourcing_parameters.processing_type}
                onValueChange={(value: ContentProcessingType) => 
                  handleParameterChange('sourcing', 'processing_type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select processing type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContentProcessingType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output-format">Output Format</Label>
              <Select
                value={formData.sourcing_parameters.output_format}
                onValueChange={(value) => handleParameterChange('sourcing', 'output_format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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
