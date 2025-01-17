/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentQueueItemResponse } from '../models/ContentQueueItemResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QueuesService {

  /**
   * Get Queue Items
   * Get all queue items with optional filtering
   * @param platform
   * @param status
   * @param skip
   * @param limit
   * @returns ContentQueueItemResponse Successful Response
   * @throws ApiError
   */
  public static getQueueItemsApiQueuesItemsGet(
    platform?: (string | null),
    status?: (string | null),
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<ContentQueueItemResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/queues/items',
      query: {
        'platform': platform,
        'status': status,
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Queue Item
   * Get a specific queue item by ID
   * @param itemId
   * @returns ContentQueueItemResponse Successful Response
   * @throws ApiError
   */
  public static getQueueItemApiQueuesItemsItemIdGet(
    itemId: number,
  ): CancelablePromise<ContentQueueItemResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/queues/items/{item_id}',
      path: {
        'item_id': itemId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Retry Failed Content
   * Retry processing failed content
   * @param queueId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static retryFailedContentApiQueuesQueueIdRetryPost(
    queueId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/queues/{queue_id}/retry',
      path: {
        'queue_id': queueId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
