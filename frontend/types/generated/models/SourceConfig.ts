/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Platform } from './Platform';
import type { RedditDiscoveryParameters } from './RedditDiscoveryParameters';
import type { RedditSourceParameters } from './RedditSourceParameters';
import type { YouTubeDiscoveryParameters } from './YouTubeDiscoveryParameters';
import type { YouTubeSourceParameters } from './YouTubeSourceParameters';

export type SourceConfig = {
  name: string;
  platform: Platform;
  credentials: Record<string, string>;
  discovery_parameters: (YouTubeDiscoveryParameters | RedditDiscoveryParameters);
  source_parameters: (YouTubeSourceParameters | RedditSourceParameters);
  id: number;
  created_at: string;
  updated_at: string;
};

