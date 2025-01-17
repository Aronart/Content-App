/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ContentQueue = {
  properties: {
    source_platform: {
      type: 'Platform',
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
    },
    status: {
      type: 'ContentStatus',
    },
    scheduled_time: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
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
    content_flow: {
      type: 'ContentFlow',
      isRequired: true,
    },
  },
} as const;
