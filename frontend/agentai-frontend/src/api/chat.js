import { API_BASE_URL } from './config';
import { authHeader } from './auth';

export async function createChat({ title, model, user_id }) {
    const response = await fetch(`${API_BASE_URL}/chats/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify({
            user_id,
            title,
            messages: [],
            model
        }),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.detail || 'Failed to create chat');
    return res;
}

export async function getChats() {
    const response = await fetch(`${API_BASE_URL}/chats/`, {
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch all chats');
    return data;
}

export async function getChatsByUserId(userId) {
    const response = await fetch(`${API_BASE_URL}/chats/u/${userId}`, {
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch chats');
    return data;
}

export async function getChatById(chatId) {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch chat');
    return data;
}

export async function updateChat(chatId, data) {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify(data),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.detail || 'Failed to update chat');
    return res;
}

export async function deleteChat(chatId) {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "DELETE",
        headers: {
            ...authHeader()
        }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete chat');
    return data;
}

export async function sendMessage(chatId, message) {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to send message');
    return data;
}
