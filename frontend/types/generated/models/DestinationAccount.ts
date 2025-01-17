/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Platform } from './Platform';

export type DestinationAccount = {
  name: string;
  platform: Platform;
  credentials: Record<string, string>;
  parameters: Record<string, any>;
  id: number;
  created_at: string;
  updated_at: string;
};

