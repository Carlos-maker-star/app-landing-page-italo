# ISEVEN — Panel admin

Panel privado para administrar el catálogo y la configuración de la landing. Angular 22 + Angular Material + Tailwind 4, con Supabase (Auth, base de datos y Storage).

## Qué hace
- **Productos:** crear, editar, ocultar/mostrar en la landing, marcar agotado, ordenar y subir hasta 4 fotos (se convierten a WebP).
- **Categorías:** crear, renombrar y eliminar.
- **Configuración:** WhatsApp, correo, redes, dirección, pagos, textos y aviso superior de la landing.
- **Perfil:** foto del creador (portada de la landing) y cambio de contraseña.

## Desarrollo
```bash
npm install
npm start -- --port 4300   # http://localhost:4300
npx ng test --watch=false
```

## Configuración
- `src/environments/environment.ts` (desarrollo) y `environment.prod.ts` (producción): URL y clave **publicable** de Supabase, y `landingUrl` para el enlace "Ver landing".
- Solo el usuario registrado en la tabla `admins` puede escribir (políticas RLS en `../landing/supabase/migracion-03-seguridad.sql`).

## Publicación
Proyecto de Vercel con *Root Directory* `admin` y Node 24.x. `vercel.json` reescribe todas las rutas a `index.html` y añade las cabeceras de seguridad.
