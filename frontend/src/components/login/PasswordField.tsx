'use client';

import React, { useState } from "react";

//Eye icon (visible)
const Eye = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
);
//Eye-off icon (hidden)
const EyeOff = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
    </svg>
);

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string; error?: string;
};

//Password input with show/hide toggle and inline error display.
export default function PasswordField({ label, error, ...rest }: Props) {
    const [show, setShow] = useState(false);
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                {...rest}
                type={show ? "text" : "password"}
                className={`
                    w-full p-3 pr-12 rounded-xl bg-white
                    text-gray-900 placeholder-gray-400
                    border ${error ? 'border-red-500' : 'border-gray-300'}
                    outline-none focus:outline-none focus-visible:outline-none
                    ring-0 focus:ring-2 focus:ring-green-600 focus:border-transparent
                    transition-colors rounded-full
                `}
                />
                <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label="Toggle password visibility"
                >
                {show ? <EyeOff/> : <Eye/>}
                </button>
            </div>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
}
