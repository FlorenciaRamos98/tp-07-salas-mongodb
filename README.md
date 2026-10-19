# Trabajo práctico 07: Reservas de salas con MongoDB

## 1. Punto de partida

Este trabajo práctico parte del proyecto desarrollado en el TP 06, copiado a una nueva carpeta llamada `tp-07-salas-mongodb`.

Se conserva el funcionamiento de la aplicación web existente y se incorpora MongoDB Atlas mediante Mongoose para practicar la conexión, el modelo de datos, las validaciones y la persistencia de reservas.

La aplicación web continúa trabajando con datos en memoria. Las operaciones persistentes con MongoDB se realizan mediante scripts independientes.

## 2. Versiones y entorno

Versiones utilizadas y comprobadas durante el desarrollo:

- Node.js: `v24.19.0`.
- npm: `11.17.0`.
- Express: `5.2.1`.
- Mongoose: `9.11.2`.
- Prettier: `3.9.10`.
- ESLint: `10.12.0`.

La base de datos se aloja en MongoDB Atlas, utilizando el clúster gratuito identificado como `FREE` (Atlas Free, M0).

- Base de datos: `reservas_salas_u7`.
- Colección: `reservas`.

## 3. Instalación y configuración

### Requisitos

- Node.js y npm instalados.
- Una cuenta de MongoDB Atlas.
- Un clúster gratuito Atlas Free (M0).
- Un usuario de base de datos con permisos de lectura y escritura.
- La dirección IP de conexión agregada a la lista de acceso de Atlas.

### Preparación de MongoDB Atlas

1. Crear o utilizar un clúster gratuito en MongoDB Atlas.
2. Crear un usuario de base de datos con permisos de lectura y escritura.
3. Agregar la dirección IP desde la cual se realizará la conexión.
4. Obtener la URI de conexión para una aplicación Node.js.
5. Utilizar la base de datos `reservas_salas_u7` en la URI, conservando las opciones de conexión proporcionadas por Atlas.

### Instalación local

Desde la raíz del proyecto, ejecutar:

```powershell
npm install
```

Crear el archivo privado `.env` copiando la plantilla:

```powershell
Copy-Item .env.example .env
```

Completar `.env` con los valores correspondientes al entorno local, sin compartir las credenciales.

La estructura de configuración es:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@HOST/reservas_salas_u7?retryWrites=true&w=majority
```

Los valores `USUARIO`, `CLAVE` y `HOST` son marcadores que deben reemplazarse por los datos reales de Atlas. Se deben conservar las opciones de conexión proporcionadas por Atlas.

El archivo `.env` no se publica. El archivo `.env.example` contiene únicamente valores de ejemplo y debe incluirse en el repositorio.

## 4. Configuración, conexión y comandos

La configuración de entorno se encuentra en `src/config/entorno.js`. Allí se leen los datos necesarios para iniciar la aplicación y la URI utilizada para conectarse a MongoDB.

El módulo `src/config/base-datos.js` centraliza la conexión y la desconexión. También configura los resolutores DNS utilizados por Node.js:

```javascript
dns.setServers(["8.8.8.8", "1.1.1.1"]);
```

Este ajuste se realiza una sola vez en el módulo de conexión. Durante las pruebas no se observó un fallo DNS que requiriera una corrección adicional. Se comprobó que la conexión funciona con la configuración utilizada.

La conexión utiliza `MONGODB_URI`, sin incluir credenciales directamente en el código fuente. Si la URI está ausente o vacía, el programa informa el problema de configuración y no anuncia una conexión exitosa.

### Comandos disponibles

Comprobar la conexión con MongoDB Atlas, sin crear reservas:

```powershell
node --env-file=.env scripts/comprobar-conexion.js
```

Crear una reserva de prueba:

```powershell
node --env-file=.env scripts/crear-reserva.js
```

Listar las reservas almacenadas:

```powershell
node --env-file=.env scripts/listar-reservas.js
```

Iniciar la aplicación web:

```powershell
npm start
```

Formatear los archivos del proyecto:

```powershell
npm run format
```

Comprobar formato y lint:

```powershell
npm run check
```

Para ejecutar los scripts que utilizan MongoDB, se debe cargar el archivo `.env` mediante `--env-file=.env`.

Si la conexión falla, se deben revisar la URI, el usuario y la contraseña, los permisos, la IP autorizada, la disponibilidad del clúster y la resolución DNS. No se deben publicar credenciales ni la URI privada.

Durante las pruebas se confirmó que la conexión funciona utilizando el comando con `--env-file=.env`. La ejecución sin esa opción no pudo conectarse porque no se cargó la configuración necesaria.

## 5. Estructura de archivos y modelo

Los archivos principales incorporados o reorganizados para este trabajo son:

- `src/config/entorno.js`: lectura y validación de la configuración.
- `src/config/base-datos.js`: conexión y desconexión de MongoDB.
- `src/modelos/reserva.js`: esquema y modelo Mongoose de las reservas.
- `scripts/comprobar-conexion.js`: prueba de conexión.
- `scripts/crear-reserva.js`: creación de una reserva persistente.
- `scripts/listar-reservas.js`: consulta de reservas persistidas.
- `.env.example`: plantilla pública de configuración.
- `.gitignore`: exclusión de archivos privados y dependencias locales.
- `package.json`: dependencias y comandos del proyecto.
- `package-lock.json`: versiones resueltas por npm.
- `eslint.config.js`: configuración de ESLint.

También se conservan los archivos anteriores del TP 06, incluidos la aplicación Express, las rutas, los controladores, el servicio en memoria, el middleware, las vistas, los archivos JSON y los recursos públicos.

El modelo `Reserva` utiliza explícitamente la colección `reservas`.

### Campos y reglas de validación

| Campo | Tipo | Regla |
|---|---|---|
| `estudiante` | String | Obligatorio y sin espacios en los extremos. |
| `email` | String | Obligatorio, sin espacios en los extremos y con presencia de `@`. |
| `sala` | String | Obligatorio. Valores permitidos: `Sala Norte`, `Sala Sur` y `Sala Multimedia`. |
| `fecha` | String | Obligatorio y no vacío después de quitar espacios en los extremos. |
| `turno` | String | Obligatorio. Valores permitidos: `Mañana`, `Tarde` y `Noche`. |
| `personas` | Number | Obligatorio, entero entre 1 y 6 inclusive. |

Las reglas se implementan mediante las opciones de esquema de Mongoose, incluyendo `required`, `trim`, `match`, `enum`, `min`, `max` y un validador con `Number.isInteger`.

Mongoose asigna un `_id` de tipo ObjectId a cada documento. El identificador se convierte a texto al mostrarlo en la salida del programa. La asignación de un `_id` a un objeto, por sí sola, no demuestra que el documento se haya guardado; la confirmación se obtiene cuando finaliza correctamente la operación de escritura.

## 6. Alcance y limitaciones de las validaciones

El modelo verifica los campos y las reglas mínimas establecidas en la consigna.

Sin embargo, el esquema actual no comprueba:

- Que el correo electrónico tenga un formato completamente válido.
- Que la fecha exista en el calendario o corresponda a una fecha futura.
- Que dos reservas no se superpongan en una misma sala y turno.
- Que varias reservas respeten una capacidad compartida.
- Que no existan reservas duplicadas.

Estas comprobaciones no están implementadas en esta etapa y no deben considerarse garantizadas.

## 7. Matriz de pruebas y evidencia de persistencia

Las siguientes pruebas se realizaron durante el desarrollo. Los resultados corresponden a las ejecuciones observadas.

### Pruebas de conexión y configuración

| Prueba | Resultado observado |
|---|---|
| Conexión válida con `--env-file=.env` | Conexión establecida correctamente. |
| Ejecución sin cargar `.env` | No se pudo conectar. El programa mostró `Error`. |
| Variable `MONGODB_URI` vacía | No se pudo conectar. Después de mejorar el diagnóstico, se mostró `Configuración inválida: falta la variable MONGODB_URI.` |
| Contraseña incorrecta temporal | La conexión fue rechazada con `MongoServerError`, código `8000`. |
| Restauración de la configuración | La conexión volvió a establecerse correctamente. |
| Fallo DNS | No se observó un fallo DNS durante las pruebas. |

La prueba de contraseña incorrecta se realizó mediante una variable temporal de entorno en PowerShell, sin modificar la contraseña del usuario en Atlas ni alterar el archivo `.env` original.

### Pruebas de validación de reservas

| Prueba | Resultado observado |
|---|---|
| Reserva válida | Se guardó correctamente y se obtuvo un `_id`. |
| Estudiante vacío | `ValidationError`; se identificó el campo `estudiante`. La cantidad no cambió. |
| Email sin `@` | `ValidationError`; se identificó el campo `email`. La cantidad no cambió. |
| Sala no permitida | `ValidationError`; se identificó el campo `sala`. La cantidad no cambió. |
| Turno no permitido | `ValidationError`; se identificó el campo `turno`. La cantidad no cambió. |
| Fecha vacía | `ValidationError`; se identificó el campo `fecha`. La cantidad no cambió. |
| `personas` igual a `0` | `ValidationError`; se identificó el campo `personas`. La cantidad no cambió. |
| `personas` igual a `7` | `ValidationError`; se identificó el campo `personas`. La cantidad no cambió. |
| `personas` igual a `2.5` | `ValidationError`; se identificó el campo `personas`. La cantidad no cambió. |
| `personas` con texto no numérico (`"abc"`) | `ValidationError`; se identificó el campo `personas`. La cantidad no cambió. |

### Ensayo de persistencia entre procesos

Se realizó el siguiente ensayo reproducible en la base `reservas_salas_u7` y la colección `reservas`:

1. Se ejecutó `scripts/listar-reservas.js` y se registró una cantidad inicial de **1 reserva**.
2. Se ejecutó `scripts/crear-reserva.js` una vez. La creación terminó correctamente y devolvió el `_id` `6ad4774b5e8fd96ce1416b7b`.
3. Se dejó terminar el programa que creó la reserva.
4. Se ejecutó `scripts/listar-reservas.js` en otro proceso. Se recuperó el mismo `_id` y la cantidad pasó a **2 reservas**.
5. Se ejecutó nuevamente `scripts/listar-reservas.js`. La cantidad permaneció en **2 reservas**, sin nuevas escrituras.

El documento creado en el ensayo utiliza datos ficticios. La reserva inicial también permaneció en la colección.

El ensayo demuestra que el documento persistió en MongoDB después de terminar el proceso que lo creó y pudo recuperarse desde otro proceso. También se comprobó la presencia de las reservas en Atlas, dentro de la base `reservas_salas_u7` y la colección `reservas`.

La colección no estaba vacía durante las pruebas. No se eliminaron documentos para intentar simular una colección vacía.

### Continuidad de la aplicación web

Se comprobó el funcionamiento de la aplicación web heredada del TP 06:

| Prueba | Resultado observado |
|---|---|
| Inicio (`/`) | La página cargó correctamente. |
| Ruta `/estado` | Respondió con el estado del servicio. |
| Listado de reservas | Cargó y mostró las reservas sin errores. |
| Formulario válido | Se creó una reserva en memoria y se realizó la redirección habitual. |
| Formulario inválido | Una solicitud con la sala vacía recibió `400 Bad Request`; la reserva inválida no apareció en el listado. |
| CSS (`/css/estilos.css`) | Funcionó correctamente. |
| Ruta inexistente | Se mostró la página 404 del proyecto. |

La reserva válida creada desde el formulario web pertenece al servicio en memoria del TP 06. No corresponde a las reservas persistidas mediante MongoDB.

### Comprobaciones de calidad

| Comando | Resultado observado |
|---|---|
| `npm run format` | Finalizó correctamente y aplicó el formato a los archivos que lo necesitaban. |
| `npm run check` | Prettier indicó que todos los archivos cumplían el formato. ESLint terminó sin mostrar errores. |

La prueba de colección vacía no se realizó porque la base utilizada ya contenía documentos. No se borraron registros para conseguir ese estado.

## 8. Separación entre la aplicación web y MongoDB

La aplicación web conserva el servicio en memoria heredado del TP 06. Las reservas que se crean desde ese servicio no se guardan automáticamente en MongoDB.

Los scripts de este trabajo práctico constituyen un recorrido separado para comprobar la persistencia con Mongoose. Esta separación permite incorporar la conexión y el modelo sin alterar el comportamiento previo de la aplicación.

En esta etapa, el servicio web todavía no fue migrado a operaciones asíncronas con MongoDB. La integración de las rutas y los controladores con la persistencia corresponde a una etapa posterior del desarrollo, prevista para la unidad 8.

## 9. Seguridad y archivos que se publican

El archivo `.gitignore` excluye:

```gitignore
node_modules/
.env
```

El repositorio debe incluir `.env.example` y `package-lock.json`, pero no debe incluir `.env`, contraseñas, URI privadas ni credenciales de MongoDB Atlas.

Las pruebas utilizan datos ficticios. No se deben publicar datos personales ni información sensible en el repositorio o en las capturas de evidencia.