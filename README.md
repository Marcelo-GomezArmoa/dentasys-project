# 🦷 DentaSys - Sistema Integral de Gestión Odontológica

**Tecnicatura Universitaria en Programación (UTN)**  
**Asignatura:** Proyecto Integrador Final  
**Equipo de Desarrollo:** Marcelo Gomez Armoa - Iván Nievas Zorn

---

## 📌 Descripción del Proyecto
DentaSys es una plataforma web orientada a digitalizar y optimizar el flujo clínico-administrativo de consultorios odontológicos locales. El sistema busca reducir errores operativos y mejorar la trazabilidad clínica mediante un odontograma estructurado y una agenda con reglas de consistencia.

## 🚀 Alcance del MVP
El Producto Mínimo Viable se centra en el núcleo operativo del consultorio:
* **Autenticación y RBAC:** Control de accesos con principio de mínimo privilegio (Administrador, Recepción, Odontólogo).
* **Gestión de Pacientes:** Alta, baja lógica y edición de datos filiatorios.
* **Agenda Interna:** Gestión de turnos con validación algorítmica para evitar superposición por profesional o sillón.
* **Ficha Clínica y Odontograma Interactivo:** Registro de atención, evolución histórica y marcado de estados por pieza/cara dental (Nomenclatura FDI).
* **Auditoría:** Registro de usuario, fecha y valor anterior ante cualquier modificación clínica.

## 🛠️ Stack Tecnológico
* **Frontend:** React (Vite) + TypeScript + Tailwind CSS (Despliegue en Vercel)
* **Backend:** Node.js + Express + TypeScript (Despliegue en Render)
* **Base de Datos:** PostgreSQL administrado mediante Supabase + Prisma ORM
* **CI/CD:** GitHub Actions

## 📁 Estructura del Repositorio
El proyecto sigue una arquitectura modular en un único repositorio:

* `/backend`: API RESTful, lógica de negocio y migraciones (Prisma).
* `/frontend`: Single Page Application y componentes interactivos (SVG).
* `/database`: Diagramas de Entidad-Relación y scripts de poblado inicial (seeds).
* `/shared`: Tipos, interfaces y contratos compartidos.
* `/docs`: Documentación técnica, requisitos y manuales.