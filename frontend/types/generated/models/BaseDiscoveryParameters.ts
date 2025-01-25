/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSelectionStrategy } from './ContentSelectionStrategy';
import type { SourceType } from './SourceType';

export type BaseDiscoveryParameters = {
  /**
   * Type of content source to fetch from
   */
  source_type: SourceType;
  /**
   * Strategy for selecting which content to process from a source
   */
  selection_strategy?: ContentSelectionStrategy;
  max_items?: number;
};

