# DentaSys

## Sistema de Gestión Odontológica

**Proyecto Integrador Final — Tecnicatura Universitaria en Programación, UTN**

**Equipo:** Marcelo Gomez Armoa e Iván Nievas Zorn

## Descripción del Proyecto

DentaSys es una propuesta de sistema de gestión para una clínica odontológica. Su objetivo es organizar la información administrativa y clínica de la atención, facilitando la gestión de pacientes y turnos, y el seguimiento de la evolución odontológica mediante un odontograma.

El alcance funcional contempla los procesos centrales de la clínica: administración de pacientes, planificación de turnos, consulta del historial clínico y registro de estados dentales. El diseño prioriza la consistencia de la información, la trazabilidad de los cambios clínicos y la protección de los datos según las responsabilidades de cada perfil de usuario.

## Tecnologías y Decisiones Arquitectónicas

Las tecnologías seleccionadas para orientar el diseño del sistema son:

| Área | Tecnología | Decisión de diseño |
| --- | --- | --- |
| Entorno de servidor | Node.js | Plataforma prevista para las capacidades del sistema del lado servidor. |
| Lenguaje | TypeScript | Tipado estático para favorecer la claridad de los contratos y del modelo del dominio. |
| Persistencia | PostgreSQL | Base de datos relacional para representar entidades y relaciones del negocio. |
| Modelado de datos | Prisma | Herramienta prevista para expresar el modelo de datos y relacionarlo con PostgreSQL. |

Se adopta una arquitectura modular organizada por capas, con responsabilidades separadas para presentación, aplicación, dominio y persistencia. Esta decisión busca reducir el acoplamiento entre módulos, facilitar la evolución del sistema y mantener las reglas del negocio independientes de las decisiones de presentación y almacenamiento.

## Estructura del Repositorio

El siguiente árbol representa la organización objetivo del proyecto. Las carpetas `/database` y `/frontend` aún no están incorporadas al repositorio; se muestran como destinos previstos para la documentación del modelo de datos y el módulo de presentación.

```text
dentasys-project/
├── docs/
│   ├── backlog-funcional.md
│   └── escenario-negocio.md
├── database/                 # Destino previsto para la documentación del modelo de datos
├── backend/                  # Módulo del sistema del lado servidor
└── frontend/                 # Módulo de presentación previsto
```

## Índice de Documentación

- [Arquitectura y escenarios complejos](docs/escenario-negocio.md)
- [Backlog funcional e historias de usuario](docs/backlog-funcional.md)
- [Esquema de base de datos](#estructura-del-repositorio) — documentación prevista en `/database`, pendiente de incorporar al repositorio.
