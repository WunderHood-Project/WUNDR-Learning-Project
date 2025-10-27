'use client';

export default function InfoCard({
    icon,
    label,
    value,
    className = '',
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    className?: string;
}) {

    return (
        <div
        className="rounded-xl border border-wonderorange/30 bg-wondersun/5 p-4"
        >
            <div className="flex items-start gap-3">
                <div className="mt-1">{icon}</div>
                <div>
                    <p className="text-[11px] uppercase tracking-wide font-semibold text-wondergreen/70">
                        {label}
                    </p>
                    <p className="mt-1 font-semibold text-wondergreen break-words">
                        {value || '—'}
                    </p>
                </div>
            </div>
        </div>
    );
}
