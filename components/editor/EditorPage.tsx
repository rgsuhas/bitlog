/**
 * Editor Landing Page Component
 * 
 * Provides an overview of the editor functionality and allows users to
 * create new posts or edit existing ones. This page serves as the entry
 * point to the editor experience with a clean, intuitive interface.
 * 
 * Features:
 * - Create new post functionality
 * - Recent drafts overview
 * - Quick access to editor features
 * - Responsive design with modern aesthetics
 */



// components/editor/EditorPage.tsx
'use client';

import { useRef, useState } from 'react';
import { Bold, Italic, Code, Quote, Strikethrough, Underline } from 'lucide-react';

export default function EditorPage({ params }: { params: { slug: string } }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onFormat = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const formatted = `${prefix}${selectedText}${suffix}`;

    const updated = value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);
    setValue(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        selectionStart + prefix.length,
        selectionEnd + prefix.length
      );
    }, 0);
  };

  const formattingButtons = [
    { icon: Bold, label: 'Bold', action: () => onFormat('**', '**') },
    { icon: Italic, label: 'Italic', action: () => onFormat('_', '_') },
    { icon: Underline, label: 'Underline', action: () => onFormat('<u>', '</u>') },
    { icon: Strikethrough, label: 'Strikethrough', action: () => onFormat('~~', '~~') },
    { icon: Code, label: 'Code', action: () => onFormat('`', '`') },
    { icon: Quote, label: 'Quote', action: () => onFormat('> ', '') },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Editing: {params.slug}</h1>
      <div className="flex gap-2 mb-4">
        {formattingButtons.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label={label}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-64 p-2 border rounded resize-none"
        placeholder="Start typing..."
      />
    </div>
  );
}
