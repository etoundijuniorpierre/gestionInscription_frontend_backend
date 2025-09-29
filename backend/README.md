# Inscription Scolaire Backend

## Environment Configuration

This application uses environment variables for configuration. To run the application, you need to set the required environment variables.

### Required Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```env
# Server Configuration
SERVER_PORT=8080

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

# Frontend Activation URL
FRONTEND_ACTIVATION_URL=https://yourdomain.com/activate-account

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# Admin User Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Environment-Specific Profiles

The application supports different environments:
- `dev`: Development environment
- `prod`: Production environment

To activate a specific profile, set the `SPRING_PROFILES_ACTIVE` environment variable:

```bash
export SPRING_PROFILES_ACTIVE=dev
```

### Running the Application

1. Set up your environment variables in a `.env` file
2. Load the environment variables:
   ```bash
   source .env
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

Or with a specific profile:
```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

### Default Values

If environment variables are not set, the application will use the following default values:
- Server port: 8091
- Database URL: jdbc:postgresql://localhost:5432/inscription_db
- Database username: postgres
- Database password: root
- JWT expiration: 3600000 (1 hour)
- Frontend activation URL: http://localhost:5173/activate-account
- Admin email: menzepohyvesseraphin@gmail.com
- Admin password: admin12345

Note: Some variables like JWT secret key and Stripe keys do not have defaults and must be set explicitly.