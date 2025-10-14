'use client';

import { useEffect, useMemo, useState } from 'react';
import { API, makeApiRequest } from '../../../utils/api';
import { useModal } from '@/context/modal';
import LoginModal from '@/components/login/LoginModal';
import DeleteOpportunityModal from './DeleteOpportunityModal';
import { VENUE_OPTIONS, Venue, Opp, OppCreate, OppUpdate } from '../../types/opportunity';

// helpers
// const clean = (arr?: string[]) => (arr ?? []).map(s => s.trim()).filter(Boolean);
const toLines = (s: string) => s.split('\n');
const fromLines = (a?: string[]) => (a ?? []).join('\n');

//normalization data
const buildBody = (src: OppCreate): OppCreate => ({
  ...src,
  title: src.title.trim(),
  time: src.time.trim(),
  minAge: Number(src.minAge),
});

// Tiny error shape reader (works for fetch/axios-like errors without `any`)
type ErrLike = { status?: number; response?: { status?: number; data?: { detail?: string; message?: string } } };
const statusOf = (e: unknown) => String((e as ErrLike)?.status ?? (e as ErrLike)?.response?.status ?? '');
const messageOf = (e: unknown) => ((e as ErrLike)?.response?.data?.detail || (e as ErrLike)?.response?.data?.message || '');

const OPPS_API = `${API}/opportunities`;

// Blank form model used for create/reset
const emptyForm: OppCreate = {
  title: '',
  venue: [],
  duties: [],
  skills: [],
  time: '',
  requirements: [],
  tags: [],
  minAge: 18,
  bgCheckRequired: true,
  volunteerIds: [],
};

export default function AdminVolunteerOpportunities({ onViewAppsFor }: { onViewAppsFor?: (opp: Opp) => void }) {
  const { setModalContent } = useModal();

  const [items, setItems] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [f, setF] = useState<OppCreate>(emptyForm);
  const isEditing = !!editingId;
  const submitLabel = isEditing ? 'Save changes' : 'Create opportunity';

  const [q, setQ] = useState('');

  //fetch list if admin
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const me = await makeApiRequest<{ role: 'admin' | 'parent' | 'instructor' | 'volunteer' }>(`${API}/auth/users/me`, { method: 'GET' });
        if (me.role !== 'admin') {
          setErr('Admins only.');
          return;
        }
        // Admin confirmed -> load opportunities
        const res = await makeApiRequest<{ opportunities: Opp[] }>(`${OPPS_API}`, { method: 'GET' });
        setItems(res.opportunities ?? []);
      } catch (e) {
        const code = statusOf(e);
        if (code === '401') setModalContent(<LoginModal />);
        else if (code === '403') setErr('Admins only.');
        else setErr(messageOf(e) || 'Failed to load opportunities.');
      } finally {
        setLoading(false);
      }
    })();
  }, [setModalContent]);

  //filter over a few text fields
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(x =>
      [x.title, ...(x.tags ?? []), ...x.skills, ...(x.duties ?? []), ...(x.requirements ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(s),
    );
  }, [items, q]);

  //Form helpers: reset and populate for edit
  const resetForm = () => {
    setEditingId(null);
    setF(emptyForm);
    setErr(null);
  };

  const startEdit = (opp: Opp) => {
    setErr(null);
    setEditingId(opp.id);
    setF({
      title: opp.title,
      venue: opp.venue ?? [],
      duties: opp.duties ?? [],
      skills: opp.skills ?? [],
      time: opp.time ?? '',
      requirements: opp.requirements ?? [],
      tags: opp.tags ?? [],
      minAge: opp.minAge ?? 18,
      bgCheckRequired: !!opp.bgCheckRequired,
      volunteerIds: opp.volunteerIds ?? [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  //Delete: open modal opp
  const openDelete = (opp: Opp) => {
    setModalContent(
      <DeleteOpportunityModal
        id={opp.id}
        title={opp.title}
        onDeleted={() => {
          setItems(prev => prev.filter(x => x.id !== opp.id));
          if (editingId === opp.id) resetForm();
        }}
      />,
    );
  };

  //Submit: add/remove value in array
  const toggleVenue = (v: Venue) =>
    setF(s => ({
      ...s,
      venue: s.venue.includes(v) ? s.venue.filter(x => x !== v) : [...s.venue, v],
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErr(null);
      if (isEditing && editingId) {
        const body: OppUpdate = buildBody(f);
        const res = await makeApiRequest<{ opportunity: Opp }>(`${OPPS_API}/${editingId}`, {
          method: 'PATCH',
          body,
        });
        setItems(prev => prev.map(it => (it.id === editingId ? res.opportunity : it)));
      } else {
        const body: OppCreate = buildBody(f);
        const res = await makeApiRequest<{ opportunity: Opp }>(`${OPPS_API}/`, {
          method: 'POST',
          body,
        });
        setItems(prev => [res.opportunity, ...prev]);
      }
      resetForm();
    } catch (e) {
      const code = statusOf(e);
      if (code === '401') setModalContent(<LoginModal />);
      setErr(messageOf(e) || 'Failed to save opportunity.');
    }
  };



  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Volunteer Opportunities</h1>

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
          {err}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="text-lg font-medium">{isEditing ? 'Edit opportunity' : 'Create opportunity'}</h2>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={f.title}
              onChange={e => setF({ ...f, title: e.target.value })}
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Time *</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={f.time}
              onChange={e => setF({ ...f, time: e.target.value })}
              placeholder="e.g., 2–4 hours per event"
              required
            />
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium mb-1">Venue *</label>
            <div className="flex flex-wrap gap-4 text-sm">
              {VENUE_OPTIONS.map(v => (
                <label key={v} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={f.venue.includes(v)} onChange={() => toggleVenue(v)} />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Min age + BG check */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min age *</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-lg border px-3 py-2"
                value={f.minAge}
                onChange={e => setF({ ...f, minAge: Number(e.target.value || 0) })}
                required
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={f.bgCheckRequired}
                  onChange={e => setF({ ...f, bgCheckRequired: e.target.checked })}
                />
                <span className="text-sm">Background check required</span>
              </label>
            </div>
          </div>

          {/* Duties / Requirements / Skills / Tags */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Duties (one per line) *</label>
            <textarea
              rows={5}
              className="w-full rounded-lg border px-3 py-2"
              value={fromLines(f.duties)}
              onChange={e => setF({ ...f, duties: toLines(e.target.value) })}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Requirements (one per line) *</label>
            <textarea
              rows={5}
              className="w-full rounded-lg border px-3 py-2"
              value={fromLines(f.requirements)}
              onChange={e => setF({ ...f, requirements: toLines(e.target.value) })}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Skills (one per line) *</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              value={fromLines(f.skills)}
              onChange={e => setF({ ...f, skills: toLines(e.target.value) })}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium mb-1">Tags (one per line) *</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              value={fromLines(f.tags)}
              onChange={e => setF({ ...f, tags: toLines(e.target.value) })}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-4 flex gap-3">
          <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700">
            {submitLabel}
          </button>
          {!isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border px-5 py-2.5 hover:bg-gray-50"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium">All opportunities</h2>
        <input
          placeholder="Search…"
          className="rounded-lg border px-3 py-2 w-60"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="mt-3 grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-gray-500">No opportunities yet.</div>
        ) : (
          filtered.map(opp => (
            <article key={opp.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{opp.title}</h3>
                  <div className="text-xs text-gray-600 mt-1">
                    Venue: {opp.venue.join(' · ')} · Min age {opp.minAge} ·
                    {opp.bgCheckRequired ? ' BG check required' : ' BG check optional'}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onViewAppsFor?.(opp)}
                    className="text-sm rounded-md border px-3 py-1.5 hover:bg-gray-50"
                  >
                    View apps
                  </button>
                  <button
                    onClick={() => startEdit(opp)}
                    className="text-sm rounded-md border px-3 py-1.5 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDelete(opp)}
                    className="text-sm rounded-md border px-3 py-1.5 text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {opp.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {opp.tags.map(t => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Time:</span> {opp.time}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
