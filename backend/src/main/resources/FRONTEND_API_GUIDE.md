# Frontend API Guide

This guide provides essential information for frontend developers working with the Inscription Scolaire backend API.

## Base URL

All API endpoints are prefixed with: `/api/v1`

## Authentication Flow

1. **Register**: `POST /auth/signup`
2. **Activate Account**: `GET /auth/activate-account?token={activation_token}`
3. **Login**: `POST /auth/login`
4. **Use token in Authorization header**: `Bearer {token}`

## Common Headers

- `Authorization: Bearer {token}` (for authenticated requests)
- `Content-Type: application/json` (for JSON requests)
- `Content-Type: multipart/form-data` (for file uploads)

## Key Endpoints for Frontend

### User Authentication & Management

**Registration & Login**
```
POST /auth/signup
POST /auth/login
GET /auth/activate-account?token={token}
POST /auth/forgot-password
POST /auth/resend-activation-code
```

**User Profile**
```
GET /users/{id}          # Get user profile
PATCH /auth/update-password  # Update password
```

### Programs

**Browse Programs**
```
GET /programs            # Get all programs
GET /programs/{id}       # Get specific program
GET /programs/code/{programCode}  # Get program by code
```

### Enrollment Process

**Submit Enrollment**
```
POST /enrollments        # Submit enrollment with data and documents
```

**Manage Enrollments**
```
GET /enrollments/my-enrollments      # Get user's enrollments
GET /enrollments/my-latest           # Get latest enrollment
GET /enrollments/{id}                # Get specific enrollment
DELETE /enrollments/{id}/cancel      # Cancel enrollment
```

**Enrollment Status Messages**

When an enrollment has been validated by an admin, the frontend should display specific messages based on the next required action:

1. For registration fee payment:
   - Status: "En attente de paiement"
   - Message: "Votre dossier a été validé. Vous devez maintenant procéder au paiement des frais d'inscription."
   - Button: "Procéder au paiement" (redirects to payment page)

2. For program payment:
   - Status: "En attente de paiement"
   - Message: "Votre dossier a été validé. Vous devez maintenant procéder au paiement des frais de formation."
   - Button: "Procéder au paiement" (redirects to payment page)

### Payments

**Payment Processing**
```
POST /enrollments/{id}/initiate-payment  # Start payment process
POST /payments/create-session            # Create payment session
GET /payments/my-payments                # Get user's payments
```

### Documents

**Document Management**
```
POST /images/upload                      # Upload document
GET /images/document/{id}/download       # Download document
```

### Notifications

**User Notifications**
```
GET /notifications/all                   # Get all notifications
POST /notifications/mark-all-as-read     # Mark all as read
DELETE /notifications/{id}               # Delete notification
```

## Data Models

### User
```javascript
{
  id: 1,
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  role: "STUDENT",  // or "ADMIN"
  status: true      // active status
}
```

### Program
```javascript
{
  id: 1,
  programCode: "PROG001",
  programName: "Computer Science",
  description: "Learn computer science fundamentals",
  startDate: "2024-09-01",
  endDate: "2025-06-30",
  registrationStartDate: "2024-01-01",
  registrationEndDate: "2024-08-31",
  capacity: 50,
  status: "ENABLED",     // or "DISABLED"
  enrollmentOpen: true   // calculated field
}
```

### Enrollment
```javascript
{
  id: 1,
  status: "DRAFT",       // DRAFT, SUBMITTED, APPROVED, REJECTED, etc.
  createdDate: "2024-01-15T10:30:00Z",
  submissionDate: "2024-01-16T14:20:00Z",
  validationDate: null,
  currentStep: 4,        // out of 5 steps
  programId: 1,
  studentId: 1,
  programName: "Computer Science",
  personalInfo: { /* PersonalInfoDto */ },
  academicInfo: { /* AcademicInfoDto */ },
  contactDetails: { /* ContactDetailsDto */ },
  documents: [ /* array of DocumentDto */ ]
}
```

### Document
```javascript
{
  id: 1,
  name: "transcript.pdf",
  documentType: "TRANSCRIPT",  // or "ID", "PASSPORT", etc.
  uploadDate: "2024-01-15T10:30:00Z",
  validationStatus: "PENDING", // or "APPROVED", "REJECTED"
  rejectionReason: null
}
```

### Payment
```javascript
{
  id: 1,
  amount: 5000,          // in cents ($50.00)
  currency: "usd",
  status: "PENDING",     // or "SUCCESSFUL", "FAILED"
  sessionId: "cs_test_...",
  paymentType: "REGISTRATION_FEE"  // or "PROGRAM_PAYMENT"
}
```

## Error Handling

API responses follow standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses typically include:
```javascript
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for argument",
  "path": "/api/v1/auth/signup"
}
```

## File Uploads

For document uploads, use multipart form data:
```
POST /images/upload
Content-Type: multipart/form-data

file: [file data]
```

## WebSocket Notifications

Real-time notifications are available via WebSocket:
- Endpoint: `/ws` (connect with WebSocket client)
- Subscribe to: `/topic/notifications`
- Send to: `/app/notify` (for testing)

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP for unauthenticated requests
- 500 requests per minute per user for authenticated requests

## Example Usage

### 1. User Registration Flow
```
// 1. Register
await api.post('/auth/signup', {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// 2. Check email for activation link
// 3. Activate account with token from email
await api.get('/auth/activate-account?token=ABC123...');

// 4. Login
const response = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// 5. Store token for future requests
const token = response.data.token;
```

### 2. Enrollment Submission
```
// 1. Prepare enrollment data
const enrollmentData = {
  programId: 1,
  personalInfo: { /* ... */ },
  academicInfo: { /* ... */ },
  contactDetails: { /* ... */ }
};

// 2. Submit enrollment (without documents)
await api.post('/enrollments', {
  enrollmentDtoRequest: JSON.stringify(enrollmentData)
});

// 3. Upload documents separately if needed
const formData = new FormData();
formData.append('file', documentFile);
await api.post('/images/upload', formData);
```

### 3. Payment Processing
```
// 1. Initiate payment
const paymentResponse = await api.post(`/enrollments/${enrollmentId}/initiate-payment`);

// 2. Redirect user to payment gateway
window.location.href = paymentResponse.data.redirectUrl;

// 3. Handle webhook callback (server-side)
// 4. Check payment status
const payments = await api.get('/payments/my-payments');
```

## Environment Variables

The following environment variables may be needed:
- `REACT_APP_API_BASE_URL`: Base URL for API requests
- `REACT_APP_WEBSOCKET_URL`: WebSocket endpoint for notifications

## Best Practices

1. **Always handle errors gracefully**
2. **Implement proper loading states**
3. **Cache data when appropriate**
4. **Use optimistic updates for better UX**
5. **Implement proper form validation**
6. **Handle file upload progress indicators**
7. **Implement proper authentication state management**
8. **Use environment variables for API endpoints**

## Support

For API-related issues, contact the backend team or check:
- API Documentation: `/api/v1/swagger-ui.html`
- API Specification: `/api/v1/v3/api-docs`