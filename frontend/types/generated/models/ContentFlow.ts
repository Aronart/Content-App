/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DestinationAccount } from './DestinationAccount';
import type { EditingPipeline } from './EditingPipeline';
import type { SourceConfig } from './SourceConfig';

export type ContentFlow = {
  name: string;
  source_config_id: number;
  editing_pipeline_id: number;
  destination_account_id: number;
  quota_settings: Record<string, any>;
  schedule_settings: Record<string, any>;
  is_active?: boolean;
  require_approval?: boolean;
  id: number;
  created_at: string;
  updated_at: string;
  source_config: SourceConfig;
  editing_pipeline: EditingPipeline;
  destination_account: DestinationAccount;
};

