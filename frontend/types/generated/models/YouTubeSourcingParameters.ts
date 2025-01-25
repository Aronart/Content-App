/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentProcessingType } from './ContentProcessingType';

export type YouTubeSourcingParameters = {
  /**
   * How to process the selected content
   */
  processing_type?: ContentProcessingType;
  output_format?: string;
  max_duration?: (number | null);
  start_time?: (number | null);
  end_time?: (number | null);
  quality?: string;
  include_audio?: boolean;
};

