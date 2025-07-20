import React, { useEffect, useState, useRef } from 'react';
import { FiSend} from 'react-icons/fi';
import { ImCross } from "react-icons/im";
import { BsCardHeading } from "react-icons/bs";
import { FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getModels } from './api/masters';
import { createChat, getChatsByUserId, getChatById, sendMessage, updateChat, deleteChat } from './api/chat';
import { getCurrentUser, updateUser } from './api/user';
import { getUserFromToken } from './api/auth';

export default function Chat() {
    const user = getUserFromToken();
    const userId = user?.sub;

    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const [firstName, setFirstName] = useState(user?.name || "");
    const [lastName, setLastName] = useState("");
    const [tempFirstName, setTempFirstName] = useState("");
    const [tempLastName, setTempLastName] = useState("");
    const [newChatTitle, setNewChatTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [pendingAgentMsg, setPendingAgentMsg] = useState("");
    const messagesEndRef = useRef(null);

    const [editingChatId, setEditingChatId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, pendingAgentMsg]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, pendingAgentMsg, isThinking]);

    useEffect(() => {
        loadModels();
        loadChats();
        loadUserInfo();
    }, []);

    const loadModels = async () => {
        try {
            const fetched = await getModels();
            setModels(fetched);
            if (fetched.length > 0) setSelectedModel(fetched[0].name);
        } catch (err) {
            console.error("Failed to load models:", err);
        }
    };

    const loadChats = async () => {
        if (!userId) return;
        try {
            const data = await getChatsByUserId(userId);
            setChats(data);
            if (data.length > 0) {
                setChats(data);
            } else {
                setChats([]);
                setSelectedChatId(null);
                setMessages([]);
            }
        } catch (err) {
            console.error("Error loading chats:", err);
        }
    };

    const loadMessages = async (chatId) => {
        try {
            const chat = await getChatById(chatId);
            setMessages(chat.messages || []);
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    };

    const handleNewChat = async (e) => {
        e.preventDefault();
        try {
            const newChat = await createChat({
                title: newChatTitle,
                model: selectedModel,
                user_id: userId
            });
            setIsNewChatModalOpen(false);
            setNewChatTitle("");
            await loadChats();
            setSelectedChatId(newChat.id);
            setMessages([]);
            toast.success("New chat created!", {
                position: "top-center",
                autoClose: 1500
            });
        } catch (err) {
            console.error("Error creating chat:", err);
        }
    };

    const handleEditClick = (chat) => {
        setEditingChatId(chat.id);
        setEditedTitle(chat.title);
    };

    const handleSave = async (chatId) => {
        if (!editedTitle.trim() || editedTitle === chats.find(c => c.id === chatId)?.title) {
            setEditingChatId(null);
            return;
        }
        try {
            await updateChat(chatId, { title: editedTitle });
            setEditingChatId(null);
            await loadChats();
            toast.success("Chat title updated!", {
                position: "top-center",
                autoClose: 1500
            });
        } catch (err) {
            console.error("Error updating chat:", err.message);
            toast.error("Failed to update title", {
                position: "top-center",
                autoClose: 1500
            });
        }
    };

    const confirmDeleteChat = async () => {
        try {
            await deleteChat(chatToDelete.id);
            await loadChats();
            setIsDeleteConfirmOpen(false);
            setChatToDelete(null);
            toast.success("Chat deleted successfully", {
                position: "top-center",
                autoClose: 1500
            });
        } catch (err) {
            console.error("Error deleting chat: ", err.message);
            toast.error("Failed to delete chat", {
                position: "top-center"
            });
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChatId) return;

        const userMsg = { role: 'user', content: newMessage };
        setMessages(prev => [...prev, userMsg]);
        setNewMessage("");
        setIsThinking(true);
        setPendingAgentMsg("");

        try {
            const res = await sendMessage(selectedChatId, newMessage);
            await loadChats();
            setIsThinking(false);
            typeAgentMessage(res.response);
        } catch (err) {
            setIsThinking(false);
            console.error("Error sending message:", err);
        }
    };

    const typeAgentMessage = (fullText, delay = 20) => {
        let i = 0;
        setPendingAgentMsg("");
        const interval = setInterval(() => {
            setPendingAgentMsg(prev => {
                const next = fullText.slice(0, i + 1);
                i++;
                if (i >= fullText.length) {
                    clearInterval(interval);
                    setMessages(prev => [...prev, { role: 'agent', content: fullText }]);
                    setPendingAgentMsg("");
                }
                return next;
            });
        }, delay);
    };

    const loadUserInfo = async () => {
        try {
            const user = await getCurrentUser();
            setFirstName(user.name || "");
            setLastName(user.surname || "");
        } catch (err) {
            console.error("Error loading user info:", err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (tempFirstName === firstName && tempLastName === lastName) {
            setIsProfileModalOpen(false);
            return;
        }

        try {
            const data = {
                name: tempFirstName,
                surname: tempLastName,
            };
            await updateUser(userId, data);
            setFirstName(tempFirstName);
            setLastName(tempLastName);
            setIsProfileModalOpen(false);
            toast.success("User updated successfully", {
                position: "top-center",
                autoClose: 1500
            })
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    return (
        <div className="flex h-screen bg-[#e8efff] text-sm font-sans">
            <aside className="w-72 bg-white rounded-xl m-3 shadow-lg flex flex-col p-4">
                <h1 className="text-xl font-semibold mb-6 text-center">AgentAI</h1>
                <button onClick={() => setIsNewChatModalOpen(true)} className="mb-4 bg-blue-600 text-white p-2 px-4 rounded-lg text-center w-full hover:bg-blue-700 transition">New Chat</button>
                <div className="mb-4 relative">
                    <input type="text" placeholder="Search chats..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg pr-8" />
                    {searchText && (
                        <button onClick={() => setSearchText('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500">
                            <ImCross />
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 text-sm text-gray-700">
                    {chats.filter(chat => chat.title.toLowerCase().includes(searchText.toLowerCase())).map((chat) => {
                        const isSelected = chat.id === selectedChatId;
                        const isEditing = chat.id === editingChatId;
                        return (
                            <div key={chat.id} onClick={() => { setSelectedChatId(chat.id); loadMessages(chat.id); }} className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-indigo-100 text-indigo-700 shadow-inner' : 'hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-2 truncate w-full">
                                    <span className={`text-base transition-all duration-200 ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`}><IoChatboxEllipses /></span>
                                    {isEditing ? (
                                        <input type="text" value={editedTitle} autoFocus onChange={(e) => setEditedTitle(e.target.value)} onBlur={() => handleSave(chat.id)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(chat.id); } else if (e.key === "Escape") { setEditingChatId(null); } }} className="w-full bg-transparent border-b border-indigo-400 focus:outline-none focus:ring-0 text-sm" />
                                    ) : (
                                        <span className="truncate font-medium">{chat.title}</span>
                                    )}
                                </div>
                                {!isEditing && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => handleEditClick(chat)} className="text-gray-500 hover:text-indigo-600" title="Edit"><FaEdit /></button>
                                        <button
                                            onClick={() => {
                                                setChatToDelete(chat);
                                                setIsDeleteConfirmOpen(true);
                                            }}
                                            className="text-gray-500 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                        <button className="w-full text-gray-700 hover:text-gray-800 font-medium flex items-center justify-center gap-2">
                            <BsCardHeading /> <span>Cards</span>
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                        <button
                            onClick={() => {
                                setTempFirstName(firstName);
                                setTempLastName(lastName);
                                setIsProfileModalOpen(true)}}
                            className="w-full text-gray-700 hover:text-gray-800 font-medium flex items-center justify-center gap-2"
                        >
                            <FaUserCircle />
                            <span>{firstName} {lastName}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {selectedChatId && (
                <main className="flex-1 flex flex-col h-full px-10 py-6">
                    <div className="mb-4 text-gray-500 text-lg">
                        Using model: <span className="font-semibold text-blue-600">{selectedModel}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="px-4 py-2 max-w-3xl mx-auto">
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div
                                        className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] text-base ${
                                            msg.role === 'user'
                                                ? 'bg-blue-200 text-gray-800'
                                                : 'bg-white text-gray-800 shadow-sm'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isThinking && (
                                <div className="mb-4 text-left">
                                    <div className="inline-block px-4 py-2 rounded-2xl max-w-[80%] text-lg bg-white text-gray-500 shadow-sm animate-pulse">
                                        ...
                                    </div>
                                </div>
                            )}

                            {pendingAgentMsg && (
                                <div className="mb-4 text-left">
                                    <div className="inline-block px-4 py-2 rounded-2xl max-w-[80%] text-base bg-white text-gray-800 shadow-sm animate-fade-in">
                                        {pendingAgentMsg}
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <form className="w-full flex justify-center mt-4 relative" onSubmit={handleSendMessage}>
                        <div className="w-[40%] relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
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
            )}



            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Edit Profile</h2>
                        <form className="space-y-4" onSubmit={handleUpdateUser}>
                            <input
                                type="text"
                                value={tempFirstName}
                                onChange={(e) => setTempFirstName(e.target.value)}
                                placeholder="First name"
                                required
                                className="w-full border p-3 rounded-lg"
                            />
                            <input
                                type="text"
                                value={tempLastName}
                                onChange={(e) => setTempLastName(e.target.value)}
                                placeholder="Last name"
                                required
                                className="w-full border p-3 rounded-lg"
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="text-gray-600">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isNewChatModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-center mb-4">Create New Chat</h2>
                        <form className="space-y-4" onSubmit={handleNewChat}>
                            <input
                                type="text"
                                value={newChatTitle}
                                onChange={(e) => setNewChatTitle(e.target.value)}
                                placeholder="Chat title"
                                required
                                className="w-full border p-3 rounded-lg"
                            />
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                required
                                className="w-full border p-3 rounded-lg"
                            >
                                {models.map((model) => (
                                    <option key={model.id} value={model.name}>{model.name}</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsNewChatModalOpen(false)} className="text-gray-600">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-4 text-center">
                        <h2 className="text-lg font-semibold mb-4">Delete chat</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{chatToDelete?.title}</strong>? This cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteChat}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}