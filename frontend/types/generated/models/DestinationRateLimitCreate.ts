/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DestinationRateLimitCreate = {
  name: string;
  max_daily_actions: number;
  min_time_between_actions: number;
  blackout_periods?: Record<string, any>;
};

