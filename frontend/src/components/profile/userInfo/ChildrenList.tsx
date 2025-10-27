'use client';

export default function ChildrenList({
    items,
}: {
    items: { id: string; name: string; subtitle?: string }[];
}) {

    return (
        <section className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />
            <div className="p-6 sm:p-8">
                <h3 className="text-wondergreen font-bold flex items-center gap-2 mb-4">
                    <span>👨‍👩‍👧</span>
                    Your Children
                </h3>

                <div className="space-y-3">
                    {items.map((c) => (
                        <div
                        key={c.id}
                        className="rounded-xl border border-wonderleaf/30 bg-gradient-to-r from-wonderleaf/10 to-white px-4 py-3"
                        >
                        <div className="font-semibold text-wondergreen">{c.name}</div>
                        {c.subtitle && (
                            <div className="text-sm text-wondergreen/70">{c.subtitle}</div>
                        )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
