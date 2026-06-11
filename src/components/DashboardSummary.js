import StatusBadge from './StatusBadge';

export default function DashboardSummary({ applications, statuses }) {
  const total = applications.length;

  const counts = statuses.map((status) => ({
    id: status.id,
    label: status.label,
    count: applications.filter((app) => app.status_id === status.id).length,
  }));

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Summary
        </h2>
        <p className="text-sm text-muted">
          <span className="font-mono font-medium text-ink">{total}</span> total
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {counts.map((status) => (
          <div
            key={status.id}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <p className="font-mono text-2xl font-semibold text-ink">
              {status.count}
            </p>
            <div className="mt-2">
              <StatusBadge label={status.label} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}