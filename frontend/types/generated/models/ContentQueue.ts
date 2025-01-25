/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentFlow } from './ContentFlow';
import type { ContentStatus } from './ContentStatus';
import type { Platform } from './Platform';

export type ContentQueue = {
  source_platform: Platform;
  source_url: string;
  source_data: Record<string, any>;
  edited_content_path?: (string | null);
  content_flow_id: number;
  preview_path?: (string | null);
  status?: ContentStatus;
  scheduled_time?: (string | null);
  error_log?: (Record<string, any> | null);
  id: number;
  created_at: string;
  updated_at: string;
  content_flow: ContentFlow;
};

