# ISEVEN — landing comercial + panel admin

Landing page para una importadora (ropa, zapatillas, iPhones) donde las ventas se cierran por WhatsApp, y un panel privado para administrar el catálogo.

| Carpeta | Qué es |
|---|---|
| [`landing/`](landing) | Landing pública en Angular 22 + Tailwind 4 (prerender estático). Lee los productos visibles y la configuración desde Supabase. |
| [`admin/`](admin) | Panel del administrador en Angular 22 + Angular Material + Tailwind 4. Productos, categorías, fotos, configuración del sitio y perfil. |
| [`bocetos/`](bocetos) | Bocetos HTML del diseño aprobado. |
| [`landing/supabase/`](landing/supabase) | SQL: esquema, datos de ejemplo y migraciones (incluida la de seguridad). |

## Puesta en marcha
1. Crea un proyecto en [Supabase](https://supabase.com) y ejecuta en el SQL Editor, en orden: `schema.sql`, `seed.sql`, `migracion-01…`, `migracion-02…` y `migracion-03-seguridad.sql` (cambia el correo del administrador antes).
2. Crea el usuario administrador en *Authentication → Users* y desactiva *Allow new users to sign up*.
3. Pon la URL y la clave **publicable** de tu proyecto en `landing/src/environments/environment.ts`, `admin/src/environments/environment.ts` y `admin/src/environments/environment.prod.ts`.
4. En cada carpeta: `npm install` y `npm start` (landing en el puerto 4200; admin: `npm start -- --port 4300`).

Tests: `npx ng test --watch=false` en cada carpeta.

## Seguridad
- El frontend solo usa la clave **publicable** de Supabase; la protección real son las políticas RLS (`landing/supabase/migracion-03-seguridad.sql`): el público solo lee lo publicado y solo el administrador registrado puede escribir.
- Nunca subas la clave `secret`/`service_role` ni archivos `.env`.

## Publicación
Dos proyectos en Vercel con el mismo repositorio: uno con *Root Directory* `landing` y otro con `admin` (cada uno trae su `vercel.json`). Usa Node 24.x.
