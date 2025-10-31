<div align="center">
  <img src="https://github.com/user-attachments/assets/79d556ff-67b0-46f5-9843-948384f9a0a9" alt="VitalMedic logo" width="200" style="border-radius:10px; margin-bottom:10px;">
  
  <h1> VitalMedic</h1>
</div>

**VitalMedic** es una aplicación web diseñada para mejorar la gestión de la información médica entre pacientes y doctores.  
Este MVP (Producto Mínimo Viable) busca optimizar la atención médica digital mediante la integración de historiales clínicos, citas, y registros electrónicos de salud (**EHR**) usando el estándar **FHIR**.

---

## 🚀 Tecnologías utilizadas

### 🔧 Backend
- **Spring Boot (Java 17)** — Framework principal para la API REST.
- **PostgreSQL** — Base de datos relacional.
- **FHIR (HL7)** — Estándar para la interoperabilidad de datos clínicos.
- **Keycloak** — Gestión de autenticación y autorización.

### 💻 Frontend
- **React / Next.js** — Framework moderno para el desarrollo web.
- **Tailwind CSS** — Estilos modernos y responsive.
- **Axios / Fetch** — Comunicación con el backend.

### 🎨 Diseño UX/UI
- **Figma** — Prototipado y diseño de interfaces.
- Enfoque centrado en la experiencia del usuario para doctores y pacientes.

---

## 🧠 Objetivo del MVP

El propósito de **VitalMedic** es ofrecer una base sólida para un sistema de salud digital que:
- Permita a los **pacientes** acceder y gestionar su información médica.
- Facilite a los **doctores** consultar y actualizar historiales clínicos.
- Implemente la interoperabilidad de datos con el estándar **FHIR**.
- Simplifique el proceso de **agendamiento de citas** y registro médico.

---

## ⚙️ Arquitectura general

La arquitectura de **VitalMedic** se basa en un modelo **cliente-servidor** moderno, con separación de responsabilidades y comunicación mediante **API RESTful**.

```text
Frontend (React / Next.js)
        │
        ▼
Backend API (Spring Boot)
        │
        ▼
PostgreSQL Database
        │
        ▼
FHIR Integration Layer
```

### 🧩 Descripción de componentes

- **Frontend (Next.js / React):**  
  Interfaz web que permite la interacción entre el usuario (paciente o doctor) y el sistema.  
  Desarrollada con enfoque UX/UI moderno, responsive y accesible.

- **Backend (Spring Boot):**  
  Expone los servicios REST para el manejo de datos médicos, pacientes, doctores y citas.  
  Incluye seguridad con **Keycloak**, validación de datos y sincronización con el estándar **FHIR**.

- **Base de Datos (PostgreSQL):**  
  Base de datos relacional que almacena la información estructurada del sistema (usuarios, citas, historiales, etc.).

- **FHIR Integration Layer:**  
  Módulo encargado de la interoperabilidad con otros sistemas médicos usando el estándar **FHIR** para el intercambio de información clínica.

---

## 👥 Equipo 36 - WebApp

| Rol | Integrante |
|------|-------------|
| 🎨 **UX/UI** | Luis Alberto Hurtado Espinoza |
| 💻 **Frontend** | Percy Sebastián López Mallqui, José Ortega |
| 💻 **Frontend** | José Ortega |
| ⚙️ **Backend** | Edgar Ulises Camberos Arreola |

---

## 🔗 Enlaces del proyecto

| Sección | Enlace |
|----------|---------|
| 🌐 **Frontend** | [https://equipo36-web-app.vercel.app](https://equipo36-web-app.vercel.app) |
| 🛠️ **Backend** | [https://vitalmedic-backend.onrender.com/swagger-ui/index.html](https://vitalmedic-backend.onrender.com/swagger-ui/index.html) |
| 🎨 **Figma (Diseño)** | [https://www.figma.com/design/uoLfAanfRIZ3n1mWvYXvJ6?node-id=0-1](https://www.figma.com/design/uoLfAanfRIZ3n1mWvYXvJ6?node-id=0-1) |

