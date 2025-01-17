/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ContentFlow = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    source_config_id: {
      type: 'number',
      isRequired: true,
    },
    editing_pipeline_id: {
      type: 'number',
      isRequired: true,
    },
    destination_account_id: {
      type: 'number',
      isRequired: true,
    },
    quota_settings: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
    schedule_settings: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
    is_active: {
      type: 'boolean',
    },
    require_approval: {
      type: 'boolean',
    },
    id: {
      type: 'number',
      isRequired: true,
    },
    created_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    updated_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    source_config: {
      type: 'SourceConfig',
      isRequired: true,
    },
    editing_pipeline: {
      type: 'EditingPipeline',
      isRequired: true,
    },
    destination_account: {
      type: 'DestinationAccount',
      isRequired: true,
    },
  },
} as const;
