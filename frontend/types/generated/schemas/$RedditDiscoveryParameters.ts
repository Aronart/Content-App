/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RedditDiscoveryParameters = {
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
      description: `Type of Reddit source (subreddit or user)`,
      isRequired: true,
    },
    subreddits: {
      type: 'any-of',
      description: `List of subreddit names`,
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    users: {
      type: 'any-of',
      description: `List of Reddit usernames`,
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    min_score: {
      type: 'any-of',
      description: `Minimum score (upvotes) for posts`,
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    include_nsfw: {
      type: 'boolean',
      description: `Whether to include NSFW content`,
    },
    time_filter: {
      type: 'string',
      description: `Time filter for Reddit content`,
    },
  },
} as const;
