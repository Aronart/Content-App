import { DestinationAccount, DestinationAccountCreate } from '@/types/generated';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create destination account');
  return response.json();
}

export async function updateDestinationAccount(id: number, data: Omit<DestinationAccount, 'id' | 'created_at' | 'updated_at'>): Promise<DestinationAccount> {
  const response = await fetch(`${API_BASE_URL}/api/destination-accounts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
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
