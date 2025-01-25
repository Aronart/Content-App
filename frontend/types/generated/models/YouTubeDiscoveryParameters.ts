/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContentSelectionStrategy } from './ContentSelectionStrategy';
import type { SourceSelectionStrategy } from './SourceSelectionStrategy';

export type YouTubeDiscoveryParameters = {
  source_type: YouTubeDiscoveryParameters.source_type;
  /**
   * Strategy for selecting which content to process from a source
   */
  selection_strategy?: ContentSelectionStrategy;
  max_items?: number;
  channel_ids?: (Array<string> | null);
  playlist_ids?: (Array<string> | null);
  video_ids?: (Array<string> | null);
  source_selection_strategy?: SourceSelectionStrategy;
  content_selection_strategy?: ContentSelectionStrategy;
};

export namespace YouTubeDiscoveryParameters {

  export enum source_type {
    CHANNEL = 'channel',
    PLAYLIST = 'playlist',
    VIDEO = 'video',
  }


}

