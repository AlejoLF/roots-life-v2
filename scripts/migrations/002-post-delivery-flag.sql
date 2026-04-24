-- Migración 002: flag para evitar doble envío del email post-entrega
-- Ejecutar en Supabase SQL Editor.

alter table public.orders
  add column if not exists post_delivery_email_sent_at timestamptz;
