import { API_BASE_URL } from './config';
import { authHeader } from './auth';

export async function getUsers() {
    const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
            ...authHeader()
        }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
}

export async function updateUser(userId, data) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Update failed');
    return result;
}

export async function deleteUser(userId) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            ...authHeader()
        }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Delete failed');
    return result;
}

export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
            ...authHeader()
        }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to load user');
    return data;
}