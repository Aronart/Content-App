import { ContentQueueItem } from '../types/queue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api';

export async function getQueueItems(): Promise<ContentQueueItem[]> {
  console.log('Fetching queue items from:', `${API_BASE_URL}${API_PREFIX}/queues/items`);
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/queues/items`);
  if (!response.ok) {
    console.error('Failed to fetch queue items:', response.status, response.statusText);
    throw new Error('Failed to fetch queue items');
  }
  return response.json();
}

export async function getQueueItem(id: number): Promise<ContentQueueItem> {
  console.log('Fetching queue item from:', `${API_BASE_URL}${API_PREFIX}/queues/items/${id}`);
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/queues/items/${id}`);
  if (!response.ok) {
    console.error('Failed to fetch queue item:', response.status, response.statusText);
    throw new Error('Failed to fetch queue item');
  }
  return response.json();
}
