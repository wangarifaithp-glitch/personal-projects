# StudyTrack — Student Assignment Tracker

A responsive assignment planner built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons. It works without a backend using this browser's local storage. Optionally connect Supabase for student accounts and per-user cloud storage.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. No credentials are needed for local demo mode. Assignments remain in the current browser after refresh, but are not synced to other browsers or devices. Avoid clearing browser site data if you need to keep local assignments.

Create a production build with `npm run build`; preview it using `npm run preview`.

## Test on a phone

Connect the phone and computer to the same Wi-Fi network. Run:

```sh
npm run dev -- --host 0.0.0.0
```

Open `http://<computer-lan-ip>:5173` on the phone. Allow Vite through the computer's firewall for the private network if prompted. The browser and computer must remain on the same network.

## Features

- Create, edit, complete/reopen, and confirm deletion of assignments.
- Required title, subject, description, due date, and priority validation, date and text length checks, and duplicate-save prevention.
- Read-only review status labels (Pending, Approved, Redo, and Rejected); new assignments start as Pending until a teacher/reviewer workflow is added.
- Local-calendar deadline calculations, past-due assignment tracking, status and priority filters, title/subject search, and four sort modes.
- Dashboard totals, upcoming deadlines, completed and overdue views.
- Responsive mobile and desktop layouts, light/dark themes, accessible form labels and keyboard focus.
- Corrupt local data is ignored with a visible warning; storage and network failures are reported.

Browser/background notifications are not implemented. Upcoming and overdue assignments are highlighted only while the application is open.

## Enable Supabase cloud mode

1. Create a Supabase project.
2. In the Supabase SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql). The table includes database constraints and row-level security policies that limit every operation to the signed-in student's user ID. Re-run this script on an existing project to remove the old restriction against creating assignments with past due dates and add the review-status column.
3. In Supabase Authentication settings, enable email/password sign-in and configure the site's allowed redirect URLs (for local development, include `http://localhost:5173`).
4. Copy `.env.example` to `.env.local` and set:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

   Use only the project's public/anon client key in frontend environment variables. Never put a service-role key in this app.
5. Restart the Vite development server after changing environment variables.

When both values are present, StudyTrack switches to Supabase registration/login and cloud storage. If either is missing, it runs in local demo mode. Cloud mode is not active until configured with a real project, and is not verified by this repository alone. Local and cloud data are separate; switching modes does not migrate records.

## Validation

Run `npm run build` to type-check and produce the production bundle.
