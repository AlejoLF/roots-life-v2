-- Migración 001: Códigos de descuento de bienvenida únicos por usuario
-- Ejecutar en Supabase SQL Editor.

alter table public.users
  add column if not exists welcome_code text unique,
  add column if not exists welcome_code_used_at timestamptz;

create index if not exists users_welcome_code_idx on public.users (welcome_code);
