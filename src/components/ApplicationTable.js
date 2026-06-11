import StatusSelect from './StatusSelect';

export default function ApplicationTable({
  applications,
  statuses,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">No applications yet</p>
        <p className="mt-1 text-sm text-muted">
          Add your first one to start tracking your job hunt.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <Th>Company</Th>
            <Th>Role</Th>
            <Th>Date applied</Th>
            <Th>Status</Th>
            <Th className="hidden md:table-cell">Notes</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.id}
              className="border-b border-line transition-colors last:border-0 hover:bg-paper"
            >
              <td className="px-4 py-3 font-medium text-ink">{app.company}</td>
              <td className="px-4 py-3 text-ink-soft">{app.role}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                {formatDate(app.date_applied)}
              </td>
              <td className="px-4 py-3">
                <StatusSelect
                  value={app.status_id}
                  statuses={statuses}
                  onChange={(newStatusId) => onStatusChange(app, newStatusId)}
                />
              </td>
              <td className="hidden max-w-xs px-4 py-3 text-muted md:table-cell">
                <span className="line-clamp-2">{app.notes || '—'}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(app)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-ink-soft hover:bg-paper"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-rejected-fg hover:bg-rejected-bg"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = '' }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted ${className}`}
    >
      {children}
    </th>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}