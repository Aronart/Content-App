/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ContentFlowCreate = {
  name: string;
  source_config_id: number;
  editing_pipeline_id: number;
  destination_account_id: number;
  quota_settings: Record<string, any>;
  schedule_settings: Record<string, any>;
  is_active?: boolean;
  require_approval?: boolean;
};

