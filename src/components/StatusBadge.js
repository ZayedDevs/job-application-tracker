import { STATUS_STYLES, FALLBACK_STATUS_STYLE } from '@/lib/statusStyles';

export default function StatusBadge({ label }) {
  const style = STATUS_STYLES[label] ?? FALLBACK_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}
    >
      {label}
    </span>
  );
}