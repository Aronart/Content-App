/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SourceConfigCreate = {
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
