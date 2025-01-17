import { SourceConfig, SourceConfigCreate } from '@/types/generated';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getSourceConfigs(): Promise<SourceConfig[]> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs`);
  if (!response.ok) throw new Error('Failed to fetch source configs');
  return response.json();
}

export async function createSourceConfig(config: Omit<SourceConfig, 'id'>): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to create source config');
  return response.json();
}

export async function updateSourceConfig(id: number, config: Partial<SourceConfig>): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to update source config');
  return response.json();
}

export async function deleteSourceConfig(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete source config');
}
