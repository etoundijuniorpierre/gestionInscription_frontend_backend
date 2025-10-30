# Inscription Scolaire Backend

**Default Admin Credentials:**
- **Email:** teamkf48inscription@gmail.com
- **Password:** Teamkf48inscription@@

The backend of the Inscription Scolaire system is a Spring Boot REST API that provides all the necessary endpoints for managing school enrollments, user authentication, program management, and payment processing.

## 🎯 Overview

This backend application provides:
- User authentication and authorization (JWT-based)
- Student enrollment management
- Program and course management
- Document handling and validation
- Payment processing via Flutterwave
- Email notifications
- Real-time WebSocket notifications
- Admin dashboard APIs

## 🏗️ Architecture

### System Architecture
The backend follows a layered architecture pattern with clear separation of concerns:

```
Client ↔ Controller ↔ Service ↔ Repository ↔ Database
              ↕         ↕         ↕
         Validation  Business   JPA/Hibernate
              ↕         ↕         ↕
         Security    Logging   Connection Pool
```

### Key Architectural Components

1. **Controller Layer**: REST endpoints that handle HTTP requests and responses
2. **Service Layer**: Business logic implementation with transaction management
3. **Repository Layer**: Data access using Spring Data JPA
4. **Security Layer**: JWT-based authentication and authorization with Spring Security
5. **Configuration Layer**: Application configuration and beans setup
6. **Exception Handling**: Global exception handling with custom error responses
7. **Notification System**: WebSocket-based real-time notifications

### Design Patterns Used
- **MVC Pattern**: Model-View-Controller for organizing the application
- **Repository Pattern**: Abstraction of data access logic
- **Service Layer Pattern**: Encapsulation of business logic
- **DTO Pattern**: Data Transfer Objects for API communication
- **Factory Pattern**: For creating notifications and emails
- **Observer Pattern**: For event-driven notifications

### Module Organization
Each functional area is separated into its own package:
- `auth/` - Authentication and authorization
- `user/` - User management
- `program/` - Program and course management
- `enrollment/` - Student enrollment processes
- `document/` - Document handling and validation
- `payment/` - Payment processing with Flutterwave
- `notification/` - Real-time notification system
- `email/` - Email services
- `security/` - Security configuration
- `config/` - Application configuration
- `exception/` - Custom exceptions and handlers

## 🏗️ Technologies

- **Framework**: Spring Boot 3.5.3
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven
- **Payment Processing**: Flutterwave
- **Email**: Spring Mail (Gmail SMTP)
- **ORM**: Hibernate JPA
- **Validation**: Bean Validation (JSR-380)
- **Mapping**: MapStruct for DTO mapping
- **WebSocket**: Spring WebSocket for real-time notifications

## ⚙️ Environment Configuration

This application uses environment variables for configuration through Spring's property resolution mechanism. Environment variables can be set in the system or passed as JVM arguments.

### Required Environment Variables

The following environment variables can be set to override the default values in [application.properties](file:///c:/Users/etoun/Documents/pk48/inscription/soumettre/backend/src/main/resources/application.properties):

```bash
# Server Configuration
SERVER_PORT=9090

# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/inscription_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_complex
JWT_EXPIRATION=3600000

# Frontend URLs
FRONTEND_ACTIVATION_URL=http://localhost:5173/activate-account
FRONTEND_URL=http://localhost:5173

# Flutterwave Payment Configuration
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_flutterwave_encryption_key
```

### Setting Environment Variables

Environment variables can be set in multiple ways:

1. **System Environment Variables** (Linux/Mac):
   ```bash
   export SERVER_PORT=9090
   export DB_URL=jdbc:postgresql://localhost:5432/your_db
   ./mvnw spring-boot:run
   ```

2. **System Environment Variables** (Windows):
   ```cmd
   set SERVER_PORT=9090
   set DB_URL=jdbc:postgresql://localhost:5432/your_db
   mvnw spring-boot:run
   ```

3. **JVM System Properties**:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-DSERVER_PORT=9090 -DDB_URL=jdbc:postgresql://localhost:5432/your_db"
   ```

4. **Program Arguments**:
   ```bash
   java -jar target/inscription-scolaire-0.0.1-SNAPSHOT.jar --SERVER_PORT=9090 --DB_URL=jdbc:postgresql://localhost:5432/your_db
   ```

### Environment-Specific Profiles

The application supports different environments:
- `dev`: Development environment
- `prod`: Production environment

To activate a specific profile, set the `SPRING_PROFILES_ACTIVE` environment variable:

```bash
export SPRING_PROFILES_ACTIVE=dev
```

## 🌐 Ngrok Setup for Development

The application automatically starts ngrok when running in development mode to expose the local server to the internet. This is required for receiving payment webhooks from Flutterwave.

### Installing Ngrok

1. **Download Ngrok**:
   - Visit [https://ngrok.com/](https://ngrok.com/) and create a free account
   - Download the ngrok executable for your operating system
   - Extract the ngrok.exe file

2. **Add Ngrok to System PATH** (Windows):
   - Copy the ngrok.exe file to a directory (e.g., `C:\ngrok\`)
   - Open System Properties → Advanced → Environment Variables
   - In System Variables, find and select "Path", then click "Edit"
   - Click "New" and add the path to your ngrok directory (e.g., `C:\ngrok\`)
   - Click "OK" to save the changes
   - Open a new Command Prompt and verify installation by running:
     ```cmd
     ngrok --version
     ```

3. **Add Ngrok to System PATH** (Linux/Mac):
   - Copy the ngrok executable to a directory in your PATH (e.g., `/usr/local/bin/`)
   - Or add the ngrok directory to your PATH in your shell profile (`.bashrc`, `.zshrc`, etc.):
     ```bash
     export PATH=$PATH:/path/to/ngrok/directory
     ```
   - Reload your shell configuration:
     ```bash
     source ~/.bashrc  # or ~/.zshrc
     ```
   - Verify installation:
     ```bash
     ngrok --version
     ```

### Alternative: Local Ngrok Setup

If you prefer not to add ngrok to your system PATH, you can place the ngrok.exe file in the backend resources directory:

1. Download ngrok.exe
2. Place it in `backend/src/main/resources/` directory
3. The application will automatically use this local copy

Note: The application expects ngrok to be available either in the system PATH or in the resources directory.

## ▶️ Running the Application

### Prerequisites
- Java 17+
- PostgreSQL database
- Maven
- Ngrok (for payment webhook functionality)

### Development Setup

1. **Set up your environment variables** using one of the methods above

2. **Install and configure ngrok** as described in the Ngrok Setup section

3. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```

   Or with a specific profile:
   ```bash
   SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
   ```

   When the application starts, it will automatically:
   - Launch ngrok to expose your local server
   - Display the public URL for accessing your application
   - Show the webhook URL needed for Flutterwave integration

### Building for Production

1. **Package the application**:
   ```bash
   ./mvnw clean package
   ```

2. **Run the JAR file**:
   ```bash
   java -jar target/inscription-scolaire-0.0.1-SNAPSHOT.jar
   ```

## 🐳 Docker Deployment

The application includes a Dockerfile for containerization:

```bash
# Build the Docker image
docker build -t inscription-scolaire-backend .

# Run the container
docker run -p 9090:9090 inscription-scolaire-backend
```

## 📖 API Documentation

Once the application is running, you can access the API documentation:

- **Swagger UI**: http://localhost:9090/swagger-ui.html
- **OpenAPI JSON**: http://localhost:9090/v3/api-docs

## 🛠️ Default Values

If environment variables are not set, the application will use the following default values from [application.properties](file:///c:/Users/etoun/Documents/pk48/inscription/soumettre/backend/src/main/resources/application.properties):
- Server port: 9090
- Database URL: jdbc:postgresql://localhost:5432/inscription_db
- Database username: postgres
- Database password: root
- JWT expiration: 3600000 (1 hour)
- Frontend activation URL: http://localhost:5173/activate-account
- Frontend URL: http://localhost:5173
- Mail username: teamkf48inscription@gmail.com
- Mail password: njdd ruhm daiw iwld

Note: Some variables like JWT secret key do not have secure defaults and should be set explicitly in production.

## 🧪 Testing

Run the test suite with Maven:

```bash
./mvnw test
```

## 📁 Project Structure

```
src/main/java/com/team48/inscriptionscolaire/
├── admin/          # Admin-related controllers and services
├── auth/           # Authentication controllers and services
├── config/         # Configuration classes
├── contact/        # Contact information handling
├── document/       # Document management
├── email/          # Email services
├── enrollment/     # Enrollment management
├── exception/      # Custom exceptions
├── flutterwave/    # Payment processing
├── handler/        # Exception handlers
├── learnModule/    # Learning module management
├── notification/   # Notification system
├── payment/        # Payment-related services
├── program/        # Program and course management
├── role/           # Role management
├── security/       # Security configuration
├── statistics/     # Statistics services
├── student/        # Student-related services
└── user/           # User management
```

## 🤝 Integration Points

- **Frontend**: React application consuming the REST API
- **Database**: PostgreSQL for data persistence
- **Email**: Gmail SMTP for sending notifications
- **Payment**: Flutterwave for processing enrollments
- **Documentation**: Swagger/OpenAPI for API documentation

## 📞 Support

For issues or questions regarding the backend, please contact the development team.