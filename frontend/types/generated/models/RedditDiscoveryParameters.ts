/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DiscoveryStrategy } from './DiscoveryStrategy';
import type { SourceType } from './SourceType';

export type RedditDiscoveryParameters = {
  discovery_strategy?: DiscoveryStrategy;
  max_items?: number;
  /**
   * Type of Reddit source (subreddit or user)
   */
  source_type: SourceType;
  /**
   * List of subreddit names
   */
  subreddits?: (Array<string> | null);
  /**
   * List of Reddit usernames
   */
  users?: (Array<string> | null);
  /**
   * Minimum score (upvotes) for posts
   */
  min_score?: (number | null);
  /**
   * Whether to include NSFW content
   */
  include_nsfw?: boolean;
  /**
   * Time filter for Reddit content
   */
  time_filter?: string;
};

