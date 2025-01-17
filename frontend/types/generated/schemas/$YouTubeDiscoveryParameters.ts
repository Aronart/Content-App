/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $YouTubeDiscoveryParameters = {
  properties: {
    discovery_strategy: {
      type: 'DiscoveryStrategy',
    },
    max_items: {
      type: 'number',
      maximum: 100,
    },
    source_type: {
      type: 'SourceType',
      description: `Type of YouTube source (channel or playlist)`,
      isRequired: true,
    },
    channel_ids: {
      type: 'any-of',
      description: `List of YouTube channel IDs`,
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    playlist_ids: {
      type: 'any-of',
      description: `List of YouTube playlist IDs`,
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    max_videos_per_channel: {
      type: 'any-of',
      description: `Maximum number of videos to fetch per channel`,
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    min_duration: {
      type: 'any-of',
      description: `Minimum video duration in seconds`,
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    max_duration: {
      type: 'any-of',
      description: `Maximum video duration in seconds`,
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    category: {
      type: 'any-of',
      description: `YouTube video category`,
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
