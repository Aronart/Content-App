import { 
  SourceConfig, 
  SourceConfigCreate,
  EditingPipeline, 
  EditingPipelineCreate,
  DestinationAccount, 
  DestinationAccountCreate,
  ContentFlow, 
  ContentFlowCreate
} from '@/types/generated';
import { API_BASE } from '@/config';

// Source Configs
export async function getSourceConfigs(): Promise<SourceConfig[]> {
  const response = await fetch(`${API_BASE}/config/sources`);
  if (!response.ok) throw new Error('Failed to fetch source configs');
  return response.json();
}

export async function getSourceConfig(id: number): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE}/config/sources/${id}`);
  if (!response.ok) throw new Error('Failed to fetch source config');
  return response.json();
}

export async function createSourceConfig(data: SourceConfigCreate): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE}/config/sources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create source config');
  }
  return response.json();
}

export async function updateSourceConfig(id: number, data: SourceConfigCreate): Promise<SourceConfig> {
  const response = await fetch(`${API_BASE}/config/sources/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update source config');
  }
  return response.json();
}

export async function deleteSourceConfig(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/config/sources/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete source config');
  }
}

// Editing Pipelines
export async function getEditingPipelines(): Promise<EditingPipeline[]> {
  const response = await fetch(`${API_BASE}/config/pipelines`);
  if (!response.ok) throw new Error('Failed to fetch editing pipelines');
  return response.json();
}

export async function getEditingPipeline(id: number): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE}/config/pipelines/${id}`);
  if (!response.ok) throw new Error('Failed to fetch editing pipeline');
  return response.json();
}

export async function createEditingPipeline(data: EditingPipelineCreate): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE}/config/pipelines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create editing pipeline');
  }
  return response.json();
}

export async function updateEditingPipeline(id: number, data: EditingPipelineCreate): Promise<EditingPipeline> {
  const response = await fetch(`${API_BASE}/config/pipelines/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update editing pipeline');
  }
  return response.json();
}

export async function deleteEditingPipeline(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/config/pipelines/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete editing pipeline');
  }
}

// Destination Accounts
export async function getDestinationAccounts(): Promise<DestinationAccount[]> {
  const response = await fetch(`${API_BASE}/config/destinations`);
  if (!response.ok) throw new Error('Failed to fetch destination accounts');
  return response.json();
}

export async function getDestinationAccount(id: number): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE}/config/destinations/${id}`);
  if (!response.ok) throw new Error('Failed to fetch destination account');
  return response.json();
}

export async function createDestinationAccount(data: DestinationAccountCreate): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE}/config/destinations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create destination account');
  }
  return response.json();
}

export async function updateDestinationAccount(id: number, data: DestinationAccountCreate): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE}/config/destinations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update destination account');
  }
  return response.json();
}

export async function deleteDestinationAccount(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/config/destinations/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete destination account');
  }
}

// Content Flows
export async function getContentFlows(): Promise<ContentFlow[]> {
  const response = await fetch(`${API_BASE}/config/flows`);
  if (!response.ok) throw new Error('Failed to fetch content flows');
  return response.json();
}

export async function getContentFlow(id: number): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE}/config/flows/${id}`);
  if (!response.ok) throw new Error('Failed to fetch content flow');
  return response.json();
}

export async function createContentFlow(data: ContentFlowCreate): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE}/config/flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create content flow');
  return response.json();
}

export async function updateContentFlow(id: number, data: ContentFlowCreate): Promise<ContentFlow> {
  const response = await fetch(`${API_BASE}/config/flows/${id}`, {
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
  const response = await fetch(`${API_BASE}/config/flows/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete content flow');
}
