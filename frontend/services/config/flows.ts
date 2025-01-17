import { ContentFlow, ContentFlowCreate } from '@/types/generated';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getContentFlows(): Promise<ContentFlow[]> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows`);
  if (!response.ok) throw new Error('Failed to fetch content flows');
  return response.json();
}

export async function getContentFlow(id: number): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows/${id}`);
  if (!response.ok) throw new Error('Failed to fetch content flow');
  return response.json();
}

export async function createContentFlow(data: Omit<ContentFlow, 'id' | 'created_at' | 'updated_at'>): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create content flow');
  return response.json();
}

export async function updateContentFlow(id: number, data: Omit<ContentFlow, 'id' | 'created_at' | 'updated_at'>): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update content flow');
  return response.json();
}

export async function deleteContentFlow(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete content flow');
}
