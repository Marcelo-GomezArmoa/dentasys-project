# DentaSys

## Sistema de Gestión Odontológica

**Proyecto Integrador Final — Tecnicatura Universitaria en Programación, UTN**

**Equipo:** Marcelo Gomez Armoa e Iván Nievas Zorn

---

## Descripción del Proyecto

DentaSys es una propuesta de sistema de gestión para una clínica odontológica. Su objetivo es organizar la información administrativa y clínica de la atención, facilitando la gestión de pacientes y turnos, y el seguimiento de la evolución odontológica mediante un odontograma.

El alcance funcional contempla los procesos centrales de la clínica: administración de pacientes, planificación de turnos, consulta del historial clínico y registro de estados dentales. El diseño prioriza la consistencia de la información, la trazabilidad de los cambios clínicos y la protección de los datos según las responsabilidades de cada perfil de usuario.

---

## Tecnologías y Decisiones Arquitectónicas

Las tecnologías seleccionadas para orientar el diseño del sistema son:

| Área | Tecnología | Decisión de diseño |
| --- | --- | --- |
| Entorno de servidor | Node.js | Plataforma prevista para las capacidades del sistema del lado servidor. |
| Lenguaje | TypeScript | Tipado estático para favorecer la claridad de los contratos y del modelo del dominio. |
| Persistencia | PostgreSQL (Neon) | Base de datos relacional para representar entidades y relaciones del negocio. |
| Modelado de datos | Prisma ORM | Herramienta prevista para expresar el modelo de datos y relacionarlo con PostgreSQL. |

Se adopta una arquitectura modular organizada por capas, con responsabilidades separadas para presentación, aplicación, dominio y persistencia. Esta decisión busca reducir el acoplamiento entre módulos, facilitar la evolución del sistema y mantener las reglas del negocio independientes de las decisiones de presentación y almacenamiento.

---

## Estructura del Repositorio

El siguiente árbol representa la organización del proyecto. Las carpetas /database y /frontend representan destinos previstos para la documentación complementaria del modelo de datos y el cliente web:

```text
dentasys-project/
├── docs/
│   ├── backlog-funcional.md
│   └── escenario-negocio.md
├── database/                 # Destino previsto para la documentación del modelo de datos
├── backend/                  # Módulo del sistema del lado servidor (Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma     # Definición del modelo relacional
│   │   └── seed.ts           # Script de datos iniciales
│   └── src/
│       ├── controllers/      # Controladores de negocio (Auth, Patients, Appointments, Clinical)
│       ├── middlewares/      # Verificación JWT y RBAC
│       ├── routes/           # Enrutamiento modular de la API
│       ├── lib/              # Instancia singleton de Prisma Client
│       └── types/            # Tipos e interfaces de dominio
└── frontend/                 # Módulo de presentación previsto
```

---

## Rodaja Vertical Implementada (Vertical Slice)

La primera entrega del backend implementa y valida de punta a punta las siguientes historias de usuario:

- **HU-1.1 (Autenticación y RBAC):** Autenticación mediante JSON Web Tokens (JWT) y autorización por roles (ADMIN, DENTIST, RECEPTION) para proteger los recursos del sistema.
- **HU-3.1 (Reserva de Turnos):** Agendamiento de citas con validación de disponibilidad horaria y detección diferenciada de conflictos (409 Conflict), especificando si la colisión corresponde al sillón, al profesional o a ambos simultáneamente.
- **HU-4.1 (Historia Clínica y Odontograma Inmutable):** Registro transaccional de atención odontológica con estados de piezas dentales iniciales y mecanismo de corrección auditada obligatoria (OdontogramAudit), exigiendo justificación clínica explícita para registrar el cambio de estado de una pieza.

---

## Puesta en Marcha del Backend

### Requisitos Previos
- Node.js (versión 20.x recomendada)
- npm (versión 10.x recomendada)

### Pasos de Ejecución

1. **Ingresar a la carpeta del backend:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crear el archivo .env a partir de la plantilla:
```bash
cp .env.example .env
```
*(En caso de no contar con una instancia propia de PostgreSQL, utilizar la cadena provista en .env.example para conectarse a Neon)*.

4. **Sincronizar el esquema de base de datos:**
```bash
npx prisma db push
```

5. **Poblar datos iniciales (Seed):**
```bash
npx prisma db seed
```

6. **Iniciar el servidor en modo desarrollo:**
```bash
npm run dev
```
El servidor quedará operativo en http://localhost:3000.

---

## Usuarios Testigo de Prueba

El script de seed carga automáticamente los siguientes perfiles para validar flujos de autorización y permisos:

| Rol | Correo Electrónico | Contraseña | Alcance de Permisos |
| --- | --- | --- | --- |
| Administrador (ADMIN) | admin@dentasys.com | admin123 | Control total del sistema y configuración de sillones |
| Odontólogo (DENTIST) | dentist@dentasys.com | admin123 | Atención clínica, evolución de odontograma y turnos |
| Recepción (RECEPTION) | reception@dentasys.com | admin123 | Alta y consulta de pacientes, y gestión de turnos |

---

## Índice de Documentación

- [Arquitectura y escenarios complejos](docs/escenario-negocio.md)
- [Backlog funcional e historias de usuario](docs/backlog-funcional.md)
- [Esquema de base de datos](#estructura-del-repositorio) — modelo relacional gestionado en backend/prisma/schema.prisma.
