# Prueba manual: crear progreso con token que usa `id` como cadena

Esta prueba reproduce el caso donde el JWT incluye el `id` del usuario como cadena. Confirma que el dueño de la rutina puede registrar progreso sin recibir 403.

1. Asegúrate de tener las variables de entorno cargadas (`JWT_SECRET` y la URL de Mongo).
2. Inicia el backend (`npm start` dentro de `backend/`).
3. Obtén o crea un ID numérico de usuario y una rutina que le pertenezca (`routineId`).
4. Genera un token JWT con un payload como:
   ```json
   {
     "id": "<USER_ID_AS_STRING>",
     "role": "student"
   }
   ```
   Puedes generarlo en Node:
   ```bash
   node -e "console.log(require('jsonwebtoken').sign({id:'<USER_ID_AS_STRING>',role:'student'}, process.env.JWT_SECRET))"
   ```
5. Envía la petición de progreso usando el token anterior:
   ```bash
   curl -X POST http://localhost:3000/api/progress \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"routineId":"<ROUTINE_ID>","exerciseId":"<EXERCISE_ID>","repetitions":10}'
   ```
6. Espera una respuesta **201 Created** con el registro guardado. El dueño de la rutina ya no debe recibir **403 Forbidden** aun cuando el `id` del token sea una cadena.
