-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  display_name text,
  email text,
  subscription_status text default 'free',
  trial_ends_at timestamptz,
  free_sessions_used integer default 0
);

-- Create sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text,
  context jsonb default '{}'::jsonb
);

-- Create messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role text check (role in ('user','assistant','system')) not null,
  content text not null,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- Create favorites table
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id uuid references sessions(id) on delete cascade,
  title text not null,
  summary text,
  created_at timestamptz default now()
);

-- Create usage analytics table (anonymized)
create table usage_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index idx_sessions_user_id on sessions(user_id);
create index idx_messages_session_id on messages(session_id);
create index idx_favorites_user_id on favorites(user_id);
create index idx_analytics_user_id on usage_analytics(user_id);
create index idx_analytics_event_type on usage_analytics(event_type);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_sessions_updated_at before update on sessions
  for each row execute function update_updated_at_column();
