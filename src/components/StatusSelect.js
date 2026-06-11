'use client';

import { STATUS_STYLES, FALLBACK_STATUS_STYLE } from '@/lib/statusStyles';

export default function StatusSelect({ value, statuses, onChange }) {
  const current = statuses.find((status) => status.id === value);
  const style = (current && STATUS_STYLES[current.label]) || FALLBACK_STATUS_STYLE;

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Change status"
        className={`cursor-pointer appearance-none rounded-full py-1 pl-2.5 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ink/15 ${style}`}
      >
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.label}
          </option>
        ))}
      </select>
      {/* Custom chevron — appearance-none removes the native one. */}
      <svg
        className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-ink-soft/60"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}