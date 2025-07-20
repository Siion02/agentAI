import { API_BASE_URL } from './config';

export async function getModels() {
    const response = await fetch(`${API_BASE_URL}/masters/models`);
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
}

export async function getRoles() {
    const response = await fetch(`${API_BASE_URL}/masters/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    return await response.json();
}
