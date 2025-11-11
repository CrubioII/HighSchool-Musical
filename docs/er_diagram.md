# Diagrama ER del esquema relacional `gym_app`

A continuación se muestra un diagrama ER simplificado de las tablas propias de la aplicación en PostgreSQL. Se emplea notación [Mermaid](https://mermaid.js.org/) para facilitar su visualización en plataformas compatibles.

```mermaid
erDiagram
    APP_USER {
        INTEGER id PK
        VARCHAR username
        VARCHAR password_hash
        VARCHAR role
    }
    ASSIGNMENT {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER instructor_id FK
        DATE start_date
        DATE end_date
    }
    USER_MONTHLY_STATS {
        INTEGER id PK
        INTEGER user_id FK
        DATE month_year
        INTEGER routines_started
        INTEGER followups_count
    }
    INSTRUCTOR_MONTHLY_STATS {
        INTEGER id PK
        INTEGER instructor_id FK
        DATE month_year
        INTEGER new_assignments
        INTEGER followups_count
    }

    APP_USER ||..|| ASSIGNMENT : "has"
    APP_USER ||..|| USER_MONTHLY_STATS : "aggregates"
    APP_USER ||..|| INSTRUCTOR_MONTHLY_STATS : "aggregates"
```

Cada tabla tiene su clave primaria (*PK*) y referencia la clave foránea (*FK*) de usuarios o instructores almacenados en el sistema institucional. No se incluyen aquí las tablas del sistema universitario existente, pues forman parte de otro esquema.