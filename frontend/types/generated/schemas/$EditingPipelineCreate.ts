/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EditingPipelineCreate = {
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
  },
} as const;
