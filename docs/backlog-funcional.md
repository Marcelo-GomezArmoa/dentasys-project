# Backlog Funcional y Requerimientos

> **Alcance del documento:** análisis y diseño. Los criterios siguientes expresan requisitos y correspondencias con el modelo de datos; no describen código ejecutable ni certifican comportamiento implementado. Las limitaciones del esquema actual se identifican como brechas pendientes de diseño.

## EP1: Identidad y Seguridad

| ID | Historia de Usuario | Criterios de Diseño y Aceptación |
| :--- | :--- | :--- |
| **HU-1.1** | **Como** usuario del sistema,<br>**quiero** identificarme con mis credenciales,<br>**para** acceder según mi perfil. | **CA1:** La entidad `User` contempla correo único mediante `email` y almacenamiento de credenciales mediante `passwordHash`.<br>**CA2:** La identidad se asocia a uno de los roles definidos en `Role`: `ADMIN`, `RECEPTION` o `DENTIST`.<br>**CA3:** El esquema de datos no define sesiones ni tokens; su política de emisión, vigencia y validación requiere especificación independiente. |
| **HU-1.2** | **Como** responsable de la clínica,<br>**quiero** que el acceso a las funciones dependa del rol,<br>**para** limitar cada operación a usuarios autorizados. | **CA1:** El diseño debe relacionar las decisiones de autorización con los roles `ADMIN`, `RECEPTION` y `DENTIST`.<br>**CA2:** La matriz de permisos por operación debe definirse como parte del diseño funcional; el enum `Role` por sí solo no especifica permisos ni accesos denegados. |

## EP2: Gestión de Pacientes

| ID | Historia de Usuario | Criterios de Diseño y Aceptación |
| :--- | :--- | :--- |
| **HU-2.1** | **Como** recepcionista,<br>**quiero** registrar un paciente,<br>**para** incorporarlo a la clínica. | **CA1:** La entidad `Patient` contempla DNI, nombre, apellido y teléfono.<br>**CA2:** El DNI se modela como único mediante el atributo `dni`.<br>**CA3:** La relación del paciente con turnos y atenciones clínicas conserva su vinculación con el historial. |
| **HU-2.2** | **Como** recepcionista,<br>**quiero** actualizar el teléfono de un paciente,<br>**para** mantener vigente su información de contacto. | **CA1:** El teléfono se representa en el atributo `Patient.phone`.<br>**CA2:** La actualización de datos filiatorios debe preservar las relaciones del paciente con sus turnos y atenciones. |
| **HU-2.3** | **Como** administrador,<br>**quiero** dar de baja a un paciente sin perder su historial,<br>**para** evitar su uso operativo posterior y conservar la información clínica. | **CA1:** El esquema actual no define un atributo de estado o baja para `Patient`; esta historia requiere una decisión de modelado antes de considerarse cubierta.<br>**CA2:** La baja no debe implicar la pérdida de turnos ni atenciones asociadas. La política de retención y consulta del historial queda pendiente de especificación. |

## EP3: Gestión de Turnos

| ID | Historia de Usuario | Criterios de Diseño y Aceptación |
| :--- | :--- | :--- |
| **HU-3.1** | **Como** recepcionista,<br>**quiero** consultar los turnos de una fecha,<br>**para** organizar la agenda de la clínica. | **CA1:** `Appointment` contempla fecha, hora de inicio, hora de fin y estado.<br>**CA2:** Cada turno se relaciona con un paciente, un profesional (`User`) y un sillón (`Chair`), según las relaciones del modelo.<br>**CA3:** La consulta por paciente y fecha cuenta con un índice compuesto en el modelo. |
| **HU-3.2** | **Como** recepcionista,<br>**quiero** reservar un turno,<br>**para** asignar una franja de atención a un paciente, profesional y sillón. | **CA1:** Cada turno debe referenciar las entidades `Patient`, `User` y `Chair`, y registrar fecha, hora de inicio y hora de fin.<br>**CA2:** La unicidad compuesta de profesional, sillón, fecha, hora de inicio y hora de fin evita duplicar esa combinación exacta.<br>**CA3:** Esa unicidad no garantiza por sí sola que no existan intervalos parcialmente superpuestos ni conflictos independientes por profesional o sillón. La regla de exclusión completa requiere una decisión de diseño adicional y no se considera cubierta por el constraint actual. |
| **HU-3.3** | **Como** recepcionista,<br>**quiero** cancelar un turno,<br>**para** liberar su franja horaria. | **CA1:** El estado del turno utiliza exclusivamente los valores definidos en `AppStatus`: `PROGRAMADO`, `ATENDIDO`, `CANCELADO` y `AUSENTE`.<br>**CA2:** La cancelación se representa con el valor exacto `CANCELADO`.<br>**CA3:** Las transiciones permitidas entre estados no están restringidas por el esquema y requieren definición funcional. |

## EP4: Historial Clínico y Odontograma

| ID | Historia de Usuario | Criterios de Diseño y Aceptación |
| :--- | :--- | :--- |
| **HU-4.1** | **Como** odontólogo,<br>**quiero** registrar una atención y sus hallazgos odontológicos,<br>**para** mantener la evolución clínica del paciente. | **CA1:** `ClinicalAttention` relaciona paciente y profesional, y contempla diagnóstico, tratamiento, notas y fecha de atención.<br>**CA2:** Cada `OdontogramEntry` se relaciona con una atención clínica y contempla diente, superficie, estado y fecha de registro.<br>**CA3:** El diseño debe conservar la relación de las entradas con la atención que las originó; la consulta del historial parte de las atenciones del paciente. |
| **HU-4.2** | **Como** odontólogo,<br>**quiero** corregir un dato odontológico dejando trazabilidad,<br>**para** preservar la historia de los cambios clínicos. | **CA1:** `OdontogramAudit` contempla la relación con la entrada odontológica y el usuario responsable.<br>**CA2:** Cada auditoría registra `previousState`, `newState`, `reason` y `createdAt`; el motivo es un dato requerido por el modelo.<br>**CA3:** El modelo permite relacionar una auditoría con una entrada y un usuario, pero no garantiza por sí solo que toda corrección genere una auditoría ni que ambas operaciones sean atómicas. Esa garantía debe definirse como requisito de diseño. |
| **HU-4.2** | **Como** odontólogo,<br>**quiero** corregir un dato odontológico dejando trazabilidad,<br>**para** preservar la historia de los cambios clínicos. | **CA1:** `OdontogramAudit.odontogramEntryId` relaciona la auditoría con `OdontogramEntry`, y `OdontogramAudit.userId` la relaciona con `User`.<br>**CA2:** Cada auditoría registra `previousState`, `newState`, `reason` y `createdAt`; el motivo es un dato requerido por el modelo.<br>**CA3:** El modelo permite relacionar una auditoría con una entrada y un usuario, pero no garantiza por sí solo que toda corrección genere una auditoría ni que ambas operaciones sean atómicas. Esa garantía debe definirse como requisito de diseño. |
| **HU-4.3** | **Como** profesional,<br>**quiero** consultar la evolución odontológica de un paciente,<br>**para** revisar sus antecedentes clínicos. | **CA1:** El historial se organiza mediante las relaciones `Patient`–`ClinicalAttention`–`OdontogramEntry`.<br>**CA2:** Las entradas contemplan `recordedAt`, que sirve como referencia temporal para ordenar la evolución.<br>**CA3:** La entrada odontológica se vincula a una atención; no posee una relación directa con `Patient`. |

## Reglas de Negocio y Brechas de Diseño

1. **Concurrencia de turnos:** el modelo evita duplicar una combinación exacta de profesional, sillón, fecha y horario. La exclusión de cualquier solapamiento por profesional o por sillón es un requisito adicional que el `@@unique` actual no satisface por sí solo.
2. **Inmutabilidad clínica:** el requisito funcional es conservar las entradas clínicas y evitar correcciones silenciosas. El esquema permite representar entradas y auditorías relacionadas, pero no impone por sí mismo una política de solo inserción ni prohíbe modificaciones o eliminaciones.
3. **Auditoría clínica:** la auditoría relaciona `OdontogramEntry` con `User` y contempla estado anterior, estado nuevo, motivo y fecha de creación. La obligatoriedad de auditar cada cambio y la atomicidad de la corrección y su auditoría son requisitos de diseño pendientes de garantía.
4. **Baja de pacientes:** `Patient` no contempla actualmente un campo de baja o estado; la historia correspondiente requiere completar el diseño del modelo antes de darla por cubierta.
