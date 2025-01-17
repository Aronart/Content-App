/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StatsService {

  /**
   * Get Overview Stats
   * Get overview statistics for the dashboard
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getOverviewStatsApiStatsOverviewGet(
    days?: (number | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/stats/overview',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Performance Stats
   * Get performance statistics
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getPerformanceStatsApiStatsPerformanceGet(
    days?: (number | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/stats/performance',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Destination Stats
   * Get statistics about destination platforms
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDestinationStatsApiStatsDestinationStatsGet(
    days?: (number | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/stats/destination-stats',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
