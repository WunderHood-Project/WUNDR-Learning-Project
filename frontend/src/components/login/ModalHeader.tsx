'use client';

export default function ModalHeader({
  title,
  onClose,
}: { title: string; onClose: () => void }) {
  return (
    <div className="relative mb-6 py-1 min-h-10">
      <h2
        className="
          absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
          text-xl sm:text-2xl md:text-3xl font-bold text-wondergreen
          leading-tight text-center whitespace-nowrap
        "
      >
        {title}
      </h2>

      {/* Close Button right X */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        title="Close"
        className="
        absolute -right-3 -top-3
        w-8 h-8 flex items-center justify-center
        rounded-full bg-gray-100 hover:bg-gray-200
        text-gray-400 hover:text-gray-600
        transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-wondergreen focus:ring-offset-1
        group
        "
      >
        <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
