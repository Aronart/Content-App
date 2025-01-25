import { API_BASE } from '@/config';

interface GlobalConfig {
  id: number;
  require_approval: boolean;
  enable_automatic_posting: boolean;
  created_at: string;
  updated_at: string;
}

interface GlobalConfigUpdate {
  require_approval?: boolean;
  enable_automatic_posting?: boolean;
}

export async function getGlobalConfig(): Promise<GlobalConfig> {
  const response = await fetch(`${API_BASE}/config/global`);
  if (!response.ok) throw new Error('Failed to fetch global config');
  return response.json();
}

export async function updateGlobalConfig(data: GlobalConfigUpdate): Promise<GlobalConfig> {
  const response = await fetch(`${API_BASE}/config/global`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update global config');
  return response.json();
}
