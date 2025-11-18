# Pruebas de registro (/api/auth/register)

Pasos manuales para validar el nuevo endpoint de registro. Se asume el backend en ejecución (p. ej., `npm run dev`) y las variables de entorno configuradas.

## Caso 1: Creación exitosa
1. Enviar la petición:
   ```bash
   curl -i -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"nuevo_usuario","password":"Secreta123","role":"student"}'
   ```
2. **Resultado esperado:**
   - Código de estado **201**.
   - Respuesta JSON con propiedad `token` (JWT).

## Caso 2: Usuario duplicado
1. Repetir la petición del caso exitoso con el mismo `username`.
2. **Resultado esperado:**
   - Código de estado **409**.
   - Respuesta JSON: `{ "message": "El usuario ya existe" }`.

## Caso 3: Rol inválido
1. Enviar la petición cambiando el rol por uno no permitido, por ejemplo `"role":"guest"`:
   ```bash
   curl -i -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"otro_usuario","password":"Secreta123","role":"guest"}'
   ```
2. **Resultado esperado:**
   - Código de estado **400**.
   - Respuesta JSON: `{ "message": "Rol inválido" }`.

> Nota: El CHECK de la tabla `gym_app.app_user` solo admite los roles `student`, `colaborador`, `trainer` y `admin`. Si se envía un rol distinto, la API responde 400 y evita llegar al error de base de datos.
