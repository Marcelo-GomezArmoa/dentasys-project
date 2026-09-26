# Backlog Funcional y Requerimientos (MVP)

## EP1: Identidad y Seguridad (Auth & RBAC)

| ID | Historia de Usuario | Criterios de Aceptación Técnicos (Backend) |
| :--- | :--- | :--- |
| **HU-1.1** | **Como** usuario del sistema,<br>**quiero** autenticarme con mis credenciales,<br>**para** obtener un token de acceso seguro. | **CA1:** POST `/api/auth/login` debe validar email y contraseña (bcrypt).<br>**CA2:** Retornar JWT firmado con `userId` y `Role`.<br>**CA3:** Retornar HTTP 401 ante credenciales inválidas. |
| **HU-1.2** | **Como** Arquitecto,<br>**quiero** interceptar peticiones a rutas protegidas,<br>**para** garantizar el mínimo privilegio. | **CA1:** Middleware que extraiga y valide la firma del JWT.<br>**CA2:** Si un rol `RECEPTION` intenta acceder a una ruta de `DENTIST`, retornar HTTP 403 Forbidden. |

## EP2: Gestión de Pacientes (ABM Administrativo)

| ID | Historia de Usuario | Criterios de Aceptación Técnicos (Backend) |
| :--- | :--- | :--- |
| **HU-2.1** | **Como** Recepcionista,<br>**quiero** registrar a un nuevo paciente,<br>**para** ingresarlo a la clínica. | **CA1:** POST `/api/patients`.<br>**CA2:** Validar DNI único en BD (HTTP 409 si existe). |
| **HU-2.2** | **Como** Recepcionista,<br>**quiero** actualizar el teléfono de un paciente,<br>**para** mantener el contacto vigente. | **CA1:** PATCH `/api/patients/:id`.<br>**CA2:** Solo permite campos filiatorios (HTTP 200). |
| **HU-2.3** | **Como** Administrador,<br>**quiero** dar de baja a un paciente,<br>**para** ocultarlo sin borrar su historial. | **CA1:** DELETE `/api/patients/:id` aplica baja lógica (`isActive: false`). No usa DELETE SQL. |

## EP3: Motor de Agendamiento (Gestión de Turnos)

| ID | Historia de Usuario | Criterios de Aceptación Técnicos (Backend) |
| :--- | :--- | :--- |
| **HU-3.1** | **Como** Recepcionista,<br>**quiero** listar los turnos de un día,<br>**para** visualizar la agenda. | **CA1:** GET `/api/appointments?date=YYYY-MM-DD`.<br>**CA2:** Incluye datos del paciente y profesional. |
| **HU-3.2** | **Como** Recepcionista,<br>**quiero** reservar un turno,<br>**para** asegurar la atención. | **CA1:** POST `/api/appointments`.<br>**CA2:** Capturar error `@@unique` (superposición) y devolver HTTP 409. |
| **HU-3.3** | **Como** Recepcionista,<br>**quiero** cancelar un turno,<br>**para** liberar el horario. | **CA1:** PATCH `/api/appointments/:id/status`.<br>**CA2:** Acepta valor CANCELLED del enum `AppStatus`. |

## EP4: Historial Clínico y Odontograma

| ID | Historia de Usuario | Criterios de Aceptación Técnicos (Backend) |
| :--- | :--- | :--- |
| **HU-4.1** | **Como** Odontólogo,<br>**quiero** asentar un diagnóstico,<br>**para** registrar el estado dental. | **CA1:** POST `/api/odontogram`.<br>**CA2:** Inserta fila en `OdontogramEntry` con diente, cara y estado. |
| **HU-4.2** | **Como** Odontólogo,<br>**quiero** corregir un diagnóstico,<br>**para** reflejar la realidad clínica. | **CA1:** POST `/api/odontogram/correction`.<br>**CA2:** Transacción SQL: Nuevo registro en `OdontogramEntry` + Log en `OdontogramAudit`. |
| **HU-4.3** | **Como** Profesional,<br>**quiero** ver la evolución del odontograma,<br>**para** analizar el tratamiento. | **CA1:** GET `/api/patients/:id/odontogram`.<br>**CA2:** Retorna lista cronológica descendente. |

---

### Reglas de Negocio Estrictas
1. **Concurrencia Física:** Un sillón no puede ser ocupado por dos profesionales en la misma franja.
2. **Concurrencia Profesional:** Un profesional no puede atender a dos pacientes al mismo tiempo.
3. **Inmutabilidad Clínica:** Los registros clínicos no se eliminan (No DELETE).