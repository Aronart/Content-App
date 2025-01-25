/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Schema for content flow post schedule.
 */
export type PostSchedule = {
  /**
   * List of days when content can be posted
   */
  days: Array<string>;
  /**
   * List of times when content can be posted (24h format)
   */
  times: Array<string>;
  /**
   * Timezone for the schedule
   */
  timezone?: string;
};

