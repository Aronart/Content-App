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
   * Get overview statistics for the dashboard.
   *
   * Args:
   * days (int, optional): Number of days to look back. Defaults to 7.
   * Must be between 1 and 30 days.
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
   * Get performance statistics for content processing.
   *
   * Args:
   * days (int, optional): Number of days to look back. Defaults to 30.
   * Must be between 1 and 90 days.
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
   * Get statistics about destination platforms.
   *
   * Args:
   * days (int, optional): Number of days to look back. Defaults to 30.
   * Must be between 1 and 90 days.
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDestinationStatsApiStatsDestinationGet(
    days?: (number | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/stats/destination',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
