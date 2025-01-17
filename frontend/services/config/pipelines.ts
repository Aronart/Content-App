import { EditingPipeline, EditingPipelineCreate } from '@/types/generated';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getEditingPipelines(): Promise<EditingPipeline[]> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines`);
  if (!response.ok) throw new Error('Failed to fetch editing pipelines');
  return response.json();
}

export async function getEditingPipeline(id: number): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines/${id}`);
  if (!response.ok) throw new Error('Failed to fetch editing pipeline');
  return response.json();
}

export async function createEditingPipeline(data: Omit<EditingPipeline, 'id' | 'created_at' | 'updated_at'>): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create editing pipeline');
  return response.json();
}

export async function updateEditingPipeline(id: number, data: Omit<EditingPipeline, 'id' | 'created_at' | 'updated_at'>): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update editing pipeline');
  return response.json();
}

export async function deleteEditingPipeline(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete editing pipeline');
}
