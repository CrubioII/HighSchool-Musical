# Justificación técnica para el uso de MongoDB

## Introducción

El sistema de gestión de gimnasio y bienestar de la Universidad Cali requiere almacenar y consultar datos con características muy distintas: información estructurada de usuarios, roles y asignaciones (que ya se gestiona en la base de datos relacional de la universidad) y datos altamente dinámicos como rutinas de entrenamiento, ejercicios personalizados, registros de progreso y recomendaciones. Para atender ambas necesidades se propone una arquitectura híbrida con PostgreSQL y **MongoDB**. A continuación se justifican las ventajas de utilizar MongoDB frente a otras soluciones NoSQL.

## Por qué una base de datos NoSQL

Una base de datos NoSQL permite trabajar con **esquemas dinámicos** y escalar horizontalmente. La guía de Integrate.io resume las diferencias clave entre bases de datos relacionales y no relacionales: las bases de datos SQL usan un esquema predefinido y escalan verticalmente, mientras que las NoSQL utilizan esquemas dinámicos, se almacenan como documentos/clave–valor/grafo/columnas y **pueden escalar de forma horizontal**【543124250583183†L100-L108】. Además, las NoSQL están optimizadas para datos no estructurados como documentos JSON【543124250583183†L100-L108】 y permiten añadir campos al vuelo【543124250583183†L207-L215】. Estas propiedades son útiles cuando los datos evolucionan con el tiempo o contienen estructuras anidadas.

El artículo de InterSystems señala que las bases de datos NoSQL ofrecen **escalabilidad** mediante sharding (distribución horizontal), lo que permite manejar volúmenes crecientes de datos sin necesidad de ampliar un único servidor【653983195724839†L712-L732】. También destaca el **alto rendimiento** derivado de la distribución de operaciones de lectura y escritura y la posibilidad de integrar técnicas como caché o procesamiento por lotes【653983195724839†L735-L743】. Otra ventaja es el diseño *schema‑less*, que permite almacenar cualquier tipo de dato sin la rigidez de las tablas relacionales【653983195724839†L744-L752】, proporcionando **flexibilidad** para datos semiestructurados o en constante cambio【653983195724839†L755-L761】. Estas características permiten adaptar el almacenamiento a nuestras entidades de gimnasio, cuyos campos pueden variar (por ejemplo, distintos parámetros por ejercicio o rutinas importadas de terceros).

## Ventajas de MongoDB

MongoDB es una base de datos documental que almacena la información en documentos BSON (JSON binario). Entre sus ventajas destacan:

* **Flexibilidad de esquema**: MongoDB permite almacenar documentos con distinta estructura. El artículo de Koombea destaca que su diseño documental permite guardar datos en formato **JSON‑like sin definir un esquema rígido**, lo cual es muy útil cuando la estructura de los datos cambia o evoluciona【118822767794545†L214-L221】. En nuestro caso, cada rutina puede tener diferente número de ejercicios, parámetros opcionales (series, repeticiones, tiempo, descanso) y podría ampliarse con campos futuros sin afectar a los registros existentes.

* **Escalabilidad horizontal**: MongoDB soporta **sharding** y puede distribuir los datos en varios servidores, de modo que la capacidad de almacenamiento y el rendimiento se incrementan añadiendo nodos. Koombea menciona que gracias a esta propiedad la base de datos puede manejar grandes cantidades de datos y cargas de tráfico crecientes sin interrupciones【118822767794545†L223-L231】.

* **Alto rendimiento e indexación**: la arquitectura de MongoDB está pensada para **alto rendimiento** y utiliza el formato BSON eficiente para el almacenamiento y la recuperación de datos【118822767794545†L233-L241】. Soporta índices sobre cualquier campo (incluso anidados), lo que facilita consultas rápidas y agregaciones.

* **Rico lenguaje de consultas**: MongoDB dispone de un lenguaje de consultas expresivo que permite filtrar, ordenar y **agregar datos de forma compleja**【118822767794545†L246-L255】. Con el framework de agregación se pueden generar informes de progreso, rankings y comparativas sin necesidad de transformar los datos a otra base.

* **Modelo orientado a documentos**: el modelo documental es especialmente adecuado para representar datos complejos o anidados. Koombea indica que este modelo permite representar de manera natural relaciones entre diferentes datos y trabajar con documentos que no encajan en tablas y filas【118822767794545†L258-L264】. Nuestras rutinas incluyen listas de ejercicios con parámetros propios y registros de progreso por día; toda esa estructura encaja de manera intuitiva en un documento.

* **Comunidad y ecosistema**: MongoDB cuenta con un ecosistema muy activo y recursos que facilitan su uso【118822767794545†L266-L275】, así como despliegues gestionados (MongoDB Atlas) y drivers para múltiples lenguajes.

### Consideración de desventajas

Como cualquier tecnología, MongoDB tiene limitaciones. Koombea menciona que no soporta transacciones complejas como una base de datos relacional y que su uso indebido puede derivar en problemas de **integridad de datos**【118822767794545†L299-L309】. Además, consume más memoria por la redundancia y el formato BSON【118822767794545†L320-L329】. Para mitigar estas limitaciones:

* Las **transacciones** de los datos críticos (usuarios, asignaciones, estadísticas) se mantienen en PostgreSQL.
* Se diseña el modelo de datos siguiendo las mejores prácticas de MongoDB para evitar redundancias innecesarias y se utilizan índices apropiados.

## Comparación con otras bases de datos NoSQL (Cassandra)

Otra opción común en el ámbito NoSQL es Apache Cassandra, una base de datos orientada a columnas. Según el análisis de Knowi, Cassandra ofrece **escalabilidad y tolerancia a fallos** gracias a su arquitectura **peer‑to‑peer** y a la replicación de datos【297791762900420†L189-L195】. Está optimizada para cargas de trabajo de escritura intensiva, como ingestión de sensores o series de tiempo【297791762900420†L189-L210】. Sin embargo, presenta desventajas relevantes para nuestro caso: no soporta operaciones ACID ni consultas complejas con joins【297791762900420†L196-L203】, y las lecturas pueden ser más lentas【297791762900420†L196-L203】. 

El mismo artículo indica que MongoDB proporciona **consistencia fuerte**, soporte de **consultas ricas** y un modelo **flexible** gracias a sus documentos BSON【297791762900420†L221-L247】. Además, MongoDB ofrece un lenguaje de consultas basado en JSON y admite **índices secundarios** eficientes incluso sobre campos anidados【297791762900420†L324-L329】. Para una aplicación que requiere almacenar rutinas con estructuras anidadas, realizar consultas ad hoc sobre progreso y generar agregaciones complejas, MongoDB resulta más adecuado que un almacén de columnas como Cassandra. Cassandra es preferible en escenarios de ingesta masiva y eventos de IoT【297791762900420†L189-L219】, que no son la prioridad en este proyecto.

## Justificación de la arquitectura híbrida SQL + NoSQL

La combinación de PostgreSQL y MongoDB aprovecha lo mejor de ambos mundos. Por un lado, la base de datos relacional mantiene la información institucional (usuarios, roles, cursos) y las tablas de estadísticas con **integridad referencial y transaccional**, ideales para operaciones críticas y reportes estructurados. Por otro, MongoDB permite almacenar rutinas, ejercicios y registros de progreso en documentos auto‑contenidos y flexibles. La guía de Integrate.io subraya que las bases SQL son mejores para **transacciones de múltiples filas**, mientras que las NoSQL son preferibles para datos no estructurados como documentos JSON【543124250583183†L100-L108】. Esta distinción se ajusta perfectamente a nuestro dominio: las operaciones de autenticación y administración se resuelven en PostgreSQL, mientras que la evolución dinámica de las rutinas y ejercicios se gestiona en MongoDB.

Además, mantener estadísticas mensuales en PostgreSQL facilita la generación de informes relacionales y permite a los administradores consultar datos agregados mediante SQL. Mientras tanto, MongoDB ofrece la posibilidad de construir informes innovadores (p. ej., análisis de tendencias por tipo de ejercicio) con su framework de agregación y modelos flexibles.

## Conclusión

MongoDB se selecciona como componente NoSQL para el sistema de bienestar universitario debido a su capacidad de **adaptarse a estructuras de datos cambiantes**, **escalar horizontalmente** y **proporcionar consultas ricas y agregaciones**. La literatura destaca que las bases de datos NoSQL se adecuan a grandes volúmenes de datos sin un esquema fijo【653983195724839†L712-L752】 y que MongoDB, en particular, sobresale por su modelo documental, su escalabilidad y su robusto ecosistema【118822767794545†L214-L264】. Aunque existen alternativas como Cassandra, estas se orientan a cargas de escritura masiva y no ofrecen la flexibilidad de consulta necesaria para gestionar rutinas personalizadas y seguimientos detallados【297791762900420†L189-L203】. Por lo tanto, una arquitectura híbrida con PostgreSQL y MongoDB proporciona la base ideal para una aplicación de gimnasio moderna, escalable y mantenible.