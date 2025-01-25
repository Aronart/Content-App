/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SourceRateLimit = {
  name: string;
  max_daily_actions: number;
  min_time_between_actions: number;
  blackout_periods?: Record<string, any>;
  id: number;
  current_action_count?: number;
  last_action_at?: (string | null);
  created_at: string;
  updated_at: string;
};

