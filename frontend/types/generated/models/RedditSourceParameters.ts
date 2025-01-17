/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SourceStrategy } from './SourceStrategy';

export type RedditSourceParameters = {
  /**
   * Strategy for extracting content
   */
  source_strategy: SourceStrategy;
  /**
   * Parameters for the source strategy
   */
  strategy_params?: Record<string, any>;
};

