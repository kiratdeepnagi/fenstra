-- =====================================================================
-- Fenstra · Window & Door Design Pro UK
-- Supabase schema · run this in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================================

-- ---------- PROFILES (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  company_name text,
  role text not null default 'customer' check (role in ('customer','staff','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  product text not null,
  style text not null,
  material text not null,
  width integer not null,
  height integer not null,
  colour text not null,
  glazing text not null,
  hardware text not null,
  price integer not null default 0,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- ENQUIRIES ----------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- SURVEYS ----------
create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  survey_date date not null,
  survey_time time not null,
  address text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- AUTO-CREATE PROFILE ON SIGNUP ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- ROLE HELPER (security definer avoids RLS recursion) ----------
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ---------- ENABLE RLS ----------
alter table public.profiles  enable row level security;
alter table public.projects  enable row level security;
alter table public.enquiries enable row level security;
alter table public.surveys   enable row level security;

-- ---------- PROFILES POLICIES ----------
drop policy if exists "profiles_select_own"   on public.profiles;
drop policy if exists "profiles_select_staff" on public.profiles;
drop policy if exists "profiles_update_own"   on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
drop policy if exists "profiles_insert_self"  on public.profiles;

create policy "profiles_select_own"   on public.profiles for select using (id = auth.uid());
create policy "profiles_select_staff" on public.profiles for select using (public.current_user_role() in ('staff','admin'));
create policy "profiles_insert_self"  on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own"   on public.profiles for update using (id = auth.uid());
create policy "profiles_update_admin" on public.profiles for update using (public.current_user_role() = 'admin');

-- ---------- PROJECTS POLICIES ----------
drop policy if exists "projects_select" on public.projects;
drop policy if exists "projects_insert" on public.projects;
drop policy if exists "projects_update" on public.projects;
drop policy if exists "projects_delete" on public.projects;

create policy "projects_select" on public.projects for select using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);
create policy "projects_insert" on public.projects for insert with check (user_id = auth.uid());
create policy "projects_update" on public.projects for update using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);
create policy "projects_delete" on public.projects for delete using (
  user_id = auth.uid() or public.current_user_role() = 'admin'
);

-- ---------- ENQUIRIES POLICIES ----------
drop policy if exists "enquiries_select" on public.enquiries;
drop policy if exists "enquiries_insert" on public.enquiries;
drop policy if exists "enquiries_update" on public.enquiries;

create policy "enquiries_select" on public.enquiries for select using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);
create policy "enquiries_insert" on public.enquiries for insert with check (user_id = auth.uid());
create policy "enquiries_update" on public.enquiries for update using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);

-- ---------- SURVEYS POLICIES ----------
drop policy if exists "surveys_select" on public.surveys;
drop policy if exists "surveys_insert" on public.surveys;
drop policy if exists "surveys_update" on public.surveys;

create policy "surveys_select" on public.surveys for select using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);
create policy "surveys_insert" on public.surveys for insert with check (user_id = auth.uid());
create policy "surveys_update" on public.surveys for update using (
  user_id = auth.uid() or public.current_user_role() in ('staff','admin')
);

-- ---------- UPDATED_AT TRIGGERS ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- =====================================================================
-- DONE. To promote a user to admin or staff, run:
--   update public.profiles set role = 'admin' where email = 'you@yours.co.uk';
-- =====================================================================
