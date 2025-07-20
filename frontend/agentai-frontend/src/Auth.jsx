import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import { login, register } from './api/auth';
import { getRoles } from './api/masters';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLogin) {
            getRoles().then(setRoles).catch(() => setRoles([]));
        }
    }, [isLogin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password || (!isLogin && (!form.first_name || !form.last_name || !form.role))) {
            toast.error('All fields are required', {
                position: 'top-center',
                autoClose: 3000
            });
            return;
        }
        try {
            if (isLogin) {
                const { access_token } = await login(form);
                localStorage.setItem('token', access_token);
                toast.success('Login successful! Welcome', {
                    position: 'top-center',
                    autoClose: 2000
                });

                setTimeout(() => {
                    navigate('/chat');
                }, 2000);

                //window.location.href = '/chat';
            } else {
                await register(form);
                toast.success('Registration successful! Redirecting to login...', {
                    position: 'top-center',
                    autoClose: 3000
                });
                setTimeout(() => {
                    setIsLogin(true);
                }, 3000);
            }
        } catch (err) {
            const msg = err.message || 'Unknown error';
            toast.error(msg.includes('401') || msg.toLowerCase().includes('unauthorized')
                ? 'Wrong email or password'
                : msg, {
                position: 'top-center',
                autoClose: 3000
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#e8efff] font-sans px-4">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
                    {isLogin ? 'Login to AgentAI' : 'Create an Account'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="flex gap-4">
                            <input
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                type="text"
                                placeholder="First name"
                                className="w-1/2 border p-3 rounded-lg"
                            />
                            <input
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Last name"
                                className="w-1/2 border p-3 rounded-lg"
                            />
                        </div>
                    )}
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded-lg"
                    />
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded-lg"
                    />
                    {!isLogin && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium mb-1">
                                Role
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                            >
                                <option value="" disabled>Select your role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                    {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}
