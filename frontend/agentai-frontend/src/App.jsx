import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatPage from './Chat.jsx';
import AuthPage from './Auth.jsx';
import './index.css';

export default function App() {
    return (
        <Routes>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<AuthPage />} />
        </Routes>
    );
}

