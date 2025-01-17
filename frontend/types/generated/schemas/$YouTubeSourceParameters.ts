/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $YouTubeSourceParameters = {
  properties: {
    source_strategy: {
      type: 'SourceStrategy',
      description: `Strategy for extracting content`,
      isRequired: true,
    },
    strategy_params: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
    },
  },
} as const;
