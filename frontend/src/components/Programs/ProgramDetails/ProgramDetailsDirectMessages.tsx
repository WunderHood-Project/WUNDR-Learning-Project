'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lock, Send, Pencil, Check, X } from 'lucide-react';
import { makeApiRequest, determineEnv } from '../../../../utils/api';
import { formatDate, replyToThread } from './ProgramDetailsMessageBoard';
import { useUser } from '../../../../hooks/useUser';
import type { ProgramThread } from '@/types/program';

const WONDERHOOD_URL = determineEnv();

type Props = {
  programId: string;
  refreshKey?: number;
};

export default function ProgramDetailsDirectMessages({ programId, refreshKey }: Props) {
  const { user } = useUser();

  const [threads, setThreads] = useState<ProgramThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [replyError, setReplyError] = useState<Record<string, string | null>>({});

  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editLoading, setEditLoading] = useState<Record<string, boolean>>({});

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [editMessageLoading, setEditMessageLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    loadThreads();
  }, [programId, user, refreshKey]);

  async function loadThreads() {
    try {
      setLoading(true);
      setError(null);
      const data = await makeApiRequest<{ data: ProgramThread[] }>(
        `${WONDERHOOD_URL}/program/${programId}/threads/me`,
        { method: 'GET' }
      );
      setThreads(data.data.filter(t => t.isPrivate));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load direct messages');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateThread(threadId: string) {
    const subject = editSubject.trim();
    if (!subject) return;

    setEditLoading(prev => ({ ...prev, [threadId]: true }));
    try {
      await makeApiRequest(
        `${WONDERHOOD_URL}/program/${programId}/threads/${threadId}`,
        { method: 'PATCH', body: { subject } }
      );
      setEditingThreadId(null);
      await loadThreads();
    } catch (err) {
      console.error('Failed to update thread:', err);
    } finally {
      setEditLoading(prev => ({ ...prev, [threadId]: false }));
    }
  }

  async function handleUpdateMessage(messageId: string) {
    const content = editMessageContent.trim();
    if (!content) return;

    setEditMessageLoading(prev => ({ ...prev, [messageId]: true }));
    try {
      await makeApiRequest(
        `${WONDERHOOD_URL}/program/${programId}/messages/${messageId}`,
        { method: 'PATCH', body: { content } }
      );
      setEditingMessageId(null);
      await loadThreads();
    } catch (err) {
      console.error('Failed to update message:', err);
    } finally {
      setEditMessageLoading(prev => ({ ...prev, [messageId]: false }));
    }
  }

  async function handleReply(threadId: string) {
    const content = replyContent[threadId]?.trim();
    if (!content) return;

    setReplyLoading(prev => ({ ...prev, [threadId]: true }));
    setReplyError(prev => ({ ...prev, [threadId]: null }));

    try {
      await replyToThread(programId, threadId, content);
      setReplyContent(prev => ({ ...prev, [threadId]: '' }));
      await loadThreads();
    } catch (err) {
      setReplyError(prev => ({
        ...prev,
        [threadId]: err instanceof Error ? err.message : 'Failed to send reply',
      }));
    } finally {
      setReplyLoading(prev => ({ ...prev, [threadId]: false }));
    }
  }

  if (!user) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-wondergreen flex items-center gap-2 mb-5">
        <Lock className="w-5 h-5" />
        My Direct Messages
      </h2>

      {loading && (
        <p className="text-center text-sm text-gray-500 py-8">Loading direct messages…</p>
      )}

      {error && (
        <p className="text-center text-sm text-red-600 py-8">{error}</p>
      )}

      {!loading && !error && threads.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-8">
          No direct messages yet. Use &quot;Send to admins only&quot; when creating a thread.
        </p>
      )}

      {!loading && !error && threads.length > 0 && (
        <div className="space-y-4">
          {threads.map(thread => {
            const isExpanded = expandedThreadId === thread.id;
            const isClosed = thread.status === 'closed';
            const isEditingThread = editingThreadId === thread.id;

            return (
              <div
                key={thread.id}
                className="bg-white/50 rounded-2xl border border-white/60 backdrop-blur-sm overflow-hidden"
              >
                {isEditingThread ? (
                  <div className="px-5 py-4 flex items-center gap-2">
                    <input
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                      value={editSubject}
                      onChange={e => setEditSubject(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateThread(thread.id)}
                      disabled={editLoading[thread.id]}
                      className="p-2 text-wondergreen hover:text-wondergreen/70 transition disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingThreadId(null)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <button
                      className="flex-1 text-left px-5 py-4 flex items-start justify-between gap-4"
                      onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 truncate">{thread.subject}</p>
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
                    <div className="flex items-center pr-3 pt-4 shrink-0">
                      <button
                        onClick={() => { setEditingThreadId(thread.id); setEditSubject(thread.subject); }}
                        className="p-1.5 text-gray-400 hover:text-wondergreen transition"
                        title="Edit thread"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                    {thread.messages.map(msg => {
                      const isMessageOwner = msg.senderId === user.id;
                      const isEditingMessage = editingMessageId === msg.id;

                      return (
                        <div
                          key={msg.id}
                          className="bg-white/70 rounded-xl border border-gray-100 px-4 py-3"
                        >
                          {isEditingMessage ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40 resize-none"
                                rows={2}
                                value={editMessageContent}
                                onChange={e => setEditMessageContent(e.target.value)}
                                autoFocus
                              />
                              <div className="flex flex-col gap-1 shrink-0">
                                <button
                                  onClick={() => handleUpdateMessage(msg.id)}
                                  disabled={editMessageLoading[msg.id]}
                                  className="p-1.5 text-wondergreen hover:text-wondergreen/70 transition disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingMessageId(null)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm text-gray-700">{msg.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                              </div>
                              {isMessageOwner && (
                                <button
                                  onClick={() => { setEditingMessageId(msg.id); setEditMessageContent(msg.content); }}
                                  className="p-1.5 text-gray-400 hover:text-wondergreen transition shrink-0"
                                  title="Edit message"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!isClosed && (
                      <div className="pt-2">
                        {replyError[thread.id] && (
                          <p className="mb-2 text-xs text-red-600">{replyError[thread.id]}</p>
                        )}
                        <div className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                            placeholder="Reply to this message…"
                            value={replyContent[thread.id] ?? ''}
                            onChange={e =>
                              setReplyContent(prev => ({ ...prev, [thread.id]: e.target.value }))
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(thread.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleReply(thread.id)}
                            disabled={replyLoading[thread.id]}
                            className="px-3 py-2 bg-wondergreen text-white rounded-lg hover:bg-wondergreen/80 transition disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {isClosed && (
                      <p className="text-xs text-gray-400 pt-2">This thread is closed.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
