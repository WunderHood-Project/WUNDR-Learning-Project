'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Send, CheckCircle, XCircle } from 'lucide-react';
import { makeApiRequest, determineEnv } from '../../../utils/api';
import { formatDate } from '@/components/Programs/ProgramDetails/ProgramDetailsMessageBoard';
import type { ProgramThread } from '@/types/program';

const WONDERHOOD_URL = determineEnv();

export default function PrivateAdminMessages() {
    const [threads, setThreads] = useState<ProgramThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<Record<string, string>>({});
    const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
    const [replyError, setReplyError] = useState<Record<string, string | null>>({});
    const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadThreads();
    }, []);

    async function loadThreads() {
        try {
            setLoading(true);
            setError(null);
            const data = await makeApiRequest<{ data: ProgramThread[] }>(
                `${WONDERHOOD_URL}/admin/private-threads`,
                { method: 'GET' }
            );
            setThreads(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    }

    async function handleReply(thread: ProgramThread) {
        const content = replyContent[thread.id]?.trim();
        if (!content) return;

        setReplyLoading(prev => ({ ...prev, [thread.id]: true }));
        setReplyError(prev => ({ ...prev, [thread.id]: null }));

        try {
            await makeApiRequest(
                `${WONDERHOOD_URL}/program/${thread.programId}/threads/${thread.id}/messages`,
                { method: 'POST', body: { content } }
            );
            setReplyContent(prev => ({ ...prev, [thread.id]: '' }));
            await loadThreads();
        } catch (err) {
            setReplyError(prev => ({
                ...prev,
                [thread.id]: err instanceof Error ? err.message : 'Failed to send reply',
            }));
        } finally {
            setReplyLoading(prev => ({ ...prev, [thread.id]: false }));
        }
    }

    async function handleStatusToggle(thread: ProgramThread) {
        const nextStatus = thread.status === 'open' ? 'closed' : 'open';

        setStatusLoading(prev => ({ ...prev, [thread.id]: true }));
        try {
            await makeApiRequest(
                `${WONDERHOOD_URL}/program/${thread.programId}/threads/${thread.id}/status`,
                { method: 'PATCH', body: { status: nextStatus } }
            );
            await loadThreads();
        } catch (err) {
            console.error('Failed to update thread status:', err);
        } finally {
            setStatusLoading(prev => ({ ...prev, [thread.id]: false }));
        }
    }

    return (
        <section className="mt-8">
            <h2 className="text-lg font-semibold text-wondergreen flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4" />
                Direct Messages
            </h2>

            {loading && (
                <p className="text-sm text-gray-500 text-center py-6">Loading messages…</p>
            )}

            {error && (
                <p className="text-sm text-red-600 text-center py-6">{error}</p>
            )}

            {!loading && !error && threads.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">No direct messages yet.</p>
            )}

            {!loading && !error && threads.length > 0 && (
                <div className="space-y-4">
                    {threads.map(thread => {
                        const isExpanded = expandedThreadId === thread.id;
                        const isClosed = thread.status === 'closed';

                        return (
                            <div
                                key={thread.id}
                                className="bg-white/50 rounded-2xl border border-white/60 backdrop-blur-sm overflow-hidden"
                            >
                                <button
                                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                                    onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className='font-semibold'>Program: {thread?.program?.name}</p>
                                        <p className="font-semibold text-gray-800 truncate">Thread: {thread.subject}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${isClosed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {isClosed ? 'Closed' : 'Open'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatDate(thread.createdAt)} · {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {isExpanded
                                        ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                        : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                    }
                                </button>

                                {isExpanded && (
                                    <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                                        {thread.messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className="bg-white/70 rounded-xl border border-gray-100 px-4 py-3"
                                            >
                                                <p className="text-sm text-gray-700">{msg.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                                            </div>
                                        ))}

                                        {!isClosed && (
                                            <div className="pt-2">
                                                {replyError[thread.id] && (
                                                    <p className="mb-2 text-xs text-red-600">{replyError[thread.id]}</p>
                                                )}
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                                                        placeholder="Reply to this thread…"
                                                        value={replyContent[thread.id] ?? ''}
                                                        onChange={e =>
                                                            setReplyContent(prev => ({ ...prev, [thread.id]: e.target.value }))
                                                        }
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleReply(thread);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleReply(thread)}
                                                        disabled={replyLoading[thread.id]}
                                                        className="px-3 py-2 bg-wondergreen text-white rounded-lg hover:bg-wondergreen/80 transition disabled:opacity-50"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleStatusToggle(thread)}
                                                disabled={statusLoading[thread.id]}
                                                className={`flex items-center gap-1.5 text-xs font-medium transition disabled:opacity-50 ${isClosed
                                                    ? 'text-green-700 hover:text-green-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {isClosed
                                                    ? <><CheckCircle className="w-3.5 h-3.5" /> Reopen thread</>
                                                    : <><XCircle className="w-3.5 h-3.5" /> Close thread</>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
