-- ═══════════════════════════════════════════════════════════════════
-- ROOTS LIFE — Schema inicial de Supabase
-- Copiá y pegá todo este archivo en:
-- Supabase Dashboard → SQL Editor → New query → Run
-- Es idempotente: se puede correr varias veces sin romper nada.
-- ═══════════════════════════════════════════════════════════════════

-- Extensión necesaria para UUIDs
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────
-- USERS — registro de usuarios del sitio
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  hashed_password text,  -- null para usuarios que entran solo por OAuth
  name text,
  image text,
  email_verified timestamptz,
  newsletter_opt_in boolean default false,
  terms_accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists users_email_idx on public.users (email);

-- ───────────────────────────────────────────────────────────────────
-- ACCOUNTS — OAuth providers linkeados a un user (Google, Facebook)
-- Schema compatible con Auth.js v5
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  created_at timestamptz default now(),
  unique(provider, provider_account_id)
);

create index if not exists accounts_user_id_idx on public.accounts (user_id);

-- ───────────────────────────────────────────────────────────────────
-- SESSIONS — para usuarios con sesión por DB (no JWT)
-- Opcional pero útil si más adelante querés invalidar sesiones por admin
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_token text unique not null,
  expires timestamptz not null,
  created_at timestamptz default now()
);

create index if not exists sessions_user_id_idx on public.sessions (user_id);
create index if not exists sessions_token_idx on public.sessions (session_token);

-- ───────────────────────────────────────────────────────────────────
-- VERIFICATION TOKENS — para verificación de email + recupero de contraseña
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.verification_tokens (
  identifier text not null,
  token text unique not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

-- ───────────────────────────────────────────────────────────────────
-- ORDERS — pedidos de compra (para fase 4)
-- ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),

  -- Relación a usuario (null = guest checkout)
  user_id uuid references public.users(id) on delete set null,
  guest_email text,
  guest_name text,
  guest_phone text,

  -- Tracking público
  tracking_token text unique not null default encode(gen_random_bytes(16), 'hex'),

  -- MercadoPago refs
  mp_preference_id text,
  mp_payment_id text,
  mp_shipping_id text,

  -- Estado del pedido
  status text not null default 'pending',
  -- pending | paid | preparing | shipped | in_transit | delivered | cancelled | refunded

  -- Contenido del pedido (snapshot al momento de compra)
  items jsonb not null,

  -- Envío
  shipping_address jsonb,
  shipping_method text,
  tracking_code text,

  -- Números
  subtotal numeric(12,2) not null,
  shipping_cost numeric(12,2) default 0,
  discount numeric(12,2) default 0,
  discount_code text,
  total numeric(12,2) not null,

  -- Timestamps del ciclo
  created_at timestamptz default now(),
  paid_at timestamptz,
  preparing_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,

  -- Flag para vencimiento del token de tracking (7 días post-entrega)
  tracking_expires_at timestamptz
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_tracking_token_idx on public.orders (tracking_token);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_mp_payment_id_idx on public.orders (mp_payment_id);

-- ───────────────────────────────────────────────────────────────────
-- FUNCTION — trigger para mantener updated_at automático en users
-- ───────────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- ───────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Los endpoints del servidor usan service_role_key (bypass RLS).
-- Desde el cliente solo se accede vía anon_key, con las siguientes policies.
-- ───────────────────────────────────────────────────────────────────

alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.sessions enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.orders enable row level security;

-- Users: cada uno puede leer/actualizar solo su propio registro
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Accounts: cada uno ve solo sus propias cuentas OAuth
drop policy if exists "accounts_select_own" on public.accounts;
create policy "accounts_select_own" on public.accounts
  for select using (auth.uid() = user_id);

-- Orders: cada usuario ve solo sus propias órdenes
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- FIN DEL SCHEMA
-- ═══════════════════════════════════════════════════════════════════
