import { ContentQueueItemResponse } from '@/types/generated';
import { API_BASE } from '@/config';

export async function getQueueItems(): Promise<ContentQueueItemResponse[]> {
  const response = await fetch(`${API_BASE}/queues/items`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch queue items');
  }
  
  return response.json();
}

export async function getQueueItem(id: number): Promise<ContentQueueItemResponse> {
  const response = await fetch(`${API_BASE}/queues/items/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch queue item');
  }
  
  return response.json();
}

export async function approveQueueItem(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/content/${id}/approve`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to approve content');
  }
}

export async function rejectQueueItem(id: number, reason: string): Promise<void> {
  const response = await fetch(`${API_BASE}/content/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reject content');
  }
}
