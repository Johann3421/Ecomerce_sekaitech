# Despliegue en Dokploy — LumiStore

## Requisitos previos

- Servidor VPS con **Dokploy** instalado ([dokploy.com](https://dokploy.com))
- Dominio apuntando a la IP del servidor (registro A o CNAME)
- El repositorio subido a GitHub / GitLab / Gitea

---

## 1. Generar el NEXTAUTH_SECRET

En tu máquina local (o en el servidor), ejecuta:

```bash
openssl rand -base64 32
```

Copia el resultado — lo necesitarás en el paso 4.

---

## 2. Crear la aplicación en Dokploy

1. Abre el panel de Dokploy → **Applications** → **Create Application**
2. Selecciona el tipo **Docker Compose**
3. Conecta tu proveedor Git (GitHub / GitLab / Gitea)
4. Selecciona el repositorio `ecommerce-premium`
5. En **Branch** selecciona `main`
6. En **Compose File Path** escribe: `docker-compose.yml`
7. Haz clic en **Save**

---

## 3. Configurar el dominio (HTTPS automático)

1. Ve a la pestaña **Domains** de la aplicación
2. Haz clic en **Add Domain**
3. Escribe tu dominio, p.ej.: `tienda.tudominio.com`
4. Activa **HTTPS / Let's Encrypt** → Dokploy configurará Traefik automáticamente
5. Guarda

---

## 4. Definir las variables de entorno

Ve a la pestaña **Environment** (o **Env Variables**) y agrega las siguientes:

| Variable | Valor |
|---|---|
| `POSTGRES_DB` | `lumistore` |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | *(contraseña fuerte, mínimo 20 chars)* |
| `DATABASE_URL` | `postgresql://postgres:<POSTGRES_PASSWORD>@db:5432/lumistore` |
| `NEXTAUTH_URL` | `https://tienda.tudominio.com` |
| `NEXTAUTH_SECRET` | *(resultado del openssl del paso 1)* |
| `AUTH_SECRET` | *(mismo valor que NEXTAUTH_SECRET)* |
| `NEXT_PUBLIC_APP_URL` | `https://tienda.tudominio.com` |
| `DOMAIN` | `tienda.tudominio.com` |
| `GOOGLE_CLIENT_ID` | *(opcional — OAuth de Google)* |
| `GOOGLE_CLIENT_SECRET` | *(opcional — OAuth de Google)* |

> **Importante:** `DATABASE_URL` debe usar `@db:5432` (nombre del servicio Docker),  
> **no** `@localhost:5432`.

---

## 5. Hacer el primer deploy

1. Ve a la pestaña **Deployments**
2. Haz clic en **Deploy** (o **Redeploy**)
3. Dokploy ejecutará en orden:
   - `docker build` de la imagen (≈3-5 min la primera vez)
   - Levantará el servicio `db` (PostgreSQL)
   - Esperará el healthcheck de la base de datos
   - Levantará el servicio `app`
   - El entrypoint correrá `prisma migrate deploy` automáticamente
4. Cuando el estado cambie a **Running**, la app está lista

Puedes ver los logs en tiempo real en la pestaña **Logs**.

---

## 6. Cargar los datos de prueba (seed)

Una vez que la app esté corriendo, ejecuta el seed **una sola vez**:

1. Ve a la pestaña **Terminal** (o **Exec**) del servicio `app`
2. Ejecuta:

```bash
node node_modules/tsx/dist/cli.mjs prisma/seed.ts
```

Esto creará:
- **Admin:** `admin@lumistore.com` / `Admin123!`
- **5 clientes** de prueba
- **4 categorías**, **20 productos**, reseñas y pedidos de ejemplo

---

## 7. Verificar el despliegue

Abre en el navegador:

| URL | Descripción |
|---|---|
| `https://tienda.tudominio.com` | Tienda principal |
| `https://tienda.tudominio.com/admin` | Panel de administración |
| `https://tienda.tudominio.com/login` | Login (usa el admin del seed) |

---

## 8. Actualizaciones futuras

Cada vez que hagas `git push` a `main`, ve a Dokploy → **Deployments** → **Redeploy**.

Para que el redeploy sea automático, configura un **Webhook** en Dokploy:

1. Ve a **Settings** de la aplicación → **Webhooks**
2. Copia la URL del webhook
3. En GitHub → **Settings → Webhooks → Add webhook**, pega la URL
4. Selecciona el evento `push`

A partir de ahora cada `git push` disparará un redeploy automático.

---

## Resolución de problemas

### La app no arranca / error de conexión a la base de datos

```bash
# Ver logs del servicio app
# En la pestaña Logs de Dokploy, filtra por "app"
```

Verifica que `DATABASE_URL` use `@db:5432` y no `@localhost:5432`.

### Error en las migraciones

```bash
# Ejecutar en la terminal del contenedor app:
node node_modules/prisma/build/index.js migrate status --schema=./prisma/schema.prisma
```

### Rebuild completo (si hay cambios en dependencias)

En Dokploy → **Settings** → activa **Force Rebuild** → **Redeploy**.

### Ver el estado de los contenedores

En Dokploy → **Services**, verifica que tanto `db` como `app` estén en estado **Running** (verde).

---

## Variables de entorno para OAuth con Google (opcional)

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un proyecto → **APIs & Services → Credentials**
3. Crea **OAuth 2.0 Client ID** de tipo **Web application**
4. En **Authorized redirect URIs** agrega:
   ```
   https://tienda.tudominio.com/api/auth/callback/google
   ```
5. Copia el Client ID y Client Secret a las variables de entorno en Dokploy
