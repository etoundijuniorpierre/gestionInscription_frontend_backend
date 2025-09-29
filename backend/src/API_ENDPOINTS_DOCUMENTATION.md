# API ENDPOINTS DOCUMENTATION

## Authentication Endpoints

### 1. User Registration
**Endpoint:** POST /api/v1/auth/signup
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
```json
{
  "token": "string (JWT token)",
  "role": "string"
}
```

### 2. User Login
**Endpoint:** POST /api/v1/auth/login
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
**Endpoint:** GET /api/v1/auth/activate-account
**Description:** Activate a user account via email token
**Request Parameters:**
- token: string (query parameter)
**Response:**
- 200 OK with HTML response

### 4. Forgot Password
**Endpoint:** POST /api/v1/auth/forgot-password
**Description:** Send password reset email
**Request Body:**
```json
{
  "email": "string (email format)"
}
```
**Response:**
- 200 OK with success message

### 5. Logout
**Endpoint:** POST /api/v1/auth/logout
**Description:** Logout current user
**Request Body:** None
**Response:**
- 200 OK with success message

## Program Endpoints

### 1. Create Program (Admin only)
**Endpoint:** POST /api/v1/programs
**Description:** Create a new program
**Request Body:**
```json
{
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
**Endpoint:** GET /api/v1/programs
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
    "registrationFee": "number (BigDecimal)",
    "maxCapacity": "integer",
    "registrationStartDate": "string (date format)",
    "registrationEndDate": "string (date format)",
    "image": "string",
    "duration": "integer (months)",
    "price": "number (BigDecimal)",
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
**Endpoint:** GET /api/v1/programs/{id}
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
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
**Endpoint:** GET /api/v1/programs/code/{programCode}
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
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
**Endpoint:** PUT /api/v1/programs/{id}
**Description:** Update a specific program
**Request Parameters:**
- id: integer (path parameter)
**Request Body:**
```json
{
  "programName": "string",
  "programCode": "string",
  "description": "string",
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
  "registrationFee": "number (BigDecimal)",
  "maxCapacity": "integer",
  "registrationStartDate": "string (date format)",
  "registrationEndDate": "string (date format)",
  "image": "string",
  "duration": "integer (months)",
  "price": "number (BigDecimal)",
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
**Endpoint:** DELETE /api/v1/programs/{id}
**Description:** Delete a specific program
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 204 No Content

## Enrollment Endpoints

### 1. Create Enrollment
**Endpoint:** POST /api/v1/enrollments
**Description:** Create a new enrollment
**Request Body:**
```json
{
  "lastName": "string",
  "firstName": "string",
  "gender": "string",
  "dateOfBirth": "string (date format)",
  "nationality": "string",
  "identityDocumentType": "string",
  "identityDocumentNumber": "string",
  "issueDate": "string (date format)",
  "expirationDate": "string (date format)",
  "placeOfIssue": "string",
  "diploma1Name": "string",
  "diploma1Status": "string",
  "diploma2Name": "string",
  "diploma2Status": "string",
  "cniRectoName": "string",
  "cniRectoStatus": "string",
  "cniVersoName": "string",
  "cniVersoStatus": "string",
  "birthCertificateName": "string",
  "birthCertificateStatus": "string",
  "passportPhotoName": "string",
  "passportPhotoStatus": "string",
  "lastInstitution": "string",
  "specialization": "string",
  "availableForInternship": "boolean",
  "startDate": "string (date format)",
  "endDate": "string (date format)",
  "email": "string (email format)",
  "phoneNumber": "string",
  "countryCode": "string",
  "country": "string",
  "region": "string",
  "city": "string",
  "address": "string",
  "emergencyContacts": [
    {
      "name": "string",
      "relationship": "string",
      "phoneNumber": "string",
      "countryCode": "string"
    }
  ]
}
```
**Response:**
```json
{
  "id": "integer",
  "academicYear": "string",
  "submissionDate": "string (date-time format)",
  "status": "string",
  "validationDate": "string (date-time format)",
  "rejectionReason": "string",
  "student": {
    "id": "integer",
    "firstname": "string",
    "lastname": "string",
    "email": "string"
  },
  "program": {
    "id": "integer",
    "programName": "string",
    "programCode": "string"
  },
  "personalInfo": {
    "lastName": "string",
    "firstName": "string",
    "gender": "string",
    "dateOfBirth": "string (date format)",
    "nationality": "string",
    "identityDocumentType": "string",
    "identityDocumentNumber": "string",
    "issueDate": "string (date format)",
    "expirationDate": "string (date format)",
    "placeOfIssue": "string"
  },
  "academicInfo": {
    "lastInstitution": "string",
    "specialization": "string",
    "availableForInternship": "boolean",
    "startDate": "string (date format)",
    "endDate": "string (date format)"
  },
  "contactDetails": {
    "email": "string",
    "phoneNumber": "string",
    "countryCode": "string",
    "country": "string",
    "region": "string",
    "city": "string",
    "address": "string"
  },
  "stepCompleted": "integer"
}
```

### 2. Get Enrollment by ID
**Endpoint:** GET /api/v1/enrollments/{enrollmentId}
**Description:** Retrieve a specific enrollment by ID
**Request Parameters:**
- enrollmentId: integer (path parameter)
**Response:**
```json
{
  "id": "integer",
  "academicYear": "string",
  "submissionDate": "string (date-time format)",
  "status": "string",
  "validationDate": "string (date-time format)",
  "rejectionReason": "string",
  "student": {
    "id": "integer",
    "firstname": "string",
    "lastname": "string",
    "email": "string"
  },
  "program": {
    "id": "integer",
    "programName": "string",
    "programCode": "string"
  },
  "personalInfo": {
    "lastName": "string",
    "firstName": "string",
    "gender": "string",
    "dateOfBirth": "string (date format)",
    "nationality": "string",
    "identityDocumentType": "string",
    "identityDocumentNumber": "string",
    "issueDate": "string (date format)",
    "expirationDate": "string (date format)",
    "placeOfIssue": "string"
  },
  "academicInfo": {
    "lastInstitution": "string",
    "specialization": "string",
    "availableForInternship": "boolean",
    "startDate": "string (date format)",
    "endDate": "string (date format)"
  },
  "contactDetails": {
    "email": "string",
    "phoneNumber": "string",
    "countryCode": "string",
    "country": "string",
    "region": "string",
    "city": "string",
    "address": "string"
  },
  "stepCompleted": "integer"
}
```

### 3. Get My Enrollments
**Endpoint:** GET /api/v1/enrollments/my-enrollments
**Description:** Retrieve all enrollments for the current user
**Request Parameters:** None
**Response:**
```json
[
  {
    "id": "integer",
    "academicYear": "string",
    "submissionDate": "string (date-time format)",
    "status": "string",
    "validationDate": "string (date-time format)",
    "rejectionReason": "string",
    "student": {
      "id": "integer",
      "firstname": "string",
      "lastname": "string",
      "email": "string"
    },
    "program": {
      "id": "integer",
      "programName": "string",
      "programCode": "string"
    },
    "personalInfo": {
      "lastName": "string",
      "firstName": "string",
      "gender": "string",
      "dateOfBirth": "string (date format)",
      "nationality": "string",
      "identityDocumentType": "string",
      "identityDocumentNumber": "string",
      "issueDate": "string (date format)",
      "expirationDate": "string (date format)",
      "placeOfIssue": "string"
    },
    "academicInfo": {
      "lastInstitution": "string",
      "specialization": "string",
      "availableForInternship": "boolean",
      "startDate": "string (date format)",
      "endDate": "string (date format)"
    },
    "contactDetails": {
      "email": "string",
      "phoneNumber": "string",
      "countryCode": "string",
      "country": "string",
      "region": "string",
      "city": "string",
      "address": "string"
    },
    "stepCompleted": "integer"
  }
]
```

### 4. Get Enrollments by Program ID
**Endpoint:** GET /api/v1/enrollments/program/{programId}
**Description:** Retrieve all enrollments for a specific program
**Request Parameters:**
- programId: integer (path parameter)
**Response:**
```json
[
  {
    "id": "integer",
    "academicYear": "string",
    "submissionDate": "string (date-time format)",
    "status": "string",
    "validationDate": "string (date-time format)",
    "rejectionReason": "string",
    "student": {
      "id": "integer",
      "firstname": "string",
      "lastname": "string",
      "email": "string"
    },
    "program": {
      "id": "integer",
      "programName": "string",
      "programCode": "string"
    },
    "personalInfo": {
      "lastName": "string",
      "firstName": "string",
      "gender": "string",
      "dateOfBirth": "string (date format)",
      "nationality": "string",
      "identityDocumentType": "string",
      "identityDocumentNumber": "string",
      "issueDate": "string (date format)",
      "expirationDate": "string (date format)",
      "placeOfIssue": "string"
    },
    "academicInfo": {
      "lastInstitution": "string",
      "specialization": "string",
      "availableForInternship": "boolean",
      "startDate": "string (date format)",
      "endDate": "string (date format)"
    },
    "contactDetails": {
      "email": "string",
      "phoneNumber": "string",
      "countryCode": "string",
      "country": "string",
      "region": "string",
      "city": "string",
      "address": "string"
    },
    "stepCompleted": "integer"
  }
]
```

### 5. Get Enrollments by Academic Year
**Endpoint:** GET /api/v1/enrollments/year/{academicYear}
**Description:** Retrieve all enrollments for a specific academic year
**Request Parameters:**
- academicYear: string (path parameter)
**Response:**
```json
[
  {
    "id": "integer",
    "academicYear": "string",
    "submissionDate": "string (date-time format)",
    "status": "string",
    "validationDate": "string (date-time format)",
    "rejectionReason": "string",
    "student": {
      "id": "integer",
      "firstname": "string",
      "lastname": "string",
      "email": "string"
    },
    "program": {
      "id": "integer",
      "programName": "string",
      "programCode": "string"
    },
    "personalInfo": {
      "lastName": "string",
      "firstName": "string",
      "gender": "string",
      "dateOfBirth": "string (date format)",
      "nationality": "string",
      "identityDocumentType": "string",
      "identityDocumentNumber": "string",
      "issueDate": "string (date format)",
      "expirationDate": "string (date format)",
      "placeOfIssue": "string"
    },
    "academicInfo": {
      "lastInstitution": "string",
      "specialization": "string",
      "availableForInternship": "boolean",
      "startDate": "string (date format)",
      "endDate": "string (date format)"
    },
    "contactDetails": {
      "email": "string",
      "phoneNumber": "string",
      "countryCode": "string",
      "country": "string",
      "region": "string",
      "city": "string",
      "address": "string"
    },
    "stepCompleted": "integer"
  }
]
```

### 6. Get Enrollments by Program ID and Academic Year
**Endpoint:** GET /api/v1/enrollments/program/{programId}/year/{academicYear}
**Description:** Retrieve all enrollments for a specific program and academic year
**Request Parameters:**
- programId: integer (path parameter)
- academicYear: string (path parameter)
**Response:**
```json
[
  {
    "id": "integer",
    "academicYear": "string",
    "submissionDate": "string (date-time format)",
    "status": "string",
    "validationDate": "string (date-time format)",
    "rejectionReason": "string",
    "student": {
      "id": "integer",
      "firstname": "string",
      "lastname": "string",
      "email": "string"
    },
    "program": {
      "id": "integer",
      "programName": "string",
      "programCode": "string"
    },
    "personalInfo": {
      "lastName": "string",
      "firstName": "string",
      "gender": "string",
      "dateOfBirth": "string (date format)",
      "nationality": "string",
      "identityDocumentType": "string",
      "identityDocumentNumber": "string",
      "issueDate": "string (date format)",
      "expirationDate": "string (date format)",
      "placeOfIssue": "string"
    },
    "academicInfo": {
      "lastInstitution": "string",
      "specialization": "string",
      "availableForInternship": "boolean",
      "startDate": "string (date format)",
      "endDate": "string (date format)"
    },
    "contactDetails": {
      "email": "string",
      "phoneNumber": "string",
      "countryCode": "string",
      "country": "string",
      "region": "string",
      "city": "string",
      "address": "string"
    },
    "stepCompleted": "integer"
  }
]
```

### 7. Get Available Academic Years
**Endpoint:** GET /api/v1/enrollments/available-academic-years
**Description:** Retrieve all available academic years
**Request Parameters:** None
**Response:**
```json
[
  "string"
]
```

## Document Endpoints

### 1. Upload Document
**Endpoint:** POST /api/v1/images/upload
**Description:** Upload a document
**Request Body:**
- multipart/form-data with file parameter
**Response:**
```json
{
  "id": "integer",
  "contentType": "string",
  "name": "string",
  "validationStatus": "string",
  "rejectionReason": "string",
  "uploadDate": "string (date-time format)",
  "validationDate": "string (date-time format)",
  "documentType": "string"
}
```

### 2. Get Document by Name
**Endpoint:** GET /api/v1/images/{fileName}
**Description:** Retrieve a document by filename
**Request Parameters:**
- fileName: string (path parameter)
**Response:**
- Binary file data

## Module Endpoints

### 1. Create Module
**Endpoint:** POST /api/v1/modules
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
**Endpoint:** GET /api/v1/modules/{id}
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
**Endpoint:** GET /api/v1/modules/program/{programId}
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

### 4. Update Module
**Endpoint:** PUT /api/v1/modules/{id}
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

### 5. Delete Module
**Endpoint:** DELETE /api/v1/modules/{id}
**Description:** Delete a specific module
**Request Parameters:**
- id: integer (path parameter)
**Response:**
- 204 No Content

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
**Endpoint:** POST /api/v1/contact
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
- 200 OK with success message

## Statistics Endpoints

### 1. Get Statistics
**Endpoint:** GET /api/v1/statistics
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