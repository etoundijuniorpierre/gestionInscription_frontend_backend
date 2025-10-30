# Inscription Scolaire - School Enrollment Management System

A comprehensive school enrollment management platform that allows students to register for programs and administrators to manage enrollments, payments, and user accounts.

## 🎯 Project Overview

This application provides a complete solution for managing school enrollments with features including:
- Student registration and authentication
- Program and course management
- Document submission and validation
- Payment processing via Flutterwave
- Real-time notifications
- Admin dashboard for enrollment and user management

## 🏗️ Architecture

The project follows a client-server architecture with clear separation of concerns:

### Backend Architecture (Spring Boot)
- **Layered Architecture**: Controller → Service → Repository pattern
- **Security**: JWT-based authentication with Spring Security
- **Database**: PostgreSQL with JPA/Hibernate ORM
- **API Design**: RESTful APIs with proper HTTP status codes
- **Documentation**: OpenAPI 3.0 with Swagger UI
- **Asynchronous Processing**: WebSocket for real-time notifications
- **Payment Integration**: Flutterwave API for payment processing
- **Email Services**: SMTP integration for notifications
- **File Handling**: Secure document upload and storage

### Frontend Architecture (React)
- **Component-Based**: Reusable UI components organized by feature
- **State Management**: React Context API for global state
- **Routing**: React Router for SPA navigation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: Centralized service layer for backend communication
- **Form Management**: Controlled components with validation
- **Real-time Updates**: WebSocket integration for notifications
- **Build System**: Vite for fast development and optimized production builds

## 📁 Project Structure

```
.
├── backend/                 # Spring Boot backend application
│   ├── src/                 # Source code
│   ├── pom.xml              # Maven dependencies
│   └── README.md            # Backend-specific documentation
├── frontReact/              # React frontend application
│   ├── src/                 # Source code
│   ├── package.json         # NPM dependencies
│   └── README.md            # Frontend-specific documentation
├── Dockerfile               # Docker configuration for backend
├── compose.yaml             # Docker Compose for development environment
└── README.md                # This file (General documentation)
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL database
- Maven
- npm/yarn

### Running the Application

1. **Start the backend:**
   ```bash
   cd backend
   # Configure environment variables (see backend/README.md)
   ./mvnw spring-boot:run
   ```

2. **Start the frontend:**
   ```bash
   cd frontReact
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9090
   - Swagger Docs: http://localhost:9090/swagger-ui.html

## 📖 Documentation

- [Backend Documentation](backend/README.md) - Configuration and setup instructions for the backend
- [Frontend Documentation](frontReact/README.md) - Configuration and setup instructions for the frontend
- [API Reference](backend/src/main/resources/API_REFERENCE.json) - Complete API documentation

## 🛠️ Key Features

### For Students:
- Account registration and email verification
- Program browsing and enrollment
- Document upload for verification
- Payment processing
- Enrollment status tracking
- Real-time notifications

### For Administrators:
- User management (students, admins)
- Program and course management
- Enrollment review and approval
- Payment verification
- Statistics dashboard
- Real-time notifications for new enrollments and payments

## 📞 Contact

For support or questions, please contact the development team.