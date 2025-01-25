/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ContentQueueItemResponse = {
  id: number;
  source_platform: string;
  source_url: string;
  source_data: Record<string, any>;
  edited_content_path: (string | null);
  content_flow_id: number;
  preview_path: (string | null);
  status: string;
  scheduled_time: (string | null);
  error_log: (Record<string, any> | null);
  created_at: string;
  updated_at: string;
};

