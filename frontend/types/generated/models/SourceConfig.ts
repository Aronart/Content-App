/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BaseDiscoveryParameters } from './BaseDiscoveryParameters';
import type { BaseSourcingParameters } from './BaseSourcingParameters';
import type { InstagramDiscoveryParameters } from './InstagramDiscoveryParameters';
import type { InstagramSourcingParameters } from './InstagramSourcingParameters';
import type { Platform } from './Platform';
import type { RedditDiscoveryParameters } from './RedditDiscoveryParameters';
import type { RedditSourcingParameters } from './RedditSourcingParameters';
import type { TikTokDiscoveryParameters } from './TikTokDiscoveryParameters';
import type { TikTokSourcingParameters } from './TikTokSourcingParameters';
import type { YouTubeDiscoveryParameters } from './YouTubeDiscoveryParameters';
import type { YouTubeSourcingParameters } from './YouTubeSourcingParameters';

export type SourceConfig = {
  name: string;
  platform: Platform;
  credentials: Record<string, string>;
  discovery_parameters: (BaseDiscoveryParameters | YouTubeDiscoveryParameters | RedditDiscoveryParameters | InstagramDiscoveryParameters | TikTokDiscoveryParameters);
  sourcing_parameters: (BaseSourcingParameters | YouTubeSourcingParameters | RedditSourcingParameters | InstagramSourcingParameters | TikTokSourcingParameters);
  rate_limit_id?: (number | null);
  id: number;
  created_at: string;
  updated_at: string;
};

