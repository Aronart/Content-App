/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ContentQueueItemResponse = {
  properties: {
    id: {
      type: 'number',
      isRequired: true,
    },
    source_platform: {
      type: 'string',
      isRequired: true,
    },
    source_url: {
      type: 'string',
      isRequired: true,
    },
    source_data: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
    edited_content_path: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    content_flow_id: {
      type: 'number',
      isRequired: true,
    },
    preview_path: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    status: {
      type: 'string',
      isRequired: true,
    },
    scheduled_time: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    error_log: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          properties: {
          },
        },
      }, {
        type: 'null',
      }],
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
  },
} as const;
