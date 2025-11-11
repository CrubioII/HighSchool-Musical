# Plataforma de Bienestar y Gimnasio – Universidad Cali

Este repositorio contiene la implementación de una aplicación web completa para la gestión de rutinas, ejercicios y seguimiento de progreso físico de estudiantes, colaboradores y entrenadores de la Universidad Cali. La solución utiliza una arquitectura híbrida con PostgreSQL y MongoDB para satisfacer las necesidades tanto de datos estructurados como no estructurados.

## Estructura del repositorio

```
gym-app/
├── backend/        # API REST desarrollada con Node.js y Express
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio de cada recurso
│   │   ├── db/            # Conexión a PostgreSQL y MongoDB
│   │   ├── middleware/    # Autenticación y autorización
│   │   ├── models/        # Esquemas de Mongoose
│   │   ├── routes/        # Endpoints de la API
│   │   └── server.js      # Punto de entrada del servidor
│   ├── package.json       # Dependencias y scripts
│   └── .env.example       # Variables de entorno de ejemplo
├── database/
│   └── schema.sql         # Script SQL para crear el esquema y tablas propias
├── docs/
│   ├── justificacion_mongodb.md  # Justificación técnica del uso de MongoDB
│   ├── architecture.md           # Descripción de la arquitectura y diagramas
│   ├── user_manual.md            # Manual de usuario por rol
│   └── architecture_diagram.png  # Imagen con el diagrama de arquitectura
├── frontend/        # Aplicación frontend (estructura sugerida con React)
└── README.md        # Este archivo
```

## Requisitos previos

* **Node.js ≥ 18** y **npm** instalados en su máquina.
* **PostgreSQL ≥ 14** con un usuario y base de datos accesibles.
* **MongoDB ≥ 6** (local o Atlas). Si utiliza Atlas, cree un clúster gratuito y obtenga la cadena de conexión.
* (Opcional) **Docker** si desea contenerizar la aplicación.

## Instalación del backend

1. Clonar este repositorio y acceder a la carpeta del backend:

   ```bash
   git clone <repo-url>
   cd gym-app/backend
   ```

2. Copiar el archivo `.env.example` a `.env` y ajustar las variables de entorno con las credenciales de sus bases de datos y un secreto JWT.

   ```bash
   cp .env.example .env
   # Editar .env con su editor preferido
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear el esquema en PostgreSQL ejecutando el script SQL:

   ```bash
   # Reemplazar valores de usuario/contraseña/host según corresponda
   psql -h <host> -U <usuario_superusuario> -f ../database/schema.sql
   ```

5. (Opcional) Cargar datos de ejemplo en las tablas si dispone de un script adicional.

6. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   El backend quedará escuchando en el puerto especificado en `.env` (por defecto 3001).

## Estructura sugerida del frontend

La carpeta `frontend` está preparada para alojar una aplicación creada con [Vite](https://vitejs.dev/) + React. Se recomienda organizar los archivos de la siguiente forma:

```
frontend/
├── public/
├── src/
│   ├── api/        # Servicios para consumir la API REST
│   ├── components/ # Componentes reutilizables (formularios, tarjetas, gráficas)
│   ├── pages/      # Vistas por rol (Login, Dashboard, Rutinas, Ejercicios)
│   ├── hooks/      # Hooks personalizados (por ejemplo, useAuth)
│   ├── context/    # Contextos de React para autenticación y estado global
│   └── App.jsx     # Enrutamiento y estructura principal
├── package.json
└── vite.config.js
```

Para iniciar el frontend (asumiendo que ya existe una implementación React):

```bash
cd frontend
npm install
npm run dev
```

## Deployment y hosting

* **PostgreSQL** puede alojarse en servicios como Supabase, Aiven, Neon u Oracle (SID: ESTUD). Debe crear el esquema `gym_app` y asignar el rol `gym_user` especificado en `schema.sql`.
* **MongoDB** puede ejecutarse localmente o mediante MongoDB Atlas. Para Atlas, cree un clúster gratuito y configure la IP de acceso. Recuerde actualizar `MONGODB_URI` en el archivo `.env`.
* El backend y el frontend pueden desplegarse en servicios como Vercel, Netlify, Heroku u hospedarse en servidores propios. Es importante configurar las variables de entorno correspondientes en el entorno de producción.

## Pruebas

Se recomienda implementar **pruebas unitarias** para los controladores y **pruebas de integración** para los endpoints. Herramientas como Jest (para Node.js) y React Testing Library (para el frontend) pueden facilitar la automatización de las pruebas. Verificar los flujos de inicio de sesión, creación de rutinas y registro de progreso es crítico.

## Contribuciones

Este proyecto es de carácter académico. Se agradecen sugerencias y mejoras que cumplan con las buenas prácticas de desarrollo. Para contribuir, realice un _fork_ del repositorio, cree una rama con su mejora y envíe un _pull request_.