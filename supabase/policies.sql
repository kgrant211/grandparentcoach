-- Enable Row Level Security
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table favorites enable row level security;
alter table usage_analytics enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Sessions policies
create policy "Users can view own sessions" on sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions" on sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete own sessions" on sessions
  for delete using (auth.uid() = user_id);

-- Messages policies
create policy "Users can view messages from own sessions" on messages
  for select using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

create policy "Users can insert messages to own sessions" on messages
  for insert with check (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

create policy "Users can update messages in own sessions" on messages
  for update using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

create policy "Users can delete messages from own sessions" on messages
  for delete using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

-- Favorites policies
create policy "Users can view own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert own favorites" on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can update own favorites" on favorites
  for update using (auth.uid() = user_id);

create policy "Users can delete own favorites" on favorites
  for delete using (auth.uid() = user_id);

-- Usage analytics policies
create policy "Users can insert own analytics" on usage_analytics
  for insert with check (auth.uid() = user_id);

create policy "Users can view own analytics" on usage_analytics
  for select using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
