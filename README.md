Task Management System
A full-stack web application for managing tasks within an organization. The system supports role-based access control, department management, deadline tracking, and real-time task status transitions.

Table of Contents

Overview
Features
Technology Stack
Architecture
Getting Started
Environment Configuration
Database Migrations
API Documentation


Overview
Task Management System is a corporate task tracker designed for teams working within departments. It allows administrators and creators to assign tasks to executors, track deadlines, manage departments and users, and monitor task progress through a defined status lifecycle.
The backend is built with Spring Boot and exposes a REST API secured with JWT authentication. The frontend is a React single-page application that communicates with the backend over HTTP.

Features

JWT-based authentication and authorization
Role-based access control with three roles: ADMIN, CREATOR, EXECUTOR
Full CRUD for tasks, users, and departments
Task status lifecycle management with transition validation
Deadline tracking with automatic expiration and near-deadline flagging
Extension request workflow for task deadlines
Task notes with visibility control (public and internal)
Department management with user assignment
Scheduled background jobs for deadline checks
Swagger UI for API exploration
React frontend with role-aware interface


Technology Stack
Backend
TechnologyVersionPurposeJava17Primary programming languageSpring Boot3.4.4Application frameworkSpring Security6.xAuthentication and authorizationSpring Data JPA3.xDatabase access layerHibernate6.6.xORM implementationPostgreSQL18.xRelational databaseFlyway10.xDatabase schema migrationsJWT (jjwt)0.12.6Token-based authenticationLomboklatestBoilerplate code reductionSpringDoc OpenAPI2.8.6Swagger UI and API documentationMaven3.xBuild tool and dependency management
Frontend
TechnologyVersionPurposeReact18.xUI frameworkTypeScript5.xType-safe JavaScriptVite5.xBuild tool and dev serverTailwind CSS3.xUtility-first CSS frameworkAxios1.xHTTP clientReact Router6.xClient-side routing

Architecture
The application follows a layered architecture on the backend:
Controller Layer  ->  Service Layer  ->  Repository Layer  ->  Database

Controllers handle HTTP requests, enforce method-level security with @PreAuthorize, and delegate business logic to services.
Services contain all business logic, transaction management, and data transformation.
Repositories extend JpaRepository and provide database access with custom JPQL and native queries where needed.
DTOs are used for all request and response payloads to avoid exposing entity internals.

The frontend follows a component-based architecture with a shared AuthContext for authentication state, a centralized Axios instance with request interceptors for token injection, and page-level components for each route.

Getting Started
Prerequisites

Java 17 or higher
Maven 3.6 or higher
PostgreSQL 14 or higher
Node.js 18 or higher
npm 9 or higher

Backend Setup

Clone the repository:

bashgit clone https://github.com/your-username/task-management.git
cd task-management

Create a PostgreSQL database:

sqlCREATE DATABASE task_management;

Configure the application properties (see Environment Configuration).
Run the backend:

bashcd task-management
mvn spring-boot:run
The backend will start on http://localhost:8080. On first run, Flyway will automatically apply all database migrations, and a default admin user will be created.
Default admin credentials:
Email:    admin@taskmanager.com
Password: admin123
Frontend Setup
bashcd task-management-front
npm install
npm run dev
The frontend will start on http://localhost:5173.

API Documentation
Swagger UI is available at:
http://localhost:8080/swagger-ui/index.html
Main Endpoints
Authentication
POST   /api/auth/login        Login and receive JWT token
GET    /api/auth/me           Get current authenticated user
Users
GET    /api/users             Get all active users
GET    /api/users/{id}        Get user by ID
POST   /api/users             Create user (ADMIN only)
PUT    /api/users/{id}        Update user (ADMIN only)
DELETE /api/users/{id}        Deactivate user (ADMIN only)
Departments
GET    /api/departments                        Get all departments
GET    /api/departments/{id}                   Get department by ID
POST   /api/departments                        Create department (ADMIN only)
PUT    /api/departments/{id}                   Update department (ADMIN only)
DELETE /api/departments/{id}                   Delete department (ADMIN only)
GET    /api/departments/{id}/available-users   Get users without a department
POST   /api/departments/{id}/users             Add users to department (ADMIN only)
Tasks
GET    /api/tasks                         Get all tasks
GET    /api/tasks/{id}                    Get task by ID
GET    /api/tasks/department/{id}         Get tasks by department
GET    /api/tasks/executor/{id}           Get tasks by executor
GET    /api/tasks/status/{status}         Get tasks by status
POST   /api/tasks                         Create task
PUT    /api/tasks/{id}                    Update task
PATCH  /api/tasks/{id}/status             Update task status
DELETE /api/tasks/{id}                    Delete task (ADMIN only)
POST   /api/tasks/{id}/extension/request  Request deadline extension (EXECUTOR)
POST   /api/tasks/{id}/extension/approve  Approve extension (ADMIN, CREATOR)
POST   /api/tasks/{id}/extension/reject   Reject extension (ADMIN, CREATOR)
Task Notes
GET    /api/notes/task/{taskId}         Get all notes for a task
GET    /api/notes/task/{taskId}/public  Get public notes only
POST   /api/notes                       Create note
DELETE /api/notes/{id}                  Delete note
