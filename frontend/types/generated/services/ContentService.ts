/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentQueue } from '../models/ContentQueue';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentService {

  /**
   * Get Pending Content
   * Get pending content that needs approval.
   *
   * Args:
   * skip (int, optional): Number of records to skip. Defaults to 0.
   * limit (int, optional): Maximum number of records to return. Defaults to 10.
   *
   * Returns:
   * List[ContentQueue]: List of pending content items
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
   * Approve content for posting.
   *
   * Args:
   * content_id (int): ID of the content to approve
   *
   * Returns:
   * dict: Success message
   *
   * Raises:
   * HTTPException: If content not found or approval fails
   * @param contentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static approveContentApiContentContentIdApprovePost(
    contentId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/content/{content_id}/approve',
      path: {
        'content_id': contentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Reject Content
   * Reject content and provide reason.
   *
   * Args:
   * content_id (int): ID of the content to reject
   * reason (str): Reason for rejection
   *
   * Returns:
   * dict: Success message
   *
   * Raises:
   * HTTPException: If content not found
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

  /**
   * Trigger Content Sourcing
   * Trigger immediate content sourcing and editing for a flow.
   *
   * This endpoint triggers the same task that runs periodically according to the flow's schedule,
   * but executes it immediately. This is useful for testing or manual content sourcing.
   *
   * Args:
   * flow_id: ID of the content flow to source content for
   *
   * Returns:
   * dict: Message indicating the task was triggered
   *
   * Raises:
   * HTTPException: If flow not found or inactive
   * @param flowId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static triggerContentSourcingApiContentFlowsFlowIdSourcePost(
    flowId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/content/flows/{flow_id}/source',
      path: {
        'flow_id': flowId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
