-- Datos de ejemplo para ver la landing con contenido. Ejecutar DESPUÉS de schema.sql.
insert into public.categorias (nombre, orden) values
  ('Zapatillas', 1), ('Ropa', 2), ('iPhones', 3)
on conflict (nombre) do nothing;

insert into public.productos (nombre, categoria_id, precio, moneda, etiqueta, visible, orden)
select v.nombre, c.id, v.precio, 'USD', v.etiqueta, true, v.orden
from (values
  ('Nike Air Max 90',      'Zapatillas', 189,  'Nuevo',            1),
  ('iPhone 15 Pro 256GB',  'iPhones',    1199, 'Por encargo',      2),
  ('Hoodie Essentials',    'Ropa',       79,   null,               3),
  ('Jordan 1 Retro High',  'Zapatillas', 249,  'Últimas unidades', 4),
  ('iPhone 14 128GB',      'iPhones',    799,  null,               5),
  ('Polo Ralph Lauren',    'Ropa',       59,   'Nuevo',            6),
  ('Adidas Samba OG',      'Zapatillas', 139,  null,               7),
  ('AirPods Pro 2',        'iPhones',    229,  'Nuevo',            8)
) as v(nombre, categoria, precio, etiqueta, orden)
join public.categorias c on c.nombre = v.categoria;

-- Reemplaza por el número real (solo dígitos, con código de país) y la ciudad:
update public.configuracion
   set whatsapp = '', ciudad = '', mensaje_base = 'Hola ISEVEN, me interesa {producto}. ¿Está disponible?'
 where id = 1;
