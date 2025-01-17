/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Platform } from './Platform';

export type DestinationAccountCreate = {
  name: string;
  platform: Platform;
  credentials: Record<string, string>;
  parameters: Record<string, any>;
  schedule_settings: Record<string, any>;
};

