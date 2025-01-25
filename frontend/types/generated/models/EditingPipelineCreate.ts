/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TransformationConfig } from './TransformationConfig';

/**
 * Schema for creating a new editing pipeline.
 */
export type EditingPipelineCreate = {
  name: string;
  /**
   * Map of transformation name to its config. Format: {'transformations': {'trim': {'parameters': {...}}}}
   */
  transformation_config?: Record<string, Record<string, TransformationConfig>>;
};

