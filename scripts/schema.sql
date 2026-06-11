DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS statuses;

CREATE TABLE statuses (
  id    SERIAL PRIMARY KEY,
  label TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id           SERIAL PRIMARY KEY,
  company      TEXT NOT NULL,
  role         TEXT NOT NULL,
  date_applied DATE NOT NULL,
  status_id    INTEGER NOT NULL REFERENCES statuses(id),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);