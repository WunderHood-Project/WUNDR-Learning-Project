'use client';
type TabKey = 'all' | 'unread' | 'read';

export function Tabs({
  tab, setTab, unreadCount, readCount,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  unreadCount: number;
  readCount: number;
}) {
  return (
    <div className="mt-3 px-4 sm:px-6">
      <div className="flex flex-wrap gap-2">
        <Tab active={tab === 'all'}    onClick={() => setTab('all')}    label="All" />
        <Tab active={tab === 'unread'} onClick={() => setTab('unread')} label="Unread" count={unreadCount} />
        <Tab active={tab === 'read'}   onClick={() => setTab('read')}   label="Read"   count={readCount} />
      </div>
    </div>
  );
}

function Tab({ active, onClick, label, count }: {
  active: boolean; onClick: () => void; label: string; count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-semibold transition
        ${active ? 'bg-white text-wondergreen border border-wondergreen shadow-sm'
                 : 'bg-white/70 text-gray-700 border border-transparent hover:border-wonderleaf/40'}`}
    >
      <span className="align-middle">{label}</span>
      {!!count && (
        <span className="ml-2 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full
                         bg-wondergreen/10 text-wondergreen text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
