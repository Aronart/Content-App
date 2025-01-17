/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DestinationAccountCreate = {
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
    schedule_settings: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
  },
} as const;
