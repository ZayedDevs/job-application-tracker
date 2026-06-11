'use client';

import { useEffect, useState } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import ApplicationForm from '@/components/ApplicationForm';
import Modal from '@/components/Modal';

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Modal state. `editing` doubles as the mode flag: null means the form is in
  // "add" mode; an application object means "edit that one".
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The application awaiting delete confirmation, or null if none.
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Load both datasets once on mount: statuses feed the form's dropdown,
  // applications fill the table.
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [appsRes, statusesRes] = await Promise.all([
          fetch('/api/applications'),
          fetch('/api/statuses'),
        ]);
        if (!appsRes.ok || !statusesRes.ok) {
          throw new Error('Failed to load data');
        }
        setApplications(await appsRes.json());
        setStatuses(await statusesRes.json());
      } catch {
        setLoadError('Could not load your applications. Is the server running?');
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Re-fetch the list after any change. One extra request, but it keeps the UI
  // in lockstep with the database rather than hand-patching local state.
  async function refreshApplications() {
    const res = await fetch('/api/applications');
    if (res.ok) setApplications(await res.json());
  }

  async function handleStatusChange(application, newStatusId) {
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: newStatusId }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch (err) {
      alert(err.message);
    } finally {
      try {
        await refreshApplications();
      } catch {
        // Server unreachable — leave the table as-is.
      }
    }
  }

  function openAddForm() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEditForm(application) {
    setEditing(application);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  // Handles both create and update — which one is decided by whether we're
  // editing an existing application or not.
  async function handleSubmit(payload) {
    setIsSubmitting(true);
    try {
      const url = editing
        ? `/api/applications/${editing.id}`
        : '/api/applications';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }

      closeForm();
      await refreshApplications();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete the application');
      setDeleteTarget(null);
      await refreshApplications();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Job Application Tracker
          </h1>
          <p className="mt-1 text-sm text-muted">
            Keep every application — and where it stands — in one place.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="shrink-0 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add application
        </button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : loadError ? (
        <div className="rounded-xl border border-rejected-fg/30 bg-rejected-bg px-4 py-3 text-sm text-rejected-fg">
          {loadError}
        </div>
      ) : (
        <ApplicationTable
          applications={applications}
          statuses={statuses}
          onEdit={openEditForm}
          onDelete={setDeleteTarget}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Add / edit form, shown in a modal */}
      {formOpen && (
        <Modal onClose={closeForm}>
          <ApplicationForm
            statuses={statuses}
            initialData={editing}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {/* Delete confirmation, shown in a smaller modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} maxWidth="max-w-sm">
          <h2 className="text-lg font-semibold text-ink">Delete application</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Delete your{' '}
            <span className="font-medium text-ink">{deleteTarget.company}</span>{' '}
            application for {deleteTarget.role}? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="rounded-lg bg-rejected-fg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}