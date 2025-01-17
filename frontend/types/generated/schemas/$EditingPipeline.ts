/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EditingPipeline = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    transformation_config: {
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
