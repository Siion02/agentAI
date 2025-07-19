import React, { useState } from 'react';
import { FiSend, FiTrash2, FiEdit } from 'react-icons/fi';
import { IoChatboxEllipses } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { BsCardHeading } from "react-icons/bs";

export default function Chat() {
    const [searchText, setSearchText] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [firstName, setFirstName] = useState("Admin");
    const [lastName, setLastName] = useState("Admin");
    const [selectedModel, setSelectedModel] = useState("OpenAI");
    const [newChatTitle, setNewChatTitle] = useState("");

    const chats = [
        'Create Html Game Environment...',
        'Apply To Leave For Emergency',
        'Create Chatbot GPT...'
    ];

    const messages = [
        { from: 'agent', text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, mus aptent eget blandit quam fermentum.' },
        { from: 'user', text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit vitae justo velit congue aptent diam ac.' },
        { from: 'agent', text: 'Rhoncus elementum hac dignissim fringilla diam sem donec hendrerit eget curabitur metus.' },
        { from: 'user', text: 'Eros molestie gravida eget cum ad laoreet id nam augue conubia magnis sociis quis.' },
    ];

    return (
        <div className="flex h-screen bg-[#e8efff] text-sm font-sans">
            <aside className="w-72 bg-white rounded-xl m-3 shadow-lg flex flex-col p-4">
                <h1 className="text-xl font-semibold mb-6 text-center">AgentAI</h1>

                <button
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="mb-4 bg-blue-600 text-white p-2 px-4 rounded-lg text-center w-full hover:bg-blue-700 transition"
                >
                    New Chat
                </button>

                <div className="mb-4 relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg pr-8"
                    />
                    {searchText && (
                        <button
                            onClick={() => setSearchText('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                            title="Clear search"
                        >
                            <ImCross />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 text-sm text-gray-700">
                    {chats.map((chat, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between py-1 px-1 cursor-pointer hover:bg-gray-100 rounded"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span className="text-base"><IoChatboxEllipses /></span>
                                <span className="truncate">{chat}</span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiEdit className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Rename" />
                                <FiTrash2 className="text-red-500 hover:text-red-700 cursor-pointer" title="Delete" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                        <button className="w-full text-gray-700 hover:text-gray-800 font-medium flex items-center justify-center gap-2">
                            <BsCardHeading /> <span>Cards</span>
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="w-full text-gray-700 hover:text-gray-800 font-medium flex items-center justify-center gap-2"
                        >
                            <span>{firstName} {lastName}</span>
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col px-10 py-6">
                <div className="mb-4 text-sm text-gray-500">
                    Using model: <span className="font-semibold text-blue-600">{selectedModel}</span>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 max-w-3xl w-full mx-auto">
                    {messages.map((msg, i) => (
                        <div key={i} className={`mb-4 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                            <div
                                className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                                    msg.from === 'user'
                                        ? 'bg-blue-200 text-gray-800'
                                        : 'bg-white text-gray-800 shadow-sm'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <form className="w-full flex justify-center mt-4 relative">
                    <div className="w-[40%] relative">
                        <input
                            type="text"
                            placeholder="What's in your mind?..."
                            className="w-full border border-gray-300 p-4 pr-14 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition"
                            title="Send"
                        >
                            <FiSend size={20} />
                        </button>
                    </div>
                </form>
            </main>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Edit Profile</h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsProfileModalOpen(false);
                            }}
                        >
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Chat Modal */}
            {isNewChatModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Create New Chat</h2>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsNewChatModalOpen(false);
                            }}
                        >
                            <input
                                type="text"
                                value={newChatTitle}
                                onChange={(e) => setNewChatTitle(e.target.value)}
                                placeholder="Chat title"
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                required
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="OpenAI">OpenAI</option>
                                <option value="Ollama">Ollama</option>
                                <option value="Deepseek">Deepseek</option>
                            </select>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNewChatModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}