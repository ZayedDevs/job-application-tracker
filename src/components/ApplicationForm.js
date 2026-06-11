'use client';

import { useState } from 'react';

// Add/edit form for a single application. One component serves both cases: pass
// `initialData` to edit an existing row, or omit it to add a new one. The parent
// owns the data and the API calls — this component only collects input,
// validates it, and hands a clean payload back through onSubmit.

const EMPTY = {
  company: '',
  role: '',
  date_applied: '',
  status_id: '',
  notes: '',
};

export default function ApplicationForm({
  statuses,
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isEditing = initialData !== null;

  // Seed the fields from initialData when editing. The API returns a full
  // timestamp, but the native date input needs a plain YYYY-MM-DD, so trim it.
  const [values, setValues] = useState(() => {
    if (!initialData) return EMPTY;
    return {
      company: initialData.company ?? '',
      role: initialData.role ?? '',
      date_applied: initialData.date_applied
        ? initialData.date_applied.slice(0, 10)
        : '',
      status_id: initialData.status_id ?? '',
      notes: initialData.notes ?? '',
    };
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!values.company.trim()) next.company = 'Company is required';
    if (!values.role.trim()) next.role = 'Role is required';
    if (!values.date_applied) next.date_applied = 'Date applied is required';
    if (!values.status_id) next.status_id = 'Status is required';
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});
    onSubmit({
      company: values.company.trim(),
      role: values.role.trim(),
      date_applied: values.date_applied,
      // The select gives a string; the API and DB expect a number.
      status_id: Number(values.status_id),
      // Send null rather than an empty string when notes are blank.
      notes: values.notes.trim() === '' ? null : values.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-ink">
          {isEditing ? 'Edit application' : 'Add application'}
        </h2>
        <p className="mt-0.5 text-sm text-muted">
          {isEditing
            ? 'Update the details for this application.'
            : 'Log a job you have applied to.'}
        </p>
      </div>

      <Field label="Company" error={errors.company}>
        <input
          name="company"
          type="text"
          value={values.company}
          onChange={handleChange}
          placeholder="e.g. Google"
          className={inputClass(errors.company)}
        />
      </Field>

      <Field label="Role" error={errors.role}>
        <input
          name="role"
          type="text"
          value={values.role}
          onChange={handleChange}
          placeholder="e.g. Machine Learning Intern"
          className={inputClass(errors.role)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Date applied" error={errors.date_applied}>
          <input
            name="date_applied"
            type="date"
            value={values.date_applied}
            onChange={handleChange}
            className={inputClass(errors.date_applied)}
          />
        </Field>

        <Field label="Status" error={errors.status_id}>
          <select
            name="status_id"
            value={values.status_id}
            onChange={handleChange}
            className={inputClass(errors.status_id)}
          >
            <option value="" disabled>
              Select a status
            </option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes" optional>
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Anything worth remembering — referral, contact, next step…"
          className={`${inputClass(null)} resize-y`}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-ink-soft hover:bg-paper disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting
            ? 'Saving…'
            : isEditing
              ? 'Save changes'
              : 'Add application'}
        </button>
      </div>
    </form>
  );
}

// Local helpers — they exist only to keep the markup above readable, so there's
// no reason to give them their own files.
function Field({ label, error, optional = false, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="text-xs font-normal text-muted">Optional</span>
        )}
      </span>
      {children}
      {error && <span className="text-xs text-rejected-fg">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  const base =
    'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/15';
  return error
    ? `${base} border-rejected-fg/50`
    : `${base} border-line focus:border-ink/30`;
}