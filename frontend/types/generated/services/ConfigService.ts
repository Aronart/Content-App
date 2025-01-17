/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentFlow } from '../models/ContentFlow';
import type { ContentFlowCreate } from '../models/ContentFlowCreate';
import type { DestinationAccount } from '../models/DestinationAccount';
import type { DestinationAccountCreate } from '../models/DestinationAccountCreate';
import type { EditingPipeline } from '../models/EditingPipeline';
import type { EditingPipelineCreate } from '../models/EditingPipelineCreate';
import type { SourceConfig } from '../models/SourceConfig';
import type { SourceConfigCreate } from '../models/SourceConfigCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConfigService {

  /**
   * List Source Configs
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static listSourceConfigsApiSourceConfigsGet(): CancelablePromise<Array<SourceConfig>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/source-configs',
    });
  }

  /**
   * Create Source Config
   * @param requestBody
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static createSourceConfigApiSourceConfigsPost(
    requestBody: SourceConfigCreate,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/source-configs',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Source Config
   * @param configId
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static getSourceConfigApiSourceConfigsConfigIdGet(
    configId: number,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/source-configs/{config_id}',
      path: {
        'config_id': configId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Source Config
   * @param configId
   * @param requestBody
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static updateSourceConfigApiSourceConfigsConfigIdPut(
    configId: number,
    requestBody: SourceConfigCreate,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/source-configs/{config_id}',
      path: {
        'config_id': configId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Source Config
   * @param configId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteSourceConfigApiSourceConfigsConfigIdDelete(
    configId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/source-configs/{config_id}',
      path: {
        'config_id': configId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Editing Pipelines
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static listEditingPipelinesApiEditingPipelinesGet(): CancelablePromise<Array<EditingPipeline>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/editing-pipelines',
    });
  }

  /**
   * Create Editing Pipeline
   * @param requestBody
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static createEditingPipelineApiEditingPipelinesPost(
    requestBody: EditingPipelineCreate,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/editing-pipelines',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Editing Pipeline
   * @param pipelineId
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static getEditingPipelineApiEditingPipelinesPipelineIdGet(
    pipelineId: number,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/editing-pipelines/{pipeline_id}',
      path: {
        'pipeline_id': pipelineId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Editing Pipeline
   * @param pipelineId
   * @param requestBody
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static updateEditingPipelineApiEditingPipelinesPipelineIdPut(
    pipelineId: number,
    requestBody: EditingPipelineCreate,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/editing-pipelines/{pipeline_id}',
      path: {
        'pipeline_id': pipelineId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Editing Pipeline
   * @param pipelineId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteEditingPipelineApiEditingPipelinesPipelineIdDelete(
    pipelineId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/editing-pipelines/{pipeline_id}',
      path: {
        'pipeline_id': pipelineId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Destination Accounts
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static listDestinationAccountsApiDestinationAccountsGet(): CancelablePromise<Array<DestinationAccount>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/destination-accounts',
    });
  }

  /**
   * Create Destination Account
   * @param requestBody
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static createDestinationAccountApiDestinationAccountsPost(
    requestBody: DestinationAccountCreate,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/destination-accounts',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Destination Account
   * @param accountId
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static getDestinationAccountApiDestinationAccountsAccountIdGet(
    accountId: number,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/destination-accounts/{account_id}',
      path: {
        'account_id': accountId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Destination Account
   * @param accountId
   * @param requestBody
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static updateDestinationAccountApiDestinationAccountsAccountIdPut(
    accountId: number,
    requestBody: DestinationAccountCreate,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/destination-accounts/{account_id}',
      path: {
        'account_id': accountId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Destination Account
   * @param accountId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteDestinationAccountApiDestinationAccountsAccountIdDelete(
    accountId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/destination-accounts/{account_id}',
      path: {
        'account_id': accountId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Content Flows
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static listContentFlowsApiContentFlowsGet(): CancelablePromise<Array<ContentFlow>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/content-flows',
    });
  }

  /**
   * Create Content Flow
   * @param requestBody
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static createContentFlowApiContentFlowsPost(
    requestBody: ContentFlowCreate,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/content-flows',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Content Flow
   * @param flowId
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static getContentFlowApiContentFlowsFlowIdGet(
    flowId: number,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/content-flows/{flow_id}',
      path: {
        'flow_id': flowId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Content Flow
   * @param flowId
   * @param requestBody
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static updateContentFlowApiContentFlowsFlowIdPut(
    flowId: number,
    requestBody: ContentFlowCreate,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/content-flows/{flow_id}',
      path: {
        'flow_id': flowId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Content Flow
   * @param flowId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteContentFlowApiContentFlowsFlowIdDelete(
    flowId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/content-flows/{flow_id}',
      path: {
        'flow_id': flowId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
