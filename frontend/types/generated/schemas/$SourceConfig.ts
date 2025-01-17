/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SourceConfig = {
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
    discovery_parameters: {
      type: 'any-of',
      contains: [{
        type: 'YouTubeDiscoveryParameters',
      }, {
        type: 'RedditDiscoveryParameters',
      }],
      isRequired: true,
    },
    source_parameters: {
      type: 'any-of',
      contains: [{
        type: 'YouTubeSourceParameters',
      }, {
        type: 'RedditSourceParameters',
      }],
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
