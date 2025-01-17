/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentFlow } from '../models/ContentFlow';
import type { ContentQueue } from '../models/ContentQueue';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentService {

  /**
   * Get Content Flows
   * Get all content flows
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static getContentFlowsApiContentFlowsGet(): CancelablePromise<Array<ContentFlow>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/content/flows',
    });
  }

  /**
   * Get Pending Content
   * Get pending content that needs approval
   * @param skip
   * @param limit
   * @returns ContentQueue Successful Response
   * @throws ApiError
   */
  public static getPendingContentApiContentPendingGet(
    skip?: number,
    limit: number = 10,
  ): CancelablePromise<Array<ContentQueue>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/content/pending',
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Approve Content
   * Approve content for posting
   * @param contentId
   * @param flowId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static approveContentApiContentContentIdApprovePost(
    contentId: number,
    flowId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/content/{content_id}/approve',
      path: {
        'content_id': contentId,
      },
      query: {
        'flow_id': flowId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Reject Content
   * Reject content and provide reason
   * @param contentId
   * @param reason
   * @returns any Successful Response
   * @throws ApiError
   */
  public static rejectContentApiContentContentIdRejectPost(
    contentId: number,
    reason: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/content/{content_id}/reject',
      path: {
        'content_id': contentId,
      },
      query: {
        'reason': reason,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
