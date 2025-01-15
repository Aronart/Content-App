import { Platform } from '@/types/platform';
import { SourceConfig, EditingPipeline, DestinationAccount, ContentFlow } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Source Configs
export async function getSourceConfigs(): Promise<SourceConfig[]> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs`);
  if (!response.ok) throw new Error('Failed to fetch source configs');
  return response.json();
}

export async function getSourceConfig(id: number): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch source config');
  return response.json();
}

export async function createSourceConfig(data: Partial<SourceConfig>): Promise<SourceConfig> {
  // Ensure all required fields are present with correct types
  const payload = {
    name: data.name,
    platform: (data.platform || '').toLowerCase(),
    credentials: data.credentials || {},
    parameters: data.parameters || {},
    schedule_settings: data.schedule_settings || {},
  };

  const response = await fetch(`${API_BASE_URL}/api/source-configs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create source config');
  }
  return response.json();
}

export async function updateSourceConfig(id: number, data: Partial<SourceConfig>): Promise<SourceConfig> {
  // Ensure all required fields are present with correct types
  const payload = {
    name: data.name,
    platform: (data.platform || '').toLowerCase(),
    credentials: data.credentials || {},
    parameters: data.parameters || {},
    schedule_settings: data.schedule_settings || {},
  };

  const response = await fetch(`${API_BASE_URL}/api/source-configs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update source config');
  }
  return response.json();
}

export async function deleteSourceConfig(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/source-configs/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Failed to delete source config');
  }
}

// Editing Pipelines
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create editing pipeline');
  return response.json();
}

export async function updateEditingPipeline(id: number, data: Omit<EditingPipeline, 'id' | 'created_at' | 'updated_at'>): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE_URL}/api/editing-pipelines/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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

// Destination Accounts
export async function getDestinationAccounts(): Promise<DestinationAccount[]> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts`);
  if (!response.ok) throw new Error('Failed to fetch destination accounts');
  return response.json();
}

export async function getDestinationAccount(id: number): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts/${id}`);
  if (!response.ok) throw new Error('Failed to fetch destination account');
  return response.json();
}

export async function createDestinationAccount(data: Omit<DestinationAccount, 'id' | 'created_at' | 'updated_at'>): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create destination account');
  return response.json();
}

export async function updateDestinationAccount(id: number, data: Omit<DestinationAccount, 'id' | 'created_at' | 'updated_at'>): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update destination account');
  return response.json();
}

export async function deleteDestinationAccount(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete destination account');
}

// Content Flows
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create content flow');
  return response.json();
}

export async function updateContentFlow(id: number, data: Omit<ContentFlow, 'id' | 'created_at' | 'updated_at'>): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE_URL}/api/content-flows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
