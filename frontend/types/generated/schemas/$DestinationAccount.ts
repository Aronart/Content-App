/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DestinationAccount = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    platform: {
      type: 'Platform',
      isRequired: true,
    },
    credentials: {
      type: 'dictionary',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    parameters: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
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
  },
} as const;
