'use client';

import { useEffect } from 'react';

// A reusable modal shell: dims the page, centres its children in a card, and
// closes on Escape or a backdrop click. Whatever goes inside (a form, a
// confirmation) is passed as children, so this stays purely about overlay
// behaviour and can be reused anywhere.
export default function Modal({ onClose, children, maxWidth = 'max-w-lg' }) {
  // Close on Escape, and lock background scroll while the modal is open.
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      // Clicking the backdrop closes the modal; clicks on the card don't bubble.
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full ${maxWidth} rounded-2xl border border-line bg-surface p-6 shadow-xl`}
      >
        {children}
      </div>
    </div>
  );
}