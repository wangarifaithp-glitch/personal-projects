create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  subject text not null default '',
  description text not null default '',
  due_date date not null,
  priority text not null default 'Medium',
  completed boolean not null default false,
  review_status text not null default 'Pending',
  created_at timestamptz not null default now(),
  constraint assignments_title_length check (char_length(title) between 1 and 100),
  constraint assignments_title_trimmed check (title ~ '^\S(?:.*\S)?$'),
  constraint assignments_subject_length check (char_length(subject) <= 80),
  constraint assignments_description_length check (char_length(description) <= 1000),
  constraint assignments_priority check (priority in ('Low', 'Medium', 'High')),
  constraint assignments_review_status check (review_status in ('Pending', 'Approved', 'Redo', 'Rejected'))
);

alter table public.assignments
  add column if not exists review_status text not null default 'Pending';

alter table public.assignments
  drop constraint if exists assignments_review_status;

alter table public.assignments
  add constraint assignments_review_status
  check (review_status in ('Pending', 'Approved', 'Redo', 'Rejected'));

create index if not exists assignments_user_created_idx
  on public.assignments (user_id, created_at desc);

alter table public.assignments enable row level security;

drop policy if exists "Students can read their assignments" on public.assignments;
create policy "Students can read their assignments"
  on public.assignments for select
  using ((select auth.uid()) = user_id);

drop policy if exists "Students can create their assignments" on public.assignments;
create policy "Students can create their assignments"
  on public.assignments for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students can update their assignments" on public.assignments;
create policy "Students can update their assignments"
  on public.assignments for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Students can delete their assignments" on public.assignments;
create policy "Students can delete their assignments"
  on public.assignments for delete
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.assignments to authenticated;

drop trigger if exists assignments_validate_insert_due_date on public.assignments;
drop function if exists public.reject_past_assignment_due_date();
