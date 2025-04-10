/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransformationConfig } from './TransformationConfig';

/**
 * Schema for editing pipeline in database and responses.
 */
export type EditingPipeline = {
  name: string;
  /**
   * Map of transformation name to its config. Format: {'transformations': {'trim': {'parameters': {...}}}}
   */
  transformation_config?: Record<string, Record<string, TransformationConfig>>;
  id: number;
  created_at: string;
  updated_at: string;
};

