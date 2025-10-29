'use client';
import { useAuth } from "@/context/auth";

function formatRole(role?: string) {
  if (!role) return '';
  const v = role.trim().toLowerCase();
  if (v === 'parent') return 'Parent/Guardian';
  return v.charAt(0).toUpperCase() + v.slice(1); // Admin, Volunteer, и т.п.
}

export default function UserHeader({
    name,
    role, 
    subtitle,
    childrenCount = 0,
    onEdit,
}: {
    name: string;
    role?: string,
    subtitle?: string;
    childrenCount?: number;
    onEdit: () => void;
}) {
    const { user } = useAuth();
    
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
            {/* top accent stripe */}
            <div className="h-1 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />
            <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-wondergreen">
                        {name}
                        </h2>
                        {/* {subtitle && (
                        <p className="mt-1 text-wondergreen/70">{subtitle}</p>
                        )} */}
                        <div className="mt-3 flex flex-wrap items-center gap-4 mt-5">
                        <span className="inline-flex items-center rounded-full bg-wonderleaf/15 text-wondergreen px-3 py-1 text-sm font-semibold">
                            {formatRole(user?.role)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-wondersun/20 text-wondergreen px-3 py-1 text-sm font-semibold">
                            {childrenCount} Children
                        </span>
                        </div>
                    </div>

                    <button
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-wondergreen text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-wonderleaf"
                    >
                        Edit Profile
                        <span className="inline-block -scale-x-100">✏️</span>
                         
                    </button>
                </div>
            </div>
        </div>
    );
}
