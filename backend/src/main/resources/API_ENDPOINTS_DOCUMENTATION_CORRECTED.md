# API ENDPOINTS DOCUMENTATION

## Base URL
All endpoints are prefixed with: `http://localhost:9090/api/v1`

## Authentication Endpoints

### 1. User Registration
**Endpoint:** POST /auth/signup
**Description:** Register a new user
**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string (email format)",
  "password": "string (minimum 8 characters)",
  "roleName": "string (ADMIN, STUDENT, etc.)"
}
```
**Response:**
- 202 ACCEPTED

### 2. User Login
**Endpoint:** POST /auth/login
**Description:** Authenticate a user
**Request Body:**
```json
{
  "email": "string (email format)",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string (JWT token)",
  "role": "string"
}
```

### 3. Activate Account
**Endpoint:** GET /auth/activate-account
**Description:** Activate a user account via email token
**Request Parameters:**
- token: string (query parameter)
**Response:**
- 200 OK

### 4. Forgot Password
**Endpoint:** POST /auth/forgot-password
**Description:** Send password reset email
**Request Body:**
```json
{
  "email": "string (email format)"
}
```
**Response:**
- 202 ACCEPTED

### 5. Logout
**Endpoint:** POST /auth/logout
**Description:** Logout current user
**Request Body:** None
**Response:**
- 200 OK

### 6. Update Password (Student)
**Endpoint:** PATCH /auth/update-password
**Description:** Update the authenticated user's password with verification of current password
**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Response:**
- 200 OK

## Program Endpoints

### 1. Create Program (Admin only)
**Endpoint:** POST /programs
**Description:** Create a new program
**Request Body:**
```json
{
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```
**Response:**
```json
{
  "id": "integer",
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "enrollmentOpen": "boolean",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "id": "integer",
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```

### 2. Get All Programs
**Endpoint:** GET /programs
**Description:** Retrieve all programs
**Request Parameters:** None
**Response:**
```json
[
  {
    "id": "integer",
    "programName": "string",
    "programCode": "string",
    "description": "string",
    "certificateName": "string",
    "careerProspects": "string",
    "registrationFee": "number (BigDecimal)",
    "maxCapacity": "integer",
    "registrationStartDate": "string (date format)",
    "registrationEndDate": "string (date format)",
    "image": "string",
    "createdDate": "string (date-time format)",
    "lastModifiedDate": "string (date-time format)",
    "duration": "integer (months)",
    "price": "number (BigDecimal)",
    "startDate": "string (date format)",
    "endDate": "string (date format)",
    "enrollmentOpen": "boolean",
    "hoursPerDay": "integer",
    "daysPerWeek": "integer",
    "courseDays": "array of strings",
    "startTime": "string (time format)",
    "endTime": "string (time format)",
    "learnModules": [
      {
        "id": "integer",
        "moduleName": "string",
        "moduleDescription": "string",
        "moduleOrder": "integer"
      }
    ]
  }
]
```

### 3. Get Program by ID
**Endpoint:** GET /programs/{id}
**Description:** Retrieve a specific program by ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "enrollmentOpen": "boolean",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "id": "integer",
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```

### 4. Get Program by Code
**Endpoint:** GET /programs/code/{programCode}
**Description:** Retrieve a specific program by code
**Request Parameters:**
- programCode: string (path parameter)
**Response:**
```json
{
  "id": "integer",
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "enrollmentOpen": "boolean",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "id": "integer",
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```

### 5. Update Program (Admin only)
**Endpoint:** PUT /programs/{id}
**Description:** Update a specific program
**Request Parameters:**
- id: integer (path parameter)
**Request Body:**
```json
{
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```
**Response:**
```json
{
  "id": "integer",
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "enrollmentOpen": "boolean",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "id": "integer",
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```

### 6. Delete Program (Admin only)
**Endpoint:** DELETE /programs/{id}
**Description:** Delete a specific program
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 204 No Content

## Enrollment Endpoints

### 1. Submit or Update Enrollment
**Endpoint:** POST /enrollments
**Description:** Submit or update enrollment form data and documents
**Request Body:**
- multipart/form-data with:
  - enrollmentDtoRequest: JSON string
  - documents: List of files (optional)
**Response:**
- 201 CREATED
```json
{
  "id": "integer",
  "programId": "integer",
  "studentId": "integer",
  "programName": "string",
  "status": "string (IN_PROGRESS, PENDING, APPROVED, REJECTED, CORRECTIONS_REQUIRED)",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "submissionDate": "string (date-time format)",
  "validationDate": "string (date-time format)",
  "currentStep": "integer",
  "rejectionReason": "string",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "nationality": "string",
    "gender": "string",
    "dateOfBirth": "string (date format)"
  },
  "academicInfo": {
    "lastInstitution": "string",
    "specialization": "string",
    "availableForInternship": "boolean",
    "startDate": "string (date format)",
    "endDate": "string (date format)",
    "diplomaObtained": "string"
  },
  "contactDetails": {
    "email": "string",
    "phoneNumber": "string",
    "countryCode": "string",
    "country": "string",
    "region": "string",
    "city": "string",
    "address": "string",
    "emergencyContacts": [
      {
        "name": "string",
        "phone": "string",
        "countryCode": "string",
        "relationship": "string"
      }
    ]
  },
  "documents": [
    {
      "id": "integer",
      "name": "string",
      "contentType": "string",
      "uploadDate": "string (date-time format)",
      "validationStatus": "string (PENDING, APPROVED, REJECTED)",
      "documentType": "string",
      "rejectionReason": "string",
      "createdDate": "string (date-time format)",
      "lastModifiedDate": "string (date-time format)"
    }
  ]
}
```

### 2. Get Enrollment by ID
**Endpoint:** GET /enrollments/{enrollmentId}
**Description:** Retrieve a specific enrollment by ID
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "programId": "integer",
  "studentId": "integer",
  "programName": "string",
  "status": "string (IN_PROGRESS, PENDING, APPROVED, REJECTED, CORRECTIONS_REQUIRED)",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "submissionDate": "string (date-time format)",
  "validationDate": "string (date-time format)",
  "currentStep": "integer",
  "rejectionReason": "string",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "nationality": "string",
    "gender": "string",
    "dateOfBirth": "string (date format)"
  },
  "academicInfo": {
    "lastInstitution": "string",
    "specialization": "string",
    "availableForInternship": "boolean",
    "startDate": "string (date format)",
    "endDate": "string (date format)",
    "diplomaObtained": "string"
  },
  "contactDetails": {
    "email": "string",
    "phoneNumber": "string",
    "countryCode": "string",
    "country": "string",
    "region": "string",
    "city": "string",
    "address": "string",
    "emergencyContacts": [
      {
        "name": "string",
        "phone": "string",
        "countryCode": "string",
        "relationship": "string"
      }
    ]
  },
  "documents": [
    {
      "id": "integer",
      "name": "string",
      "contentType": "string",
      "uploadDate": "string (date-time format)",
      "validationStatus": "string (PENDING, APPROVED, REJECTED)",
      "documentType": "string",
      "rejectionReason": "string",
      "createdDate": "string (date-time format)",
      "lastModifiedDate": "string (date-time format)"
    }
  ]
}
```

### 3. Get My Enrollments
**Endpoint:** GET /enrollments/my-enrollments
**Description:** Retrieve all enrollments for the current user
**Request Parameters:** None
**Response:** Array of EnrollmentDtoResponse (see structure above)

### 4. Get My Latest Enrollment
**Endpoint:** GET /enrollments/my-latest
**Description:** Retrieve the most recent enrollment for the current user
**Request Parameters:** None
**Response:** EnrollmentDtoResponse (see structure above) or null

### 5. Get All Enrollments (Admin only)
**Endpoint:** GET /enrollments/all
**Description:** Retrieve all enrollments
**Request Parameters:** None
**Response:** Array of EnrollmentDtoResponse (see structure above)

### 6. Get All Non-Approved Enrollments (Admin only)
**Endpoint:** GET /enrollments/non-approved
**Description:** Retrieve all non-approved enrollments
**Request Parameters:** None
**Response:** Array of EnrollmentDtoResponse (see structure above)

### 7. Get Enrollments by Program ID (Admin only)
**Endpoint:** GET /enrollments/program/{programId}
**Description:** Retrieve all enrollments for a specific program
**Request Parameters:**
- programId: integer (path parameter)
**Response:** Array of EnrollmentDtoResponse (see structure above)

### 8. Approve Enrollment (Admin only)
**Endpoint:** PATCH /enrollments/{enrollmentId}/approve
**Description:** Approve a specific enrollment
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Response:** EnrollmentDtoResponse (see structure above)

### 9. Request Corrections for Enrollment (Admin only)
**Endpoint:** PATCH /enrollments/{enrollmentId}/request-corrections
**Description:** Request corrections for a specific enrollment
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Request Body:**
```json
[
  {
    "documentId": "integer",
    "reason": "string"
  }
]
```
**Response:** EnrollmentDtoResponse (see structure above)

### 10. Reject Enrollment (Admin only)
**Endpoint:** PATCH /enrollments/{enrollmentId}/reject
**Description:** Reject a specific enrollment
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Request Body:**
```json
{
  "rejectionReason": "string"
}
```
**Response:** EnrollmentDtoResponse (see structure above)

### 11. Initiate Payment for Enrollment
**Endpoint:** POST /enrollments/{enrollmentId}/initiate-payment
**Description:** Initiate payment for a specific enrollment
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Response:**
```json
{
  "sessionId": "string"
}
```

## Document Endpoints

### 1. Upload Document
**Endpoint:** POST /images/upload
**Description:** Upload a document
**Request Body:**
- multipart/form-data with file parameter
**Response:**
- 200 OK with a string (file name or URL)

### 2. Get Document by Name
**Endpoint:** GET /images/{fileName}
**Description:** Retrieve a document by filename
**Request Parameters:**
- fileName: string (path parameter)
**Response:**
- Binary file data (image/png)

### 3. Get Document by ID
**Endpoint:** GET /images/document/{id}
**Description:** Retrieve document metadata by its ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "name": "string",
  "contentType": "string",
  "uploadDate": "string (date-time format)",
  "validationStatus": "string (PENDING, APPROVED, REJECTED)",
  "documentType": "string",
  "rejectionReason": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)"
}
```

### 4. Download Document by ID
**Endpoint:** GET /images/download/{id}
**Description:** Download document file by its ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- Binary file data with appropriate content type

## Module Endpoints

### 1. Create Module (Admin only)
**Endpoint:** POST /modules
**Description:** Create a new module
**Request Body:**
```json
{
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```
**Response:**
```json
{
  "id": "integer",
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```

### 2. Get Module by ID
**Endpoint:** GET /modules/{id}
**Description:** Retrieve a specific module by ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```

### 3. Get Modules by Program ID
**Endpoint:** GET /modules/program/{programId}
**Description:** Retrieve all modules for a specific program
**Request Parameters:**
- programId: integer (path parameter)
**Response:**
```json
[
  {
    "id": "integer",
    "moduleName": "string",
    "moduleDescription": "string",
    "moduleOrder": "integer",
    "programId": "integer"
  }
]
```

### 4. Update Module (Admin only)
**Endpoint:** PUT /modules/{id}
**Description:** Update a specific module
**Request Parameters:**
- id: integer (path parameter)
**Request Body:**
```json
{
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```
**Response:**
```json
{
  "id": "integer",
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```

### 5. Delete Module (Admin only)
**Endpoint:** DELETE /modules/{id}
**Description:** Delete a specific module
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 204 No Content

### 6. Add Module to Program (Admin only)
**Endpoint:** POST /modules/program/{programId}
**Description:** Add a module to a specific program
**Request Parameters:**
- programId: integer (path parameter)
**Request Body:**
```json
{
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer"
}
```
**Response:**
```json
{
  "id": "integer",
  "moduleName": "string",
  "moduleDescription": "string",
  "moduleOrder": "integer",
  "programId": "integer"
}
```

## Payment Endpoints

### 1. Create Payment Session
**Endpoint:** POST /api/v1/payments/create-session
**Description:** Create a Stripe payment session
**Request Body:**
```json
{
  "amount": "integer (in smallest currency unit, e.g., cents)",
  "enrollmentId": "integer"
}
```
**Response:**
```json
{
  "sessionId": "string"
}
```

### 2. Handle Stripe Webhook
**Endpoint:** POST /api/v1/payments/webhook
**Description:** Handle Stripe webhook events
**Request Body:**
- Raw Stripe webhook payload
**Response:**
- 200 OK with "Success" message

## Contact Endpoints

### 1. Submit Contact Form
**Endpoint:** POST /contact
**Description:** Submit a contact form
**Request Body:**
```json
{
  "name": "string",
  "email": "string (email format)",
  "subject": "string",
  "message": "string"
}
```
**Response:**
- 200 OK

## Statistics Endpoints

### 1. Get Statistics
**Endpoint:** GET /statistics
**Description:** Retrieve all statistics
**Request Parameters:** None
**Response:**
```json
{
  "totalEnrollments": "integer",
  "validatedEnrollments": "integer",
  "pendingEnrollments": "integer",
  "newAccountsLast24h": "integer",
  "connectedAccounts": "integer",
  "lastValidatedDocument": {
    "id": "integer",
    "name": "string",
    "documentType": "string",
    "validationDate": "string (date-time format)",
    "studentName": "string",
    "programName": "string"
  },
  "lastEnrollment": {
    "id": "integer",
    "studentName": "string",
    "programName": "string",
    "submissionDate": "string (date-time format)",
    "status": "string"
  },
  "lastPayment": {
    "sessionId": "string",
    "amount": "number (BigDecimal)",
    "currency": "string",
    "paymentDate": "string (date-time format)",
    "studentName": "string",
    "enrollmentId": "integer"
  }
}
```

## User Management Endpoints

### 1. Get All Users (Admin only)
**Endpoint:** GET /users
**Description:** Retrieve a list of all users
**Request Parameters:** None
**Response:**
```json
[
  {
    "id": "integer",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "accountLocked": "boolean",
    "enabled": "boolean",
    "roleName": "string",
    "createdDate": "string (date-time format)",
    "lastModifiedDate": "string (date-time format)",
    "dateOfBirth": "string (date format, optional)",
    "address": "string (optional)",
    "phoneNumber": "string (optional)",
    "gender": "string (optional)",
    "nationality": "string (optional)",
    "enrollmentIds": "array of integers (optional)"
  }
]
```

### 2. Get User by ID (Admin or User themselves)
**Endpoint:** GET /users/{id}
**Description:** Retrieve a specific user by ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "accountLocked": "boolean",
  "enabled": "boolean",
  "roleName": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "dateOfBirth": "string (date format, optional)",
  "address": "string (optional)",
  "phoneNumber": "string (optional)",
  "gender": "string (optional)",
  "nationality": "string (optional)",
  "enrollmentIds": "array of integers (optional)"
}
```

### 3. Update User (Admin only)
**Endpoint:** PUT /users/{id}
**Description:** Update user information
**Request Parameters:**
- id: integer (path parameter)
**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "accountLocked": "boolean",
  "enabled": "boolean",
  "dateOfBirth": "string (date format)",
  "address": "string",
  "phoneNumber": "string",
  "gender": "string",
  "nationality": "string"
}
```
**Response:**
```json
{
  "id": "integer",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "accountLocked": "boolean",
  "enabled": "boolean",
  "roleName": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "dateOfBirth": "string (date format, optional)",
  "address": "string (optional)",
  "phoneNumber": "string (optional)",
  "gender": "string (optional)",
  "nationality": "string (optional)",
  "enrollmentIds": "array of integers (optional)"
}
```

### 4. Delete User (Admin only)
**Endpoint:** DELETE /users/{id}
**Description:** Delete a user
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 204 No Content

### 5. Change User Password (Admin only)
**Endpoint:** PATCH /users/change-password
**Description:** Change a user's password without knowing the old password
**Request Body:**
```json
{
  "userId": "integer",
  "newPassword": "string"
}
```
**Response:**
- 200 OK

### 6. Update Own Password (Student)
**Endpoint:** PATCH /users/update-password
**Description:** Update the authenticated user's password with verification of current password
**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
**Response:**
- 200 OK

## Notification Endpoints

### 1. Get All Notifications
**Endpoint:** GET /api/v1/notifications
**Description:** Retrieve all notifications for the current user
**Request Parameters:** None
**Response:**
```json
[
  {
    "id": "integer",
    "content": "string",
    "createdDate": "string (date-time format)",
    "lastModifiedDate": "string (date-time format)"
  }
]
```

### 2. Get Notification by ID
**Endpoint:** GET /api/v1/notifications/{id}
**Description:** Retrieve a specific notification by ID
**Request Parameters:**
- id: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "content": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)"
}
```

### 3. Mark All Notifications as Read
**Endpoint:** POST /api/v1/notifications/mark-all-as-read
**Description:** Mark all notifications as read for the current user
**Request Parameters:** None
**Response:**
- 200 OK

### 4. Delete Notification
**Endpoint:** DELETE /api/v1/notifications/{id}
**Description:** Delete a specific notification
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 200 OK if deleted, 404 Not Found if notification not found

### 5. Send Notification (WebSocket)
**Endpoint:** MESSAGE /notify
**Description:** Send a notification via WebSocket
**Request Body:**
```json
{
  "content": "string"
}
```
**Response:**
```json
{
  "content": "string"
}
```

### 6. Receive Global Notifications (WebSocket)
**Endpoint:** SUBSCRIBE /topic/notifications
**Description:** Subscribe to receive global notifications
**Response:**
```json
{
  "content": "string"
}
```

## Data Transfer Objects (DTOs)

This section documents all Data Transfer Objects used in the API.

### EnrollmentDtoResponse
Used for returning enrollment information.

```json
{
  "id": "integer",
  "programId": "integer",
  "studentId": "integer",
  "programName": "string",
  "status": "string (IN_PROGRESS, PENDING, APPROVED, REJECTED, CORRECTIONS_REQUIRED)",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "submissionDate": "string (date-time format)",
  "validationDate": "string (date-time format)",
  "currentStep": "integer",
  "rejectionReason": "string",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "nationality": "string",
    "gender": "string",
    "dateOfBirth": "string (date format)"
  },
  "academicInfo": {
    "lastInstitution": "string",
    "specialization": "string",
    "availableForInternship": "boolean",
    "startDate": "string (date format)",
    "endDate": "string (date format)",
    "diplomaObtained": "string"
  },
  "contactDetails": {
    "email": "string",
    "phoneNumber": "string",
    "countryCode": "string",
    "country": "string",
    "region": "string",
    "city": "string",
    "address": "string",
    "emergencyContacts": [
      {
        "name": "string",
        "phone": "string",
        "countryCode": "string",
        "relationship": "string"
      }
    ]
  },
  "documents": [
    {
      "id": "integer",
      "name": "string",
      "contentType": "string",
      "uploadDate": "string (date-time format)",
      "validationStatus": "string (PENDING, APPROVED, REJECTED)",
      "documentType": "string",
      "rejectionReason": "string",
      "createdDate": "string (date-time format)",
      "lastModifiedDate": "string (date-time format)"
    }
  ]
}
```

### DocumentDto
Used for returning document information.

```json
{
  "id": "integer",
  "name": "string",
  "contentType": "string",
  "uploadDate": "string (date-time format)",
  "validationStatus": "string (PENDING, APPROVED, REJECTED)",
  "documentType": "string",
  "rejectionReason": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)"
}
```

### NotificationDto
Used for returning notification information.

```json
{
  "id": "integer",
  "content": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)"
}
```

### UserResponseDto
Used for returning user information.

```json
{
  "id": "integer",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "accountLocked": "boolean",
  "enabled": "boolean",
  "roleName": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "dateOfBirth": "string (date format, optional)",
  "address": "string (optional)",
  "phoneNumber": "string (optional)",
  "gender": "string (optional)",
  "nationality": "string (optional)",
  "enrollmentIds": "array of integers (optional)"
}
```

### ProgramResponseDTO
Used for returning program information including schedule details.

```json
{
  "id": "integer",
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "createdDate": "string (date-time format)",
  "lastModifiedDate": "string (date-time format)",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "enrollmentOpen": "boolean",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "id": "integer",
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```

### ProgramRequestDTO
Used for creating or updating program information.

```json
{
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "certificateName": "string",
  "careerProspects": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
  "startDate": "string (date format)",
  "hoursPerDay": "integer",
  "daysPerWeek": "integer",
  "courseDays": "array of strings",
  "startTime": "string (time format)",
  "endTime": "string (time format)",
  "learnModules": [
    {
      "moduleName": "string",
      "moduleDescription": "string",
      "moduleOrder": "integer"
    }
  ]
}
```
