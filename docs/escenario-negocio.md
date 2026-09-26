# Validación del Modelo de Datos: Escenario Complejo

En respuesta a los requerimientos de arquitectura, se validó el modelo relacional (DER) ejecutando un escenario de estrés sobre las reglas de negocio principales.

## Escenario Solicitado
1. Superposición de turnos.
2. Atenciones sucesivas sobre una misma pieza dental.
3. Corrección posterior de una atención.
4. Intento de acceso clínico desde un rol no autorizado.

## Resolución basada en la Arquitectura (Prisma)

### 1. Intento de superposición de turnos
* **Situación:** Dos recepcionistas intentan reservar simultáneamente el sillón 1 con el Dr. Pérez el día 20/09 a las 10:00 AM.
* **Resolución:** El modelo `Appointment` posee el constraint `@@unique([professionalId, chairId, date, startTime, endTime])`. La primera transacción será aceptada. La segunda transacción fallará a nivel motor de base de datos (PostgreSQL), garantizando que no se agenden turnos duplicados sin importar la concurrencia en el frontend.

### 2. Atenciones sucesivas sobre una misma pieza
* **Situación:** Un paciente ingresa con una caries en la pieza 14 y meses después requiere una obturación en la misma pieza.
* **Resolución:** El modelo no actualiza la entidad `OdontogramEntry`. En la primera consulta (Atención A), se crea un registro con el estado "Caries". En la segunda consulta (Atención B), se crea un **nuevo** registro `OdontogramEntry` vinculado a la pieza 14 con el estado "Obturación". La historia clínica se reconstruye cronológicamente consultando todas las entradas asociadas al `patientId`.

### 3. Corrección clínica auditable
* **Situación:** El odontólogo se equivoca y registra una extracción en la pieza 47, cuando en realidad era la 46. Modifica el dato.
* **Resolución:** La tabla `OdontogramEntry` no permite un borrado silencioso. Al modificar el registro, el servicio backend dispara la creación de una fila en la tabla `OdontogramAudit`. Este registro captura el `entryId`, el usuario responsable (`modifiedById`), el valor anterior ("Extracción en pieza 47"), el nuevo estado ("Extracción en pieza 46") y la fecha exacta (`modifiedAt`).

### 4. Acceso denegado (RBAC)
* **Situación:** Un usuario con rol `ADMIN` intenta acceder al endpoint de historias clínicas (`/api/clinical-records`).
* **Resolución:** El modelo `User` clasifica la identidad bajo el enum `Role`. El middleware de autenticación del backend interceptará el token JWT del usuario, leerá el rol `ADMIN` y retornará un HTTP 403 (Forbidden), cumpliendo con el principio de mínimo privilegio.