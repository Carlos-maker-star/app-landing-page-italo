# ISEVEN — landing + panel admin

Dos apps Angular 22 que comparten un proyecto de Supabase (tablas `categorias`, `productos`, `configuracion` y bucket público `productos`).

| Carpeta | Qué es | Puerto dev |
|---|---|---|
| `landing/` | Landing pública (prerender estático, Tailwind 4). Solo lee: productos con `visible = true` + `configuracion`. | 4200 |
| `admin/` | Panel del administrador (Angular Material + Tailwind 4, sin SSR). Login con Supabase Auth; CRUD de productos, categorías y configuración. | 4300 |
| `bocetos/` | Bocetos HTML aprobados (`landing.html`, `admin.html`). Referencia de diseño. | — |
| `landing/supabase/` | `schema.sql`, `seed.sql`, `migracion-01-contacto-y-pagos.sql` | — |

## Comandos
- `npm start` dentro de cada carpeta (admin: `npm start -- --port 4300`), `npx ng build`, `npx ng test --watch=false`.
- Preview: `.claude/launch.json` define `landing` y `admin`.

## Diseño
- Paleta ISEVEN: naranja `#FF4A00`, fondo `#0B0B0C`, superficie `#161618`, borde `#2A2A2E`. Titulares en Michroma, texto en Inter.
- Tokens como variables CSS en `tailwind.css` / `styles.css`; los componentes usan utilidades (`bg-surface`, `text-muted`, `border-line`), nunca hex.
- Texto oscuro sobre el naranja (el blanco da 3.37:1, no pasa AA). El admin tiene modo oscuro (por defecto) y claro.
- No usar PrimeNG (licencia); Material es MIT.

## Seguridad
- Solo la clave publicable de Supabase en el frontend; nunca la `secret`/`service_role`.
- **Escritura solo para el administrador:** las políticas usan `public.es_admin()` (tabla `admins`), no "cualquier usuario autenticado". Aplicar `landing/supabase/migracion-03-seguridad.sql` (incluye límites del bucket: solo imágenes, 5 MB, y CHECK de largos y de URLs https).
- En Supabase → Authentication debe estar **desactivado "Allow new users to sign up"**. Activar MFA para el administrador y una contraseña larga.
- El público solo lee lo publicado (`visible = true`), `categorias` y `configuracion`; no puede listar el bucket.
- Landing: los enlaces que vienen de la base pasan por `urlHttps()` (bloquea `javascript:`/`data:`); Angular además sanea `href`/`src`. No usar `innerHTML` ni `bypassSecurityTrust*`.
- Cabeceras de seguridad: `landing/vercel.json` y `admin/vercel.json` (Vercel). HSTS solo aplica por HTTPS.
- La landing se publica como sitio estático (prerender): no hay servidor Node, así que no aplica `allowedHosts`. Si algún día se vuelve a `outputMode: "server"`, declarar el dominio real en `security.allowedHosts`.
- Sin CSP estricta de scripts todavía: Angular inyecta `<style>` y un manejador `onload` para fuentes; activarla al desplegar y probarla con `Content-Security-Policy-Report-Only`.
- El admin no debe probarse iniciando sesión desde herramientas automáticas: la sesión la abre el usuario.

## Convenciones
- Componentes standalone, `OnPush`, signals, `inject()`. Apps zoneless.
- Antes de un `await`, pedir dependencias con `inject()` (después ya no hay contexto de inyección).
- La landing pide los datos solo en el navegador (siempre frescos); en producción no muestra productos de demo.
- Fotos: el admin las reduce a 1200 px y las convierte a WebP antes de subirlas.

## Publicación (Vercel, dos proyectos)
- **Landing:** Root Directory `landing`. Build `npm run build`, salida `dist/landing/browser` (ya en `landing/vercel.json`).
- **Admin:** Root Directory `admin`. Reescribe todas las rutas a `index.html` (SPA) y define la salida `dist/admin/browser` en `admin/vercel.json`. Poner la URL de la landing en `admin/src/environments/environment.prod.ts` (`landingUrl`).
- Supabase → Authentication → URL Configuration: Site URL = URL del admin.
