# API Documentation for Inscription Scolaire

This document provides a comprehensive overview of all available API endpoints for the Inscription Scolaire backend, organized by functionality to facilitate frontend development.

## Base URL

All API endpoints are prefixed with: `/api/v1`

## Authentication Endpoints

### Register a New User
- **URL**: `/auth/signup`
- **Method**: `POST`
- **Description**: Registers a new user account
- **Request Body**:
  ```json
  {
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: `202 ACCEPTED`
- **Authentication**: Not required

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "string"
  }
  ```
- **Authentication**: Not required

### Activate Account
- **URL**: `/auth/activate-account`
- **Method**: `GET`
- **Description**: Activates a user account using an activation token
- **Query Parameters**: `token` (string)
- **Response**: Redirect or success message
- **Authentication**: Not required

### Forgot Password
- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Description**: Initiates password reset process
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**: `202 ACCEPTED`
- **Authentication**: Not required

### Resend Activation Code
- **URL**: `/auth/resend-activation-code`
- **Method**: `POST`
- **Description**: Resends account activation email
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**: `202 ACCEPTED`
- **Authentication**: Not required

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Logs out the current user
- **Response**: `200 OK`
- **Authentication**: Required (STUDENT or ADMIN)

### Update Password
- **URL**: `/auth/update-password`
- **Method**: `PATCH`
- **Description**: Updates the authenticated user's password
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**: `200 OK`
- **Authentication**: Required (STUDENT)

## User Management Endpoints

### Get All Users
- **URL**: `/users/all`
- **Method**: `GET`
- **Description**: Retrieves all users (Admin only)
- **Response**: Array of User objects
- **Authentication**: Required (ADMIN)

### Get User by ID
- **URL**: `/users/{id}`
- **Method**: `GET`
- **Description**: Retrieves a specific user by ID
- **Response**: User object
- **Authentication**: Required (ADMIN or user themselves)

### Update User
- **URL**: `/users/{id}`
- **Method**: `PUT`
- **Description**: Updates user information (Admin only)
- **Request Body**: UserRequestDto
- **Response**: Updated User object
- **Authentication**: Required (ADMIN)

### Delete User
- **URL**: `/users/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a user (Admin only)
- **Response**: `204 NO CONTENT`
- **Authentication**: Required (ADMIN)

### Change Password (Admin)
- **URL**: `/users/change-password`
- **Method**: `PATCH`
- **Description**: Changes a user's password without knowing the old password (Admin only)
- **Request Body**:
  ```json
  {
    "userId": "integer",
    "newPassword": "string"
  }
  ```
- **Response**: `200 OK`
- **Authentication**: Required (ADMIN)

### Update Password (Student)
- **URL**: `/users/update-password`
- **Method**: `PATCH`
- **Description**: Updates the authenticated user's password with verification of current password
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**: `200 OK`
- **Authentication**: Required (STUDENT)

## Program Endpoints

### Create Program
- **URL**: `/programs`
- **Method**: `POST`
- **Description**: Creates a new program (Admin only)
- **Request Body**: ProgramRequestDTO
- **Response**: ProgramResponseDTO
- **Authentication**: Required (ADMIN)

### Get All Programs
- **URL**: `/programs/all` or `/programs`
- **Method**: `GET`
- **Description**: Retrieves all programs
- **Response**: Array of ProgramResponseDTO objects
- **Authentication**: Not required

### Get Program by ID
- **URL**: `/programs/{id}`
- **Method**: `GET`
- **Description**: Retrieves a specific program by ID
- **Response**: ProgramResponseDTO
- **Authentication**: Not required

### Get Program by Code
- **URL**: `/programs/code/{programCode}`
- **Method**: `GET`
- **Description**: Retrieves a specific program by program code
- **Response**: ProgramResponseDTO
- **Authentication**: Not required

### Update Program
- **URL**: `/programs/{id}`
- **Method**: `PUT`
- **Description**: Updates a program (Admin only)
- **Request Body**: ProgramRequestDTO
- **Response**: ProgramResponseDTO
- **Authentication**: Required (ADMIN)

### Delete Program
- **URL**: `/programs/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a program (Admin only)
- **Response**: `204 NO CONTENT`
- **Authentication**: Required (ADMIN)

## Enrollment Endpoints

### Submit or Update Enrollment
- **URL**: `/enrollments`
- **Method**: `POST`
- **Description**: Submits or updates enrollment form data and documents
- **Request Body**: Multipart form with enrollment data and documents
- **Response**: EnrollmentDtoResponse
- **Authentication**: Required (STUDENT)

### Get Enrollment by ID
- **URL**: `/enrollments/{enrollmentId}`
- **Method**: `GET`
- **Description**: Retrieves a specific enrollment by ID
- **Response**: EnrollmentDtoResponse
- **Authentication**: Required (STUDENT or ADMIN)

### Get My Enrollments
- **URL**: `/enrollments/my-enrollments`
- **Method**: `GET`
- **Description**: Retrieves all enrollments for the authenticated user
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (STUDENT)

### Get My Unpaid Enrollments
- **URL**: `/enrollments/my-unpaid-enrollments`
- **Method**: `GET`
- **Description**: Retrieves unpaid enrollments for the authenticated user
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (STUDENT)

### Get My Unpaid Programs
- **URL**: `/enrollments/my-unpaid-programs`
- **Method**: `GET`
- **Description**: Retrieves programs with unpaid enrollments for the authenticated user
- **Response**: Array of ProgramResponseDTO objects
- **Authentication**: Required (STUDENT)

### Get My Latest Enrollment
- **URL**: `/enrollments/my-latest`
- **Method**: `GET`
- **Description**: Retrieves the most recent enrollment for the authenticated user
- **Response**: EnrollmentDtoResponse
- **Authentication**: Required (STUDENT)

### Get All Enrollments
- **URL**: `/enrollments/all`
- **Method**: `GET`
- **Description**: Retrieves all enrollments (Admin only)
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (ADMIN)

### Get Non-Approved Enrollments
- **URL**: `/enrollments/non-approved`
- **Method**: `GET`
- **Description**: Retrieves all paid enrollments pending validation (Admin only)
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (ADMIN)

### Get Pending Payment Enrollments
- **URL**: `/enrollments/pending-payment`
- **Method**: `GET`
- **Description**: Retrieves all enrollments pending payment (Admin only)
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (ADMIN)

### Get Enrollments by Program
- **URL**: `/enrollments/program/{programId}`
- **Method**: `GET`
- **Description**: Retrieves all enrollments for a specific program (Admin only)
- **Response**: Array of EnrollmentDtoResponse objects
- **Authentication**: Required (ADMIN)

### Approve Enrollment
- **URL**: `/enrollments/{enrollmentId}/approve`
- **Method**: `PATCH`
- **Description**: Approves an enrollment (Admin only)
- **Response**: EnrollmentDtoResponse
- **Authentication**: Required (ADMIN)

### Reject Enrollment
- **URL**: `/enrollments/{enrollmentId}/reject`
- **Method**: `PATCH`
- **Description**: Rejects an enrollment with a reason (Admin only)
- **Request Body**:
  ```json
  {
    "rejectionReason": "string"
  }
  ```
- **Response**: EnrollmentDtoResponse
- **Authentication**: Required (ADMIN)

### Initiate Payment for Enrollment
- **URL**: `/enrollments/{enrollmentId}/initiate-payment`
- **Method**: `POST`
- **Description**: Initiates payment process for an enrollment
- **Response**: PaymentResponseDto
- **Authentication**: Required (STUDENT)

### Cancel Enrollment
- **URL**: `/enrollments/{enrollmentId}/cancel`
- **Method**: `DELETE`
- **Description**: Cancels an enrollment if no payments have been made
- **Response**: Success message or error
- **Authentication**: Required (STUDENT)

## Document Endpoints

### Upload Document
- **URL**: `/images/upload`
- **Method**: `POST`
- **Description**: Uploads a document file
- **Request Body**: Multipart form with file
- **Response**: Success message or error
- **Authentication**: Required (STUDENT)

### Download Document
- **URL**: `/images/document/{id}/download`
- **Method**: `GET`
- **Description**: Downloads a document file by ID
- **Response**: Document file
- **Authentication**: Required (STUDENT or ADMIN)

### Validate Document
- **URL**: `/images/validate/{id}`
- **Method**: `PATCH`
- **Description**: Validates a document (Admin only)
- **Response**: Success message
- **Authentication**: Required (ADMIN)

### Reject Document
- **URL**: `/images/reject/{id}`
- **Method**: `PATCH`
- **Description**: Rejects a document with a reason (Admin only)
- **Request Body**:
  ```json
  {
    "rejectionReason": "string"
  }
  ```
- **Response**: Success message
- **Authentication**: Required (ADMIN)

## Payment Endpoints

### Create Payment Session
- **URL**: `/payments/create-session`
- **Method**: `POST`
- **Description**: Creates a Stripe payment session
- **Request Body**: PaymentRequestDto
- **Response**: PaymentResponseDto
- **Authentication**: Required (STUDENT)

### Get My Payments
- **URL**: `/payments/my-payments`
- **Method**: `GET`
- **Description**: Retrieves all payments for the authenticated user
- **Response**: Array of PaymentDto objects
- **Authentication**: Required (STUDENT)

### Handle Stripe Webhook
- **URL**: `/payments/webhook`
- **Method**: `POST`
- **Description**: Handles Stripe webhook events
- **Request Body**: Stripe webhook payload
- **Response**: Success message
- **Authentication**: Not required (protected by webhook signature)

## Notification Endpoints

### Get All Notifications
- **URL**: `/notifications/all`
- **Method**: `GET`
- **Description**: Retrieves all notifications for the current user
- **Response**: Array of NotificationDto objects
- **Authentication**: Required (STUDENT or ADMIN)

### Get Notification by ID
- **URL**: `/notifications/{id}`
- **Method**: `GET`
- **Description**: Retrieves a specific notification by ID
- **Response**: NotificationDto
- **Authentication**: Required (STUDENT or ADMIN)

### Mark All Notifications as Read
- **URL**: `/notifications/mark-all-as-read`
- **Method**: `POST`
- **Description**: Marks all notifications as read
- **Response**: `200 OK`
- **Authentication**: Required (STUDENT or ADMIN)

### Delete Notification
- **URL**: `/notifications/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a notification
- **Response**: `200 OK` or `404 NOT FOUND`
- **Authentication**: Required (STUDENT or ADMIN)

## Statistics Endpoints

### Get All Statistics
- **URL**: `/statistics/all`
- **Method**: `GET`
- **Description**: Retrieves all detailed statistics (Admin only)
- **Response**: Statistics data object
- **Authentication**: Required (ADMIN)

### Get Statistics by Type
- **URL**: `/statistics/{type}`
- **Method**: `GET`
- **Description**: Retrieves statistics by type (Admin only)
- **Response**: Statistics data object
- **Authentication**: Required (ADMIN)

### Get Candidature Statistics
- **URL**: `/statistics/candidatures`
- **Method**: `GET`
- **Description**: Retrieves only candidature statistics (Admin only)
- **Response**: Statistics data object
- **Authentication**: Required (ADMIN)

### Get Inscription Statistics
- **URL**: `/statistics/inscriptions`
- **Method**: `GET`
- **Description**: Retrieves only inscription statistics (Admin only)
- **Response**: Statistics data object
- **Authentication**: Required (ADMIN)

### Get Real-time Statistics
- **URL**: `/statistics/temps-reel`
- **Method**: `GET`
- **Description**: Retrieves real-time statistics (last 24 hours) (Admin only)
- **Response**: Statistics data object
- **Authentication**: Required (ADMIN)

## Contact Endpoint

### Send Contact Form
- **URL**: `/contact`
- **Method**: `POST`
- **Description**: Sends a contact form message
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- **Response**: `200 OK`
- **Authentication**: Not required

## Data Models

### User
```json
{
  "id": "integer",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "role": "string",
  "status": "boolean"
}
```

### Program
```json
{
  "id": "integer",
  "programCode": "string",
  "programName": "string",
  "description": "string",
  "startDate": "date",
  "endDate": "date",
  "registrationStartDate": "date",
  "registrationEndDate": "date",
  "capacity": "integer",
  "status": "string",
  "enrollmentOpen": "boolean"
}
```

### Enrollment
```json
{
  "id": "integer",
  "status": "string",
  "createdDate": "date",
  "submissionDate": "date",
  "validationDate": "date",
  "currentStep": "integer",
  "programId": "integer",
  "studentId": "integer",
  "programName": "string",
  "rejectionReason": "string",
  "personalInfo": "PersonalInfoDto",
  "academicInfo": "AcademicInfoDto",
  "contactDetails": "ContactDetailsDto",
  "documents": "array of DocumentDto"
}
```

**Enrollment Status Values:**
- `DRAFT`: Enrollment is being prepared by the student
- `SUBMITTED`: Enrollment has been submitted and is awaiting review
- `PENDING_PAYMENT`: Enrollment has been reviewed and payment is required
- `PENDING_VALIDATION`: Registration fee has been paid, awaiting admin validation
- `APPROVED`: Enrollment has been approved by admin
- `REJECTED`: Enrollment has been rejected by admin
- `CANCELLED`: Enrollment has been cancelled by the student

### Document
```json
{
  "id": "integer",
  "name": "string",
  "documentType": "string",
  "uploadDate": "date",
  "validationStatus": "string",
  "rejectionReason": "string"
}
```

### Payment
```json
{
  "id": "integer",
  "amount": "integer",
  "currency": "string",
  "status": "string",
  "sessionId": "string",
  "paymentType": "string"
}
```

**Payment Types:**
- `REGISTRATION_FEE`: Initial application fee (required before admin review)
- `PROGRAM_PAYMENT`: Program enrollment fee (required after admin approval)

### Notification
```json
{
  "id": "integer",
  "content": "string",
  "timestamp": "date",
  "isRead": "boolean"
}
```