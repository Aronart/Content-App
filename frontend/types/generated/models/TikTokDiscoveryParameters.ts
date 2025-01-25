/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSelectionStrategy } from './ContentSelectionStrategy';

export type TikTokDiscoveryParameters = {
  source_type: TikTokDiscoveryParameters.source_type;
  /**
   * Strategy for selecting which content to process from a source
   */
  selection_strategy?: ContentSelectionStrategy;
  max_items?: number;
  tags?: Array<string>;
  users?: Array<string>;
  min_likes?: (number | null);
  min_duration?: (number | null);
  max_duration?: (number | null);
};

export namespace TikTokDiscoveryParameters {

  export enum source_type {
    TAG = 'tag',
    USER = 'user',
  }


}

