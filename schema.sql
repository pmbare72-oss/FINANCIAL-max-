-- Financial Max production schema foundation
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  currency text not null default 'KES',
  created_at timestamptz not null default now()
);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  opening_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  type text not null check (type in ('income','expense','transfer')),
  amount numeric(14,2) not null check (amount >= 0),
  category text,
  description text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14,2) not null check (target_amount > 0),
  current_amount numeric(14,2) not null default 0,
  deadline date,
  priority integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  asset_type text not null,
  amount_invested numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  units numeric(20,8),
  purchase_price numeric(14,4),
  current_price numeric(14,4),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table goals enable row level security;
alter table investments enable row level security;

create policy "own profiles" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own accounts" on accounts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own transactions" on transactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own goals" on goals for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own investments" on investments for all using (user_id = auth.uid()) with check (user_id = auth.uid());
