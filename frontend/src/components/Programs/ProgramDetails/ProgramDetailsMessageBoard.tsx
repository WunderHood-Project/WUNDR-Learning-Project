'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Send, Pencil, Trash2, Check, X } from 'lucide-react';
import { makeApiRequest, determineEnv } from '../../../../utils/api';
import OpenModalButton from '@/context/openModalButton';
import ProgramDetailsThreadDeleteModal from './modals/ProgramDetailsThreadDeleteModal';
import ProgramDetailsMessageDeleteModal from './modals/ProgramDetailsMessageDeleteModal';
import ProgramDetailsDirectMessages from './ProgramDetailsDirectMessages';
import { useUser } from '../../../../hooks/useUser';
import type { ProgramThread } from '@/types/program';

const WONDERHOOD_URL = determineEnv();

// ---------------------------------------------------------------------------
// Shared utilities — imported by AdminMessage
// ---------------------------------------------------------------------------

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function fetchProgramThreads(programId: string): Promise<ProgramThread[]> {
  try {
    const data = await makeApiRequest<{ data: ProgramThread[] }>(
      `${WONDERHOOD_URL}/program/${programId}/threads/all`,
      { method: 'GET' }
    );
    return data.data;
  } catch (err) {
    console.error("Error fetching threads:", err);
  }
  return [];
}

export async function replyToThread(
  programId: string,
  threadId: string,
  content: string
): Promise<void> {
  await makeApiRequest(
    `${WONDERHOOD_URL}/program/${programId}/threads/${threadId}/messages`,
    { method: 'POST', body: { content } }
  );
}

// ---------------------------------------------------------------------------

type Props = {
  programId: string;
};

export default function ProgramDetailsMessageBoard({ programId }: Props) {
  const { user } = useUser();

  const [threads, setThreads] = useState<ProgramThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [replyError, setReplyError] = useState<Record<string, string | null>>({});

  const [showNewThread, setShowNewThread] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [sendToAdminsOnly, setSendToAdminsOnly] = useState(false);
  const [newThreadLoading, setNewThreadLoading] = useState(false);
  const [newThreadError, setNewThreadError] = useState<string | null>(null);

  // Thread edit state
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editLoading, setEditLoading] = useState<Record<string, boolean>>({});

  // Thread / message delete state
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});

  // Message edit state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [editMessageLoading, setEditMessageLoading] = useState<Record<string, boolean>>({});

  const [privateRefreshKey, setPrivateRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    loadThreads();
  }, [programId, user]);

  async function loadThreads() {
    try {
      setLoading(true);
      setError(null);
      setThreads(await fetchProgramThreads(programId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discussions');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateThread(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;

    setNewThreadLoading(true);
    setNewThreadError(null);

    try {
      const endpoint = sendToAdminsOnly
        ? `${WONDERHOOD_URL}/program/${programId}/threads/directly-admin`
        : `${WONDERHOOD_URL}/program/${programId}/threads`;

      await makeApiRequest(endpoint, {
        method: 'POST',
        body: { subject: newSubject.trim(), content: newContent.trim() },
      });
      setNewSubject('');
      setNewContent('');
      setSendToAdminsOnly(false);
      setShowNewThread(false);
      if (sendToAdminsOnly) setPrivateRefreshKey(k => k + 1);
      await loadThreads();
    } catch (err) {
      setNewThreadError(err instanceof Error ? err.message : 'Failed to create thread');
    } finally {
      setNewThreadLoading(false);
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

  async function handleDeleteThread(threadId: string) {
    setDeleteLoading(prev => ({ ...prev, [threadId]: true }));
    try {
      await makeApiRequest(
        `${WONDERHOOD_URL}/program/${programId}/threads/${threadId}/me`,
        { method: 'DELETE' }
      );
      if (expandedThreadId === threadId) setExpandedThreadId(null);
      await loadThreads();
    } catch (err) {
      console.error('Failed to delete thread:', err);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [threadId]: false }));
    }
  }

  // Placeholder handlers — require backend endpoints to be added
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

  async function handleDeleteMessage(messageId: string) {
    setDeleteLoading(prev => ({ ...prev, [messageId]: true }));
    try {
      await makeApiRequest(
        `${WONDERHOOD_URL}/program/${programId}/messages/${messageId}`,
        { method: 'DELETE' }
      );
      await loadThreads();
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [messageId]: false }));
    }
  }

  return (
    <section className="mt-10 pb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-wondergreen flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Discussion Board
        </h2>
        {user && (
          <button
            onClick={() => setShowNewThread(v => !v)}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-wondergreen text-white hover:bg-wondergreen/80 transition"
          >
            {showNewThread ? 'Cancel' : '+ New Thread'}
          </button>
        )}
      </div>

      {!user && (
        <p className="text-center text-sm text-gray-500 py-8">
          Sign in to view and participate in discussions.
        </p>
      )}

      {user && showNewThread && (
        <form
          onSubmit={handleCreateThread}
          className="mb-6 bg-white/60 rounded-2xl border border-white/70 p-5 backdrop-blur-sm"
        >
          <h3 className="font-semibold text-wondergreen mb-3">Start a Discussion</h3>
          {newThreadError && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {newThreadError}
            </p>
          )}
          <input
            className="w-full mb-3 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
            placeholder="Subject"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            required
          />
          <textarea
            className="w-full mb-3 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40 resize-none"
            placeholder="Write your message…"
            rows={3}
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 mb-3 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={sendToAdminsOnly}
              onChange={e => setSendToAdminsOnly(e.target.checked)}
              className="accent-wondergreen"
            />
            Send to admins only
          </label>
          <button
            type="submit"
            disabled={newThreadLoading}
            className="px-4 py-2 text-sm font-medium bg-wondergreen text-white rounded-lg hover:bg-wondergreen/80 transition disabled:opacity-50"
          >
            {newThreadLoading ? 'Posting…' : 'Post Thread'}
          </button>
        </form>
      )}

      {user && loading && (
        <p className="text-center text-sm text-gray-500 py-8">Loading discussions…</p>
      )}

      {user && error && (
        <p className="text-center text-sm text-red-600 py-8">{error}</p>
      )}

      {user && !loading && !error && threads.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-8">
          No discussions yet. Be the first to start one!
        </p>
      )}

      {user && !loading && !error && threads.length > 0 && (
        <div className="space-y-4">
          {threads.map(thread => {
            const isExpanded = expandedThreadId === thread.id;
            const isOwner = thread.userId === user.id;
            const isEditingThread = editingThreadId === thread.id;

            return (
              <div
                key={thread.id}
                className="bg-white/50 rounded-2xl border border-white/60 backdrop-blur-sm overflow-hidden"
              >
                {/* Thread header card */}
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
                      <div>
                        <p className="font-semibold text-gray-800">{thread.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(thread.createdAt)} · {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                      }
                    </button>

                    {isOwner && (
                      <div className="flex items-center gap-1 pr-3 pt-4 shrink-0">
                        <button
                          onClick={() => {
                            setEditingThreadId(thread.id);
                            setEditSubject(thread.subject);
                          }}
                          className="p-1.5 text-gray-400 hover:text-wondergreen transition"
                          title="Edit thread"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <OpenModalButton
                          className="p-1.5 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                          buttonText={<Trash2 className="w-3.5 h-3.5" />}
                          disabled={!!deleteLoading[thread.id]}
                          modalComponent={
                            <ProgramDetailsThreadDeleteModal
                              onDelete={() => handleDeleteThread(thread.id)}
                            />
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                    {/* Message cards */}
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
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingMessageId(msg.id);
                                      setEditMessageContent(msg.content);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-wondergreen transition"
                                    title="Edit message"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  {/* <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    disabled={deleteLoading[msg.id]}
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                                    title="Delete message"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button> */}
                                  <OpenModalButton
                                    className="p-1.5 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
                                    buttonText={<Trash2 className="w-3 h-3" />}
                                    disabled={!!deleteLoading[msg.id]}
                                    modalComponent={
                                      <ProgramDetailsMessageDeleteModal
                                        onDelete={() => handleDeleteMessage(msg.id)}
                                      />
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Reply */}
                    {thread.status === 'open' && (
                      <div className="pt-2">
                        {replyError[thread.id] && (
                          <p className="mb-2 text-xs text-red-600">{replyError[thread.id]}</p>
                        )}
                        <div className="flex gap-2">
                          <input
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                            placeholder="Write a reply…"
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

                    {thread.status === 'closed' && (
                      <p className="text-xs text-gray-400 pt-2">This thread is closed.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ProgramDetailsDirectMessages programId={programId} refreshKey={privateRefreshKey} />
    </section>
  );
}
