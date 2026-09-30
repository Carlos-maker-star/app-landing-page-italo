-- Esquema base para landing comercial con catálogo administrable.
-- Ejecutar en Supabase > SQL Editor. Adaptar categorías y campos al negocio.

create table if not exists public.categorias (
  id          bigint generated always as identity primary key,
  nombre      text not null unique,
  orden       int  not null default 0
);

create table if not exists public.productos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text,
  categoria_id bigint references public.categorias(id) on delete set null,
  precio      numeric(12,2) not null check (precio >= 0),
  moneda      text not null default 'USD',
  etiqueta    text check (etiqueta in ('Nuevo','Últimas unidades','Por encargo')),
  imagen_url  text,
  imagenes    text[] not null default '{}',
  visible     boolean not null default false,
  agotado     boolean not null default false,
  orden       int not null default 0,
  creado_en   timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists productos_visibles_idx
  on public.productos (orden) where visible;

-- Una sola fila de configuración del sitio
create table if not exists public.configuracion (
  id              int primary key default 1 check (id = 1),
  whatsapp        text not null default '',
  mensaje_base    text not null default 'Hola, me interesa {producto}. ¿Está disponible?',
  titular_hero    text not null default '',
  ciudad          text not null default '',
  horario         text not null default '',
  max_visibles    int  not null default 12 check (max_visibles between 1 and 48),
  instagram       text not null default '',
  tiktok          text not null default '',
  facebook        text not null default '',
  correo          text not null default '',
  direccion       text not null default '',
  mapa_url        text not null default '',
  anuncio         text not null default '',
  adelanto_pct    int  not null default 50 check (adelanto_pct between 0 and 100),
  metodos_pago    text[] not null default '{}',
  foto_creador    text not null default ''
);
insert into public.configuracion (id) values (1) on conflict do nothing;

-- actualizado_en automático
create or replace function public.tocar_actualizado() returns trigger
language plpgsql as $$ begin new.actualizado_en = now(); return new; end $$;
drop trigger if exists productos_tocar on public.productos;
create trigger productos_tocar before update on public.productos
  for each row execute function public.tocar_actualizado();

-- Seguridad (RLS): lectura pública solo de lo publicado; escritura solo autenticados
alter table public.categorias    enable row level security;
alter table public.productos     enable row level security;
alter table public.configuracion enable row level security;

create policy "categorias lectura publica" on public.categorias
  for select to anon, authenticated using (true);
create policy "productos visibles publicos" on public.productos
  for select to anon using (visible = true);
create policy "productos admin lectura" on public.productos
  for select to authenticated using (true);
create policy "configuracion lectura publica" on public.configuracion
  for select to anon, authenticated using (true);

create policy "categorias admin escritura" on public.categorias
  for all to authenticated using (true) with check (true);
create policy "productos admin escritura" on public.productos
  for all to authenticated using (true) with check (true);
create policy "configuracion admin escritura" on public.configuracion
  for update to authenticated using (true) with check (true);

-- Bucket público de fotos (lectura pública, subida solo autenticados)
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "fotos lectura publica" on storage.objects
  for select to anon, authenticated using (bucket_id = 'productos');
create policy "fotos admin escritura" on storage.objects
  for all to authenticated
  using (bucket_id = 'productos') with check (bucket_id = 'productos');

-- Con un solo administrador: crear ese usuario en Authentication y desactivar
-- "Allow new users to sign up" para que nadie más pueda registrarse.
