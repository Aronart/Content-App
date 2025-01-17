'use client';

import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
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
import {
  Platform,
  SourceConfig,
  SourceConfigCreate,
  DiscoveryStrategy,
  SourceStrategy,
  YouTubeDiscoveryParameters,
  RedditDiscoveryParameters,
  YouTubeSourceParameters,
  RedditSourceParameters,
} from '@/types/generated';

interface SourceConfigFormProps {
  initialData?: SourceConfig;
  onSubmit: (data: SourceConfig) => void;
  isLoading?: boolean;
}

interface ControlledSelectProps {
  control: Control<SourceConfig>;
  name: 'platform' 
    | 'discovery_parameters.discovery_strategy' 
    | 'discovery_parameters.source_type'
    | 'source_parameters.source_strategy';
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
}

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  control,
  name,
  label,
  options,
  placeholder,
}) => (
  <div>
    <Label>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  </div>
);

export const SourceConfigForm: React.FC<SourceConfigFormProps> = ({ 
  initialData, 
  onSubmit,
  isLoading = false 
}) => {
  const { control, handleSubmit, watch } = useForm<SourceConfig>({
    defaultValues: initialData || {
      name: '',
      platform: 'youtube',
      credentials: {},
      discovery_parameters: {
        discovery_strategy: 'trending',
        max_items: 10,
        source_type: 'channel',
      },
      source_parameters: {
        source_strategy: 'most_replayed',
        strategy_params: {},
      },
      schedule_settings: {},
    },
  });

  const platform = watch('platform');
  const sourceType = watch('discovery_parameters.source_type');

  const renderPlatformSpecificFields = () => {
    if (platform === 'youtube') {
      const discoveryParams = watch('discovery_parameters') as YouTubeDiscoveryParameters;
      return (
        <>
          {discoveryParams.source_type === 'channel' && (
            <div>
              <Label>Channel IDs (comma-separated)</Label>
              <Controller
                name="discovery_parameters.channel_ids"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value?.join(',') || ''}
                    onChange={(e) => onChange(e.target.value.split(',').map((id) => id.trim()))}
                    placeholder="Enter channel IDs"
                  />
                )}
              />
            </div>
          )}
          {discoveryParams.source_type === 'playlist' && (
            <div>
              <Label>Playlist IDs (comma-separated)</Label>
              <Controller
                name="discovery_parameters.playlist_ids"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value?.join(',') || ''}
                    onChange={(e) => onChange(e.target.value.split(',').map((id) => id.trim()))}
                    placeholder="Enter playlist IDs"
                  />
                )}
              />
            </div>
          )}
          <div>
            <Label>Max Videos per Channel</Label>
            <Controller
              name="discovery_parameters.max_videos_per_channel"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  type="number"
                  value={value || ''}
                  onChange={(e) => onChange(Number(e.target.value))}
                  placeholder="Enter max videos"
                />
              )}
            />
          </div>
        </>
      );
    }

    if (platform === 'reddit') {
      const discoveryParams = watch('discovery_parameters') as RedditDiscoveryParameters;
      return (
        <>
          {discoveryParams.source_type === 'subreddit' && (
            <div>
              <Label>Subreddits (comma-separated)</Label>
              <Controller
                name="discovery_parameters.subreddits"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value?.join(',') || ''}
                    onChange={(e) => onChange(e.target.value.split(',').map((id) => id.trim()))}
                    placeholder="Enter subreddits"
                  />
                )}
              />
            </div>
          )}
          {discoveryParams.source_type === 'user' && (
            <div>
              <Label>Users (comma-separated)</Label>
              <Controller
                name="discovery_parameters.users"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value?.join(',') || ''}
                    onChange={(e) => onChange(e.target.value.split(',').map((id) => id.trim()))}
                    placeholder="Enter usernames"
                  />
                )}
              />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter source config name" />
            )}
          />
        </div>

        <ControlledSelect
          control={control}
          name="platform"
          label="Platform"
          options={[
            { value: 'youtube', label: 'YouTube' },
            { value: 'reddit', label: 'Reddit' },
          ]}
          placeholder="Select platform"
        />

        <ControlledSelect
          control={control}
          name="discovery_parameters.discovery_strategy"
          label="Discovery Strategy"
          options={[
            { value: 'trending', label: 'Trending' },
            { value: 'most_viewed', label: 'Most Viewed' },
            { value: 'most_recent', label: 'Most Recent' },
            { value: 'random', label: 'Random' },
            { value: 'custom', label: 'Custom' },
          ]}
          placeholder="Select discovery strategy"
        />

        <ControlledSelect
          control={control}
          name="discovery_parameters.source_type"
          label="Source Type"
          options={
            platform === 'youtube'
              ? [
                  { value: 'channel', label: 'Channel' },
                  { value: 'playlist', label: 'Playlist' },
                ]
              : [
                  { value: 'subreddit', label: 'Subreddit' },
                  { value: 'user', label: 'User' },
                ]
          }
          placeholder="Select source type"
        />

        {renderPlatformSpecificFields()}

        <div>
          <Label>Max Items</Label>
          <Controller
            name="discovery_parameters.max_items"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(Number(e.target.value))}
                placeholder="Enter max items"
              />
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Source Config'}
      </Button>
    </form>
  );
};
