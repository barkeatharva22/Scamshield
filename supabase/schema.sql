-- ScamShield database schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now()
);

-- Scam pattern reference categories (seeded, shared across users)
create table if not exists scam_patterns (
  id uuid primary key default uuid_generate_v4(),
  category text not null,           -- e.g. 'kyc_update', 'parcel_delivery', 'lottery_prize', 'bank_alert', 'job_scam'
  description text not null,
  common_signals text[] not null,   -- e.g. {'urgent language', 'fake domain', 'OTP request'}
  created_at timestamptz default now()
);

-- Individual scan records
create table if not exists scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  image_url text,                          -- storage path to the uploaded screenshot
  extracted_text text,                     -- raw text Groq Vision read from the screenshot
  sender_info text,
  verdict text not null check (verdict in ('scam', 'suspicious', 'genuine')),
  confidence numeric check (confidence >= 0 and confidence <= 100),
  category text,                           -- matched scam_patterns.category, if flagged
  reasoning text not null,                 -- plain-language explanation of the verdict
  flagged_signals text[],                  -- specific things that gave it away
  created_at timestamptz default now()
);

-- Community-reported scam numbers/links (optional shared layer)
create table if not exists community_reports (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references scans(id) on delete cascade,
  reported_identifier text,                -- phone number, domain, or UPI ID seen in the scam
  category text,
  confirmations int default 1,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table scans enable row level security;
alter table community_reports enable row level security;
alter table scam_patterns enable row level security;

-- Profiles: users can only see/edit their own profile
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

-- Scans: users can only CRUD their own scans
create policy "scans_select_own" on scans for select using (auth.uid() = user_id);
create policy "scans_insert_own" on scans for insert with check (auth.uid() = user_id);
create policy "scans_update_own" on scans for update using (auth.uid() = user_id);
create policy "scans_delete_own" on scans for delete using (auth.uid() = user_id);

-- Scam patterns: readable by any authenticated user (shared reference data)
create policy "scam_patterns_select_all" on scam_patterns for select using (auth.role() = 'authenticated');

-- Community reports: readable by any authenticated user, insertable by any authenticated user
create policy "community_reports_select_all" on community_reports for select using (auth.role() = 'authenticated');
create policy "community_reports_insert_auth" on community_reports for insert with check (auth.role() = 'authenticated');

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed common scam patterns
insert into scam_patterns (category, description, common_signals) values
  ('kyc_update', 'Fake message claiming your bank/KYC needs urgent update', array['urgent deadline', 'suspicious domain', 'OTP request', 'bank name spelled unusually']),
  ('parcel_delivery', 'Fake courier message asking for a small "release" payment', array['small unexpected fee', 'shortened/unusual link', 'unclear courier name']),
  ('lottery_prize', 'Claims you won a prize or lottery you never entered', array['unexpected winnings', 'request for processing fee', 'too-good-to-be-true amount']),
  ('bank_alert', 'Fake bank alert about a blocked account or suspicious transaction', array['fake bank domain', 'request for OTP/PIN', 'urgent account block threat']),
  ('job_scam', 'Fake job offer requesting payment or personal documents upfront', array['payment for job guarantee', 'vague company details', 'too-high salary for minimal work'])
on conflict do nothing;

-- Storage bucket for scan screenshots (run in Supabase dashboard Storage section, or via SQL if using storage schema)
-- insert into storage.buckets (id, name, public) values ('scan-images', 'scan-images', false);
