"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Upload, Plus, FileVideo, FileImage, FileText, Mic } from "lucide-react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [metrics, setMetrics] = useState("");
    const [type, setType] = useState("image"); // 'voice', 'image', 'video', 'pdf'
    const [color, setColor] = useState("from-blue-500/20 to-indigo-500/20");
    const [borderColor, setBorderColor] = useState("border-blue-500/30");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                setLoginError("Invalid password");
            }
        } catch (error) {
            setLoginError("An error occurred");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            
            // Convert metrics from comma separated string to array
            const metricsArray = metrics.split(",").map(m => m.trim()).filter(m => m);
            formData.append("metrics", JSON.stringify(metricsArray));
            
            formData.append("type", type);
            formData.append("color", color);
            formData.append("borderColor", borderColor);
            
            if (file) {
                formData.append("file", file);
            }

            const res = await fetch("/api/portfolio", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setMessage("Portfolio item added successfully!");
                setTitle("");
                setDescription("");
                setMetrics("");
                setFile(null);
            } else {
                const data = await res.json();
                setMessage(data.error || "Failed to add item");
            }
        } catch (error) {
            setMessage("An error occurred during submission");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center text-blue-600 dark:text-blue-400">
                        <Lock className="w-12 h-12" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
                        Admin Login
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-white/10 transition-colors duration-300">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm">{loginError}</p>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-24 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-5">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Portfolio Admin Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Upload new projects, images, videos, or PDFs.</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 shadow rounded-xl p-8 border border-gray-200 dark:border-white/10 transition-colors duration-300">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white transition-colors duration-300">
                        <Plus className="mr-2" /> Add New Portfolio Item
                    </h2>

                    {message && (
                        <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Metrics (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 34% Conversion, 24/7 Availability"
                                    value={metrics}
                                    onChange={e => setMetrics(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Media Type</label>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                >
                                    <option value="voice">Voice Agent (Demo Link)</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF Document</option>
                                </select>
                            </div>

                            {type !== 'voice' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Upload File</label>
                                    <input
                                        type="file"
                                        required={type !== 'voice'}
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Card Gradient (Tailwind classes)</label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Card Border Color (Tailwind classes)</label>
                                <input
                                    type="text"
                                    value={borderColor}
                                    onChange={e => setBorderColor(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white transition-colors duration-300"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-300"
                            >
                                {isSubmitting ? "Uploading..." : "Save Portfolio Item"}
                                {!isSubmitting && <Upload className="ml-2 w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
