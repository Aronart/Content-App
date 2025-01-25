/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSelectionStrategy } from './ContentSelectionStrategy';

export type InstagramDiscoveryParameters = {
  source_type: string;
  /**
   * Strategy for selecting which content to process from a source
   */
  selection_strategy?: ContentSelectionStrategy;
  max_items?: number;
  hashtags?: Array<string>;
  users?: Array<string>;
  min_likes?: (number | null);
  media_type?: string;
};

