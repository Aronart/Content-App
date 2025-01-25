/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PostSchedule } from './PostSchedule';

export type ContentFlowCreate = {
  name: string;
  source_config_id: number;
  editing_pipeline_id: number;
  destination_account_id: number;
  source_interval?: (number | null);
  post_schedule?: (PostSchedule | null);
  is_active?: boolean;
  require_approval?: boolean;
};

