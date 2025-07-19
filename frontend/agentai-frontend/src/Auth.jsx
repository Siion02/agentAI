import React, { useState } from 'react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#e8efff] font-sans px-4">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
                    {isLogin ? 'Login to AgentAI' : 'Create an Account'}
                </h2>

                <form className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    required
                                    className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    required
                                    className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {!isLogin && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                defaultValue=""
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="student">Student</option>
                                <option value="professor">Professor</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
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
        </div>
    );
}
