'use client';
import { useAuth } from "@/context/auth";
import { FaEdit } from "react-icons/fa";

function formatRole(role?: string) {
  if (!role) return '';
  const v = role.trim().toLowerCase();
  if (v === 'parent') return 'Parent/Guardian';
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function UserHeader({
    name,
    role, 
    // subtitle,
    childrenCount = 0,
    onEdit,
}: {
    name: string;
    role?: string,
    // subtitle?: string;
    childrenCount?: number;
    onEdit: () => void;
}) {
    const { user } = useAuth();

    const resolvedRole = role ?? user?.role;
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-wondergreen/10 overflow-hidden">
            {/* Top accent stripe */}
            <div className="h-1 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />
            
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Main Name */}
                        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl font-extrabold text-wondergreen leading-tight break-words mb-3 sm:mb-6 mt-2 sm:mt-0">
                            {name}
                        </h2>

                        {/* Badges */}
                        <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
                            <span className="inline-flex items-center rounded-full bg-wonderleaf/15 text-wondergreen px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs md:text-sm font-semibold whitespace-nowrap">
                                {formatRole(resolvedRole)}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-wondersun/20 text-wondergreen px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 text-xs md:text-sm font-semibold whitespace-nowrap">
                                {childrenCount} {childrenCount === 1 ? 'Child' : 'Children'}
                            </span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={onEdit}
                        className="
                            inline-flex items-center gap-1 sm:gap-1.5
                            px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5
                            h-7 sm:h-10 md:h-11 mt-1
                            rounded-lg sm:rounded-lg md:rounded-xl
                            bg-wondergreen hover:bg-wonderleaf
                            text-white font-semibold text-xs sm:text-sm md:text-base
                            transition-all duration-200
                            flex-shrink-0
                            hover:shadow-md
                            focus:outline-none focus:ring-2 focus:ring-wonderleaf focus:ring-offset-2
                        "
                    >
                        <FaEdit className="h-3 w-3 sm:h-4 md:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}