/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSelectionStrategy } from './ContentSelectionStrategy';

export type RedditDiscoveryParameters = {
  source_type: RedditDiscoveryParameters.source_type;
  /**
   * Strategy for selecting which content to process from a source
   */
  selection_strategy?: ContentSelectionStrategy;
  max_items?: number;
  subreddits?: Array<string>;
  users?: Array<string>;
  min_score?: (number | null);
  include_nsfw?: boolean;
  time_filter?: string;
};

export namespace RedditDiscoveryParameters {

  export enum source_type {
    SUBREDDIT = 'subreddit',
    USER = 'user',
  }


}

