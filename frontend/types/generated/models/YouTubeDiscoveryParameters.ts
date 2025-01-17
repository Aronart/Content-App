/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DiscoveryStrategy } from './DiscoveryStrategy';
import type { SourceType } from './SourceType';

export type YouTubeDiscoveryParameters = {
  discovery_strategy?: DiscoveryStrategy;
  max_items?: number;
  /**
   * Type of YouTube source (channel or playlist)
   */
  source_type: SourceType;
  /**
   * List of YouTube channel IDs
   */
  channel_ids?: (Array<string> | null);
  /**
   * List of YouTube playlist IDs
   */
  playlist_ids?: (Array<string> | null);
  /**
   * Maximum number of videos to fetch per channel
   */
  max_videos_per_channel?: (number | null);
  /**
   * Minimum video duration in seconds
   */
  min_duration?: (number | null);
  /**
   * Maximum video duration in seconds
   */
  max_duration?: (number | null);
  /**
   * YouTube video category
   */
  category?: (string | null);
};

