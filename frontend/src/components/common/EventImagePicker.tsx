'use client';

import React, { useState, DragEvent } from 'react';
import NextImage from 'next/image';

type Props = {
  value: string | null;
  onChange: (fileOrUrl: File | string | null) => void;
};

export default function EventImagePicker({ value, onChange }: Props) {
  const [url, setUrl] = useState('');

  const onFile = (file: File | null) => {
    if (!file) return;
    onChange(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const applyUrl = () => {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return;
    onChange(trimmed);
  };

  const onUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyUrl();
    }
  };

  return (
    <div className="space-y-3">
      <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="rounded-lg border border-dashed p-4 text-center cursor-pointer hover:bg-gray-50"
      >
        <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="hidden"
        id="event-image-file"
        />
        <label htmlFor="event-image-file" className="inline-block font-medium">
          Drag & drop or <span className="underline">choose file</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">PNG/JPG, max ~5-10MB ок</p>
      </div>

      <div className="flex gap-2">
        <input
        type="url"
        placeholder="https://example.com/image.jpg"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={onUrlKeyDown}     
        className="flex-1 border rounded px-3 py-2"
        />
        <button
        type="button"
        onClick={applyUrl}        
        className="px-3 py-2 rounded bg-wondergreen text-white font-semibold"
        >
          Use URL
        </button>
      </div>

      {value ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border">
          <NextImage
          src={value}
          alt="Preview"
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized 
          priority={false}
          />
        </div>
      ) : (
        <p className="text-xs text-gray-500">No image selected</p>
    )}
    </div>
  );
}
