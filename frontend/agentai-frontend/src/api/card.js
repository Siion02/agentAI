import { API_BASE_URL } from './config';
import { authHeader } from './auth';

export async function createCard({ chat_id, user_id, data, completeness = 1.0 }) {
    const response = await fetch(`${API_BASE_URL}/cards/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({
            chat_id,
            user_id,
            data,
            completeness,
        }),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.detail || 'Failed to create card');
    return res;
}

export async function getAllCards() {
    const response = await fetch(`${API_BASE_URL}/cards/`, {
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch all cards');
    return data;
}

export async function getCardsByUserId(user_id) {
    const response = await fetch(`${API_BASE_URL}/cards/${user_id}`, {
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch cards by user');
    return data;
}

export async function deleteCard(card_id) {
    const response = await fetch(`${API_BASE_URL}/cards/${card_id}`, {
        method: 'DELETE',
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete card');
    return data;
}

export async function updateCard(card_id, data) {
    const response = await fetch(`${API_BASE_URL}/cards/${card_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(data),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.detail ||  'Failed to update card');
    return res;
}
