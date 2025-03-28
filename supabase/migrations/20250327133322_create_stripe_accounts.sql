-- Create the stripe_accounts table
create table public.stripe_accounts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    connected boolean default false not null,
    stripe_account_id text,
    stripe_customer_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index stripe_accounts_user_id_idx on public.stripe_accounts(user_id);

-- Set up RLS (Row Level Security)
alter table public.stripe_accounts enable row level security;

-- Create policies
create policy "Users can view their own stripe account"
    on public.stripe_accounts for select
    using (auth.uid() = user_id);

create policy "Users can update their own stripe account"
    on public.stripe_accounts for update
    using (auth.uid() = user_id);

create policy "Users can insert their own stripe account"
    on public.stripe_accounts for insert
    with check (auth.uid() = user_id);

-- Function to automatically set updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger handle_updated_at
    before update on public.stripe_accounts
    for each row
    execute procedure public.handle_updated_at();

-- Insert a function to ensure one account per user
create or replace function public.handle_new_stripe_account()
returns trigger as $$
begin
    if exists (
        select 1 from public.stripe_accounts
        where user_id = new.user_id
    ) then
        return null;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger ensure_single_stripe_account
    before insert on public.stripe_accounts
    for each row
    execute procedure public.handle_new_stripe_account();
