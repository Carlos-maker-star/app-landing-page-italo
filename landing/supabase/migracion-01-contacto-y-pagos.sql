-- Añade a "configuracion" los datos de contacto, redes y pagos que el admin editará y la landing mostrará.
alter table public.configuracion
  add column if not exists instagram    text   not null default '',
  add column if not exists tiktok       text   not null default '',
  add column if not exists facebook     text   not null default '',
  add column if not exists correo       text   not null default '',
  add column if not exists direccion    text   not null default '',
  add column if not exists mapa_url     text   not null default '',
  add column if not exists anuncio      text   not null default '',
  add column if not exists adelanto_pct int    not null default 50 check (adelanto_pct between 0 and 100),
  add column if not exists metodos_pago text[] not null default '{}';

update public.configuracion
   set horario      = case when horario = '' then 'Lun–Sáb · 9:00–20:00' else horario end,
       metodos_pago = case when metodos_pago = '{}' then array['Yape','Plin','Transferencia bancaria','Efectivo'] else metodos_pago end
 where id = 1;
