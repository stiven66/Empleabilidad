English
Employment Platform API
A production-ready NestJS API to manage job vacancies and coder applications with robust security and business rules. Includes JWT authentication, API Key protection, role-based access control, DTO validation, global response interceptor, Swagger documentation, unit tests, Docker, and a minimal yet polished HTML/CSS frontend.

Features
--Authentication with JWT and API Key headers

--Role-based access: Admin, Manager (Gestor), Coder

--Vacancy management with technologies, seniority, salary, location, modality, capacity

--Coder applications with constraints:

--No duplicate applications per vacancy

--Capacity enforcement

--Max 3 active vacancies per coder

--Global response format

--Swagger docs with examples

--Unit tests (Jest) for vacancies and applications

Tech stack
--NestJS, TypeScript, TypeORM, PostgreSQL

--JWT, Passport

Swagger

--Docker & docker-compose

--HTML/CSS frontend served via Nest or standalone

Getting started
--Clone repository

--Create .env from .env.example

Install dependencies

--npm install

--Run database (Postgres)

--With docker-compose: docker-compose up -d db

--Or local Postgres (see “PostgreSQL setup” below)

Seed admin and manager roles

--npm run start:dev (first time to build)

--ts-node src/seed/seed-roles.ts or npm run seed (if script added)

Start API

--npm run start:dev

Open Swagger

--http://localhost:3000/docs

Frontend

--Served at http://localhost:3000/app if FrontendModule enabled

--Or open src/frontend/public/index.html in a static server

Environment variables
--PORT=3000

--API_KEY=super-secret-api-key

--JWT_SECRET=super-secret-jwt

--DB_HOST=localhost

--DB_PORT=5432

--DB_USER=postgres

--DB_PASSWORD=postgres

--DB_NAME=employment_db

API headers
--Authorization: Bearer <token>

--x-api-key: <API_KEY>

Example workflow
--Register coder: POST /api/auth/register

--Login: POST /api/auth/login

--List vacancies: GET /api/vacancies

--Apply to vacancy: POST /api/applications

--Create vacancy (Manager/Admin): POST /api/vacancies

Testing
--npm run test

--Target coverage ≥ 40% (vacancies/applications services)

Docker
--docker-compose up --build

--Services: api, db (Postgres)

Notes
--Disable synchronize and use migrations in production

--Add rate limiting and CORS if exposing publicly




Español
API de Plataforma de Empleabilidad
API en NestJS para gestionar vacantes y postulaciones con reglas de negocio y seguridad robusta. Incluye autenticación JWT, protección por API Key, control de acceso por roles, validación con DTOs, interceptor global de respuestas, documentación Swagger, pruebas unitarias, Docker y un frontend HTML/CSS moderno y minimalista.

Funcionalidades
Autenticación con JWT y API Key

Acceso por roles: Administrador, Gestor, Coder

Gestión de vacantes con tecnologías, seniority, rango salarial, ubicación, modalidad y cupos

Postulaciones con restricciones:

Sin duplicados por vacante

Respeto de cupo máximo

Máximo 3 vacantes activas por coder

Formato global de respuesta

Swagger con ejemplos

Pruebas unitarias (Jest)

Stack técnico
NestJS, TypeScript, TypeORM, PostgreSQL

JWT, Passport

Swagger

Docker & docker-compose

Frontend HTML/CSS

Puesta en marcha
Clonar el repositorio

Crear .env desde .env.example

Instalar dependencias

npm install

Levantar la base de datos (Postgres)

Con docker-compose: docker-compose up -d db

O Postgres local (ver “Configuración de PostgreSQL” abajo)

Semillas de roles (admin/gestor)

npm run start:dev (primera compilación)

ts-node src/seed/seed-roles.ts o npm run seed (si agregas script)

Iniciar API

npm run start:dev

Abrir Swagger

http://localhost:3000/docs

Frontend

http://localhost:3000/app si habilitas FrontendModule

O sirve src/frontend/public en un servidor estático

Variables de entorno
PORT=3000

API_KEY=super-secret-api-key

JWT_SECRET=super-secret-jwt

DB_HOST=localhost

DB_PORT=5432

DB_USER=postgres

DB_PASSWORD=postgres

DB_NAME=employment_db

Headers de API
Authorization: Bearer <token>

x-api-key: <API_KEY>

Flujo de uso
Registro: POST /api/auth/register

Login: POST /api/auth/login

Listar vacantes: GET /api/vacancies

Postularse: POST /api/applications

Crear vacante (Gestor/Admin): POST /api/vacancies

Pruebas
npm run test

Cobertura objetivo ≥ 40% (servicios de vacantes y postulaciones)

Docker
docker-compose up --build

Servicios: api, db (Postgres)

Notas
En producción, desactiva synchronize y usa migrations

Considera rate limiting y CORS