-- ============================================================================
-- SEGURIDAD: solo el administrador registrado puede escribir.
-- ANTES de ejecutar esto: en Supabase → Authentication → Sign In / Providers
-- desactiva "Allow new users to sign up".
-- Es idempotente: se puede ejecutar más de una vez.
-- ============================================================================

-- 1) Lista de administradores. RLS activada y SIN políticas: la API pública no puede leerla ni escribirla.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

-- 2) ¿El usuario actual es administrador? (security definer: lee "admins" aunque la API no pueda)
create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to authenticated;

-- 3) Registrar al administrador (REEMPLAZA TU_CORREO_DE_ADMIN@ejemplo.com por el correo de tu usuario administrador)
insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('TU_CORREO_DE_ADMIN@ejemplo.com')
on conflict do nothing;

-- Seguro anti-bloqueo: si no se encontró al administrador, se cancela TODO y no se toca nada.
do $$
begin
  if not exists (select 1 from public.admins) then
    raise exception 'No se encontró al administrador en auth.users. Revisa el correo del paso 3.';
  end if;
end $$;

-- 4) Escritura solo para administradores (reemplaza las políticas "cualquier autenticado")
drop policy if exists "categorias admin escritura"    on public.categorias;
drop policy if exists "productos admin escritura"     on public.productos;
drop policy if exists "productos admin lectura"       on public.productos;
drop policy if exists "configuracion admin escritura" on public.configuracion;

create policy "categorias admin escritura" on public.categorias
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "productos admin lectura" on public.productos
  for select to authenticated using (public.es_admin());
create policy "productos admin escritura" on public.productos
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy "configuracion admin escritura" on public.configuracion
  for update to authenticated using (public.es_admin()) with check (public.es_admin());

-- 5) Fotos: el público sigue viendo las fotos por su URL, pero ya no puede LISTAR el bucket.
drop policy if exists "fotos lectura publica" on storage.objects;
drop policy if exists "fotos admin escritura" on storage.objects;
create policy "fotos admin escritura" on storage.objects
  for all to authenticated
  using (bucket_id = 'productos' and public.es_admin())
  with check (bucket_id = 'productos' and public.es_admin());

-- Solo imágenes y de hasta 5 MB
update storage.buckets
   set file_size_limit = 5242880,
       allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png']
 where id = 'productos';

-- 6) Restricciones de datos (defensa en profundidad: la base rechaza valores absurdos aunque falle la app)
do $$ begin
  alter table public.productos add constraint productos_largos
    check (char_length(nombre) between 1 and 120 and (descripcion is null or char_length(descripcion) <= 300));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.productos add constraint productos_urls_https
    check ((imagen_url is null or imagen_url ~* '^https://')
           and array_to_string(imagenes, ' ') !~* '(^|\s)(javascript|data|http):');
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.configuracion add constraint configuracion_largos
    check (char_length(titular_hero) <= 120 and char_length(anuncio) <= 200 and char_length(mensaje_base) <= 300
           and char_length(direccion) <= 200 and char_length(horario) <= 100 and char_length(ciudad) <= 80);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.configuracion add constraint configuracion_urls_https
    check ((mapa_url = '' or mapa_url ~* '^https://') and (foto_creador = '' or foto_creador ~* '^https://'));
exception when duplicate_object then null; end $$;
