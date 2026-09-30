-- Foto del creador que se muestra en la portada de la landing (se administra desde Perfil).
alter table public.configuracion
  add column if not exists foto_creador text not null default '';
