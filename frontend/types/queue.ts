export enum Platform {
  YOUTUBE = "youtube",
  REDDIT = "reddit",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
}

export enum ContentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface ContentQueueItem {
  id: number;
  source_platform: Platform;
  source_url: string;
  source_data: any;
  edited_content_path?: string;
  content_flow_id: number;
  preview_path?: string;
  status: ContentStatus;
  scheduled_time?: string;
  error_log?: any;
  created_at: string;
  updated_at: string;
}
