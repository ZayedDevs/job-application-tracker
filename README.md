# Job Application Tracker

A web app for logging and tracking job applications through their lifecycle —
from first applied, through interviews, to an offer, rejection, or withdrawal.
Each application records its company, role, date, status, and notes, and a live
dashboard shows how many applications sit in each stage.

Built with Next.js (App Router) and PostgreSQL.

## Features

- Add, edit, and delete job applications
- Five-stage status workflow: Applied → Interview Scheduled → Offer Received → Rejected → Withdrawn
- Change an application's status inline, directly from the table
- Dashboard with live per-status counts that update as the data changes

## Tech Stack

- **Next.js (App Router)** — UI and API (Route Handlers)
- **PostgreSQL** — data storage, accessed with raw parameterized SQL via `node-postgres` (`pg`)
- **Tailwind CSS** — styling

No ORM is used: queries are written as plain SQL so the data layer stays explicit
and easy to read. Every query is parameterized to guard against SQL injection.

## Prerequisites

- **Node.js** 18 or newer (developed on v20)
- **PostgreSQL** 14 or newer (developed on v18)

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd job-application-tracker
npm install
```

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE job_application_tracker;"
```

### 3. Configure environment variables

Copy the example file and fill in your local PostgreSQL credentials:

```bash
# macOS / Linux
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

Then open `.env.local` and set your connection string:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/job_application_tracker
```

### 4. Create the tables and seed the statuses

```bash
npm run db:migrate   # creates the tables
npm run db:seed      # inserts the five application statuses
```

### 5. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the development server       |
| `npm run build`      | Build for production               |
| `npm run start`      | Run the production build           |
| `npm run db:migrate` | Create the database tables         |
| `npm run db:seed`    | Seed the five application statuses |

## Database Schema

**`statuses`** — the fixed set of application stages.

| Column  | Type   | Notes              |
| ------- | ------ | ------------------ |
| `id`    | SERIAL | Primary key        |
| `label` | TEXT   | Unique status name |

**`applications`** — one row per job application.

| Column         | Type        | Notes                                 |
| -------------- | ----------- | ------------------------------------- |
| `id`           | SERIAL      | Primary key                           |
| `company`      | TEXT        | Required                              |
| `role`         | TEXT        | Required                              |
| `date_applied` | DATE        | Required                              |
| `status_id`    | INTEGER     | Required, foreign key → `statuses.id` |
| `notes`        | TEXT        | Optional                              |
| `created_at`   | TIMESTAMPTZ | Defaults to the current time          |

`status_id` is a foreign key into `statuses`, so the database itself guarantees
every application has a valid status.

## API Routes

| Method   | Route                   | Description                 |
| -------- | ----------------------- | --------------------------- |
| `GET`    | `/api/applications`     | List all applications       |
| `POST`   | `/api/applications`     | Create an application       |
| `GET`    | `/api/applications/:id` | Get a single application    |
| `PUT`    | `/api/applications/:id` | Update an application       |
| `DELETE` | `/api/applications/:id` | Delete an application       |
| `GET`    | `/api/statuses`         | List the available statuses |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── applications/
│   │   │   ├── route.js           # GET (list), POST
│   │   │   └── [id]/route.js       # GET, PUT, DELETE
│   │   └── statuses/route.js       # GET
│   ├── page.js                     # main page — state, data fetching, layout
│   └── globals.css                 # design tokens and base styles
├── components/
│   ├── ApplicationTable.js
│   ├── ApplicationForm.js
│   ├── StatusBadge.js
│   ├── StatusSelect.js
│   ├── DashboardSummary.js
│   └── Modal.js
└── lib/
    ├── db.js                       # PostgreSQL connection pool
    └── statusStyles.js             # shared status colour map

scripts/
├── schema.sql                      # table definitions
├── migrate.mjs                     # runs schema.sql
└── seed.mjs                        # seeds the statuses
```

## Implementation Notes

- **Raw parameterized SQL, no ORM.** With only two tables, plain `pg` keeps the
  data layer transparent; every value is passed as a query parameter, never
  string-concatenated.
- **The UI re-fetches after each change** rather than patching local state, so
  the table and dashboard always reflect the actual database.
- **Statuses live in their own table** and are seeded once, giving the app a
  single source of truth that the form and dashboard both read from.
