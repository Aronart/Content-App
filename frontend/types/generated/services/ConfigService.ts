/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentFlow } from '../models/ContentFlow';
import type { ContentFlowCreate } from '../models/ContentFlowCreate';
import type { DestinationAccount } from '../models/DestinationAccount';
import type { DestinationAccountCreate } from '../models/DestinationAccountCreate';
import type { DestinationRateLimit } from '../models/DestinationRateLimit';
import type { DestinationRateLimitCreate } from '../models/DestinationRateLimitCreate';
import type { DestinationRateLimitUpdate } from '../models/DestinationRateLimitUpdate';
import type { EditingPipeline } from '../models/EditingPipeline';
import type { EditingPipelineCreate } from '../models/EditingPipelineCreate';
import type { GlobalConfig } from '../models/GlobalConfig';
import type { GlobalConfigUpdate } from '../models/GlobalConfigUpdate';
import type { SourceConfig } from '../models/SourceConfig';
import type { SourceConfigCreate } from '../models/SourceConfigCreate';
import type { SourceRateLimit } from '../models/SourceRateLimit';
import type { SourceRateLimitCreate } from '../models/SourceRateLimitCreate';
import type { SourceRateLimitUpdate } from '../models/SourceRateLimitUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ConfigService {

  /**
   * Get Global Config
   * Get the global configuration.
   *
   * Returns:
   * GlobalConfig: Global configuration settings
   *
   * Raises:
   * HTTPException: If no global config exists
   * @returns GlobalConfig Successful Response
   * @throws ApiError
   */
  public static getGlobalConfigApiConfigGlobalGet(): CancelablePromise<GlobalConfig> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/global',
    });
  }

  /**
   * Update Global Config
   * Update the global configuration.
   *
   * Args:
   * config (GlobalConfigUpdate): Updated configuration
   *
   * Returns:
   * GlobalConfig: Updated global configuration
   *
   * Raises:
   * HTTPException: If update fails
   * @param requestBody
   * @returns GlobalConfig Successful Response
   * @throws ApiError
   */
  public static updateGlobalConfigApiConfigGlobalPut(
    requestBody: GlobalConfigUpdate,
  ): CancelablePromise<GlobalConfig> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/global',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Source Configs
   * List all source configurations.
   *
   * Returns:
   * List[SourceConfig]: List of all source configurations in the system
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static listSourceConfigsApiConfigSourcesGet(): CancelablePromise<Array<SourceConfig>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/sources',
    });
  }

  /**
   * Create Source Config
   * Create a new source configuration.
   *
   * Args:
   * config (SourceConfigCreate): Source configuration to create
   *
   * Returns:
   * SourceConfig: Created source configuration
   *
   * Raises:
   * HTTPException: If creation fails
   * @param requestBody
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static createSourceConfigApiConfigSourcesPost(
    requestBody: SourceConfigCreate,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/sources',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Source Config
   * Get a specific source configuration.
   *
   * Args:
   * config_id (int): ID of the source config to retrieve
   *
   * Returns:
   * SourceConfig: Requested source configuration
   *
   * Raises:
   * HTTPException: If config not found
   * @param configId
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static getSourceConfigApiConfigSourcesConfigIdGet(
    configId: number,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/sources/{config_id}',
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
   * Update a source configuration.
   *
   * Args:
   * config_id (int): ID of the source config to update
   * config (SourceConfigCreate): Updated configuration
   *
   * Returns:
   * SourceConfig: Updated source configuration
   *
   * Raises:
   * HTTPException: If config not found
   * @param configId
   * @param requestBody
   * @returns SourceConfig Successful Response
   * @throws ApiError
   */
  public static updateSourceConfigApiConfigSourcesConfigIdPut(
    configId: number,
    requestBody: SourceConfigCreate,
  ): CancelablePromise<SourceConfig> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/sources/{config_id}',
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
   * Delete a source configuration.
   *
   * Args:
   * config_id (int): ID of the source config to delete
   *
   * Raises:
   * HTTPException: If config not found or in use
   * @param configId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteSourceConfigApiConfigSourcesConfigIdDelete(
    configId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/sources/{config_id}',
      path: {
        'config_id': configId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Source Rate Limits
   * List all source rate limit configurations.
   *
   * Returns:
   * List[SourceRateLimit]: List of all source rate limits in the system
   * @returns SourceRateLimit Successful Response
   * @throws ApiError
   */
  public static listSourceRateLimitsApiConfigSourceRateLimitsGet(): CancelablePromise<Array<SourceRateLimit>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/source-rate-limits',
    });
  }

  /**
   * Create Source Rate Limit
   * Create a new source rate limit configuration.
   *
   * Args:
   * rate_limit (SourceRateLimitCreate): Rate limit configuration to create
   *
   * Returns:
   * SourceRateLimit: Created rate limit configuration
   * @param requestBody
   * @returns SourceRateLimit Successful Response
   * @throws ApiError
   */
  public static createSourceRateLimitApiConfigSourceRateLimitsPost(
    requestBody: SourceRateLimitCreate,
  ): CancelablePromise<SourceRateLimit> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/source-rate-limits',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Source Rate Limit
   * Get a specific source rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to retrieve
   *
   * Returns:
   * SourceRateLimit: Requested rate limit configuration
   *
   * Raises:
   * HTTPException: If rate limit not found
   * @param rateLimitId
   * @returns SourceRateLimit Successful Response
   * @throws ApiError
   */
  public static getSourceRateLimitApiConfigSourceRateLimitsRateLimitIdGet(
    rateLimitId: number,
  ): CancelablePromise<SourceRateLimit> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/source-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Source Rate Limit
   * Update a source rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to update
   * rate_limit (SourceRateLimitUpdate): Updated configuration
   *
   * Returns:
   * SourceRateLimit: Updated rate limit configuration
   *
   * Raises:
   * HTTPException: If rate limit not found
   * @param rateLimitId
   * @param requestBody
   * @returns SourceRateLimit Successful Response
   * @throws ApiError
   */
  public static updateSourceRateLimitApiConfigSourceRateLimitsRateLimitIdPut(
    rateLimitId: number,
    requestBody: SourceRateLimitUpdate,
  ): CancelablePromise<SourceRateLimit> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/source-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Source Rate Limit
   * Delete a source rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to delete
   *
   * Raises:
   * HTTPException: If rate limit not found or in use
   * @param rateLimitId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteSourceRateLimitApiConfigSourceRateLimitsRateLimitIdDelete(
    rateLimitId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/source-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Editing Pipelines
   * List all editing pipeline configurations.
   *
   * Returns:
   * List[EditingPipeline]: List of all editing pipelines in the system
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static listEditingPipelinesApiConfigPipelinesGet(): CancelablePromise<Array<EditingPipeline>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/pipelines',
    });
  }

  /**
   * Create Editing Pipeline
   * Create a new editing pipeline configuration.
   *
   * Args:
   * pipeline (EditingPipelineCreate): Pipeline configuration to create
   *
   * Returns:
   * EditingPipeline: Created pipeline configuration
   * @param requestBody
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static createEditingPipelineApiConfigPipelinesPost(
    requestBody: EditingPipelineCreate,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/pipelines',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Editing Pipeline
   * Get a specific editing pipeline configuration.
   *
   * Args:
   * pipeline_id (int): ID of the pipeline to retrieve
   *
   * Returns:
   * EditingPipeline: Requested pipeline configuration
   *
   * Raises:
   * HTTPException: If pipeline not found
   * @param pipelineId
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static getEditingPipelineApiConfigPipelinesPipelineIdGet(
    pipelineId: number,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/pipelines/{pipeline_id}',
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
   * Update an editing pipeline configuration.
   *
   * Args:
   * pipeline_id (int): ID of the pipeline to update
   * pipeline (EditingPipelineCreate): Updated configuration
   *
   * Returns:
   * EditingPipeline: Updated pipeline configuration
   *
   * Raises:
   * HTTPException: If pipeline not found
   * @param pipelineId
   * @param requestBody
   * @returns EditingPipeline Successful Response
   * @throws ApiError
   */
  public static updateEditingPipelineApiConfigPipelinesPipelineIdPut(
    pipelineId: number,
    requestBody: EditingPipelineCreate,
  ): CancelablePromise<EditingPipeline> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/pipelines/{pipeline_id}',
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
   * Delete an editing pipeline configuration.
   *
   * Args:
   * pipeline_id (int): ID of the pipeline to delete
   *
   * Raises:
   * HTTPException: If pipeline not found or in use
   * @param pipelineId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteEditingPipelineApiConfigPipelinesPipelineIdDelete(
    pipelineId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/pipelines/{pipeline_id}',
      path: {
        'pipeline_id': pipelineId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Destination Rate Limits
   * List all destination rate limit configurations.
   *
   * Returns:
   * List[DestinationRateLimit]: List of all destination rate limits in the system
   * @returns DestinationRateLimit Successful Response
   * @throws ApiError
   */
  public static listDestinationRateLimitsApiConfigDestinationRateLimitsGet(): CancelablePromise<Array<DestinationRateLimit>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/destination-rate-limits',
    });
  }

  /**
   * Create Destination Rate Limit
   * Create a new destination rate limit configuration.
   *
   * Args:
   * rate_limit (DestinationRateLimitCreate): Rate limit configuration to create
   *
   * Returns:
   * DestinationRateLimit: Created rate limit configuration
   * @param requestBody
   * @returns DestinationRateLimit Successful Response
   * @throws ApiError
   */
  public static createDestinationRateLimitApiConfigDestinationRateLimitsPost(
    requestBody: DestinationRateLimitCreate,
  ): CancelablePromise<DestinationRateLimit> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/destination-rate-limits',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Destination Rate Limit
   * Get a specific destination rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to retrieve
   *
   * Returns:
   * DestinationRateLimit: Requested rate limit configuration
   *
   * Raises:
   * HTTPException: If rate limit not found
   * @param rateLimitId
   * @returns DestinationRateLimit Successful Response
   * @throws ApiError
   */
  public static getDestinationRateLimitApiConfigDestinationRateLimitsRateLimitIdGet(
    rateLimitId: number,
  ): CancelablePromise<DestinationRateLimit> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/destination-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update Destination Rate Limit
   * Update a destination rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to update
   * rate_limit (DestinationRateLimitUpdate): Updated configuration
   *
   * Returns:
   * DestinationRateLimit: Updated rate limit configuration
   *
   * Raises:
   * HTTPException: If rate limit not found
   * @param rateLimitId
   * @param requestBody
   * @returns DestinationRateLimit Successful Response
   * @throws ApiError
   */
  public static updateDestinationRateLimitApiConfigDestinationRateLimitsRateLimitIdPut(
    rateLimitId: number,
    requestBody: DestinationRateLimitUpdate,
  ): CancelablePromise<DestinationRateLimit> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/destination-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Destination Rate Limit
   * Delete a destination rate limit configuration.
   *
   * Args:
   * rate_limit_id (int): ID of the rate limit to delete
   *
   * Raises:
   * HTTPException: If rate limit not found or in use
   * @param rateLimitId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteDestinationRateLimitApiConfigDestinationRateLimitsRateLimitIdDelete(
    rateLimitId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/destination-rate-limits/{rate_limit_id}',
      path: {
        'rate_limit_id': rateLimitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * List Destination Accounts
   * List all destination account configurations.
   *
   * Returns:
   * List[DestinationAccount]: List of all destination accounts in the system
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static listDestinationAccountsApiConfigDestinationsGet(): CancelablePromise<Array<DestinationAccount>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/destinations',
    });
  }

  /**
   * Create Destination Account
   * Create a new destination account configuration.
   *
   * Args:
   * account (DestinationAccountCreate): Account configuration to create
   *
   * Returns:
   * DestinationAccount: Created account configuration
   * @param requestBody
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static createDestinationAccountApiConfigDestinationsPost(
    requestBody: DestinationAccountCreate,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/destinations',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Destination Account
   * Get a specific destination account configuration.
   *
   * Args:
   * account_id (int): ID of the account to retrieve
   *
   * Returns:
   * DestinationAccount: Requested account configuration
   *
   * Raises:
   * HTTPException: If account not found
   * @param accountId
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static getDestinationAccountApiConfigDestinationsAccountIdGet(
    accountId: number,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/destinations/{account_id}',
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
   * Update a destination account configuration.
   *
   * Args:
   * account_id (int): ID of the account to update
   * account (DestinationAccountCreate): Updated configuration
   *
   * Returns:
   * DestinationAccount: Updated account configuration
   *
   * Raises:
   * HTTPException: If account not found
   * @param accountId
   * @param requestBody
   * @returns DestinationAccount Successful Response
   * @throws ApiError
   */
  public static updateDestinationAccountApiConfigDestinationsAccountIdPut(
    accountId: number,
    requestBody: DestinationAccountCreate,
  ): CancelablePromise<DestinationAccount> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/destinations/{account_id}',
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
   * Delete a destination account configuration.
   *
   * Args:
   * account_id (int): ID of the account to delete
   *
   * Raises:
   * HTTPException: If account not found or in use
   * @param accountId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteDestinationAccountApiConfigDestinationsAccountIdDelete(
    accountId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/destinations/{account_id}',
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
   * List all content flow configurations.
   *
   * Returns:
   * List[ContentFlow]: List of all content flows in the system
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static listContentFlowsApiConfigFlowsGet(): CancelablePromise<Array<ContentFlow>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/flows',
    });
  }

  /**
   * Create Content Flow
   * Create a new content flow configuration.
   *
   * Args:
   * flow (ContentFlowCreate): Flow configuration to create
   *
   * Returns:
   * ContentFlow: Created flow configuration
   * @param requestBody
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static createContentFlowApiConfigFlowsPost(
    requestBody: ContentFlowCreate,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/config/flows',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Content Flow
   * Get a specific content flow configuration.
   *
   * Args:
   * flow_id (int): ID of the flow to retrieve
   *
   * Returns:
   * ContentFlow: Requested flow configuration
   *
   * Raises:
   * HTTPException: If flow not found
   * @param flowId
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static getContentFlowApiConfigFlowsFlowIdGet(
    flowId: number,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/config/flows/{flow_id}',
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
   * Update a content flow configuration.
   *
   * Args:
   * flow_id (int): ID of the flow to update
   * flow (ContentFlowCreate): Updated configuration
   *
   * Returns:
   * ContentFlow: Updated flow configuration
   *
   * Raises:
   * HTTPException: If flow not found
   * @param flowId
   * @param requestBody
   * @returns ContentFlow Successful Response
   * @throws ApiError
   */
  public static updateContentFlowApiConfigFlowsFlowIdPut(
    flowId: number,
    requestBody: ContentFlowCreate,
  ): CancelablePromise<ContentFlow> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/config/flows/{flow_id}',
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
   * Delete a content flow configuration.
   *
   * Args:
   * flow_id (int): ID of the flow to delete
   *
   * Raises:
   * HTTPException: If flow not found
   * @param flowId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteContentFlowApiConfigFlowsFlowIdDelete(
    flowId: number,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/config/flows/{flow_id}',
      path: {
        'flow_id': flowId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
