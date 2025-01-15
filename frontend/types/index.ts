export interface BaseConfig {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SourceConfig extends BaseConfig {
  platform: string;
  credentials: Record<string, any>;
  parameters: Record<string, any>;
  schedule_settings: Record<string, any>;
}

export interface EditingPipeline extends BaseConfig {
  transformation_config: {
    steps: Array<Record<string, any>>;
  };
}

export interface DestinationAccount extends BaseConfig {
  platform: string;
  credentials: Record<string, any>;
  parameters: Record<string, any>;
  schedule_settings: Record<string, any>;
}

export interface ContentFlow extends BaseConfig {
  source_config_id: number;
  editing_pipeline_id: number;
  destination_account_id: number;
  quota_settings: Record<string, any>;
  schedule_settings: Record<string, any>;
  is_active: boolean;
  require_approval: boolean;
}
