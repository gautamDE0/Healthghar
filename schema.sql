-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create User Roles Enum
create type user_role as enum ('user', 'doctor', 'admin');

-- 1. Profiles Table (Public User Data)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  age int,
  phone text,
  address text,
  role user_role default 'user' not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles Policies
-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can read all profiles (We will handle Admin RLS slightly differently since they use custom auth header or we just make RLS open for them if they were in auth.users, but here Admin is separate. 
-- Actually, the user wants Admin to be manually added. 
-- Requirement: "Admin has full access". 
-- Since Admin login is custom (not Supabase Auth), Admin will likely interact via a Service Role client or we need a way to identify them. 
-- HOWEVER, user said: "Admin logs in using: Username, Password... Stored manually by me in Supabase... Not connected to Google OAuth". 
-- If we use Service Role key for Admin actions on the server-side, we bypass RLS. This is the standard way for "Custom Admin" in Supabase if they aren't in `auth.users`.
-- So RLS policies here mainly protect against Standard Users and Doctors.

-- Doctors can read profiles of users who booked them? (Later)

-- 2. Doctors Table (Whitelist / Reference)
create table public.doctors (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text not null,
  created_by text, -- could be admin username
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.doctors enable row level security;

-- Policies for Doctors table
-- Public read? Or only Authenticated? Let's say Authenticated can read (to book them).
create policy "Authenticated users can view doctors"
  on public.doctors for select
  to authenticated
  using (true);

-- Only Admin can insert/update/delete (Handled via Service Role or specific logic)

-- 3. Admin Users Table (Custom Auth)
create table public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz default now() not null
);

-- RLS: No one can read this table via API (Service Role only)
alter table public.admin_users enable row level security;


-- 4. Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_doctor boolean;
begin
  -- Check if email exists in doctors table
  select exists(select 1 from public.doctors where email = new.email) into is_doctor;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    -- Google sometimes uses 'name', sometimes 'full_name'. Fallback to email if missing.
    coalesce(
        new.raw_user_meta_data->>'full_name', 
        new.raw_user_meta_data->>'name', 
        new.email
    ),
    case when is_doctor then 'doctor'::public.user_role else 'user'::public.user_role end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- OPTIONAL: Bookings Table (Implied by requirements)
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete cascade not null,
  appointment_date timestamptz,
  status text default 'pending', -- pending, confirmed, cancelled
  created_at timestamptz default now() not null
);

alter table public.bookings enable row level security;

-- Bookings Policies
create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Doctors can view bookings assigned to them.
-- But wait, `doctor_id` in bookings refers to `doctors` table id. 
-- The Doctor *User* has an entry in `profiles`. The `doctors` table is a whitelist.
-- We need to link the `auth.users` Doctor to the `doctors` table entry to check permission?
-- OR, we rely on `profiles.role = 'doctor'`.
-- But which doctor are they?
-- The `doctors` table has `email`. The `profiles` table has `email`. They match.
-- So we can join or check email.
create policy "Doctors can view assigned bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() 
      and role = 'doctor' 
      and email = (select email from public.doctors where id = bookings.doctor_id)
    )
  );
