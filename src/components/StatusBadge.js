// A small coloured pill for an application's status. The colour is semantic — it
// encodes where the application stands — so the table can be scanned at a glance
// without reading every label. Full class strings (not built dynamically) so
// Tailwind's scanner picks them up at build time.
const STATUS_STYLES = {
  'Applied': 'bg-applied-bg text-applied-fg',
  'Interview Scheduled': 'bg-interview-bg text-interview-fg',
  'Offer Received': 'bg-offer-bg text-offer-fg',
  'Rejected': 'bg-rejected-bg text-rejected-fg',
  'Withdrawn': 'bg-withdrawn-bg text-withdrawn-fg',
};

export default function StatusBadge({ label }) {
  // Fall back to neutral styling if an unrecognised label ever appears.
  const style = STATUS_STYLES[label] ?? 'bg-withdrawn-bg text-withdrawn-fg';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}
    >
      {label}
    </span>
  );
}