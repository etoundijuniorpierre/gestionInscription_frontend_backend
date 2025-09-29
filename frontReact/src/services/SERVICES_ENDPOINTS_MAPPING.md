# Services Endpoints Mapping

This document maps all frontend services to their corresponding backend API endpoints as documented in API_ENDPOINTS_DOCUMENTATION.txt.

## Authentication Service
**Base URL:** `/auth`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `registerUser` | POST | `/auth/signup` | User Registration |
| `loginUser` | POST | `/auth/login` | User Login |
| `activateAccount` | GET | `/auth/activate-account` | Activate Account |
| `forgotPassword` | POST | `/auth/forgot-password` | Forgot Password |
| `logoutUser` | POST | `/auth/logout` | Logout |
| `getAllUsers` | GET | `/auth/users` | *(Custom endpoint, not in documentation)* |
| `getUserById` | GET | `/auth/users/{id}` | *(Custom endpoint, not in documentation)* |
| `updateUser` | PUT | `/auth/users/{id}` | *(Custom endpoint, not in documentation)* |
| `deleteUser` | DELETE | `/auth/users/{id}` | *(Custom endpoint, not in documentation)* |
| `toggleUserStatus` | PATCH | `/auth/users/{id}/toggle-status` | *(Custom endpoint, not in documentation)* |

## Program Service
**Base URL:** `/programs`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getAllPrograms` | GET | `/programs` | Get All Programs |
| `getProgramById` | GET | `/programs/{id}` | Get Program by ID |
| `getProgramByCode` | GET | `/programs/code/{programCode}` | Get Program by Code |
| `createProgram` | POST | `/programs` | Create Program (Admin only) |
| `updateProgram` | PUT | `/programs/{id}` | Update Program (Admin only) |
| `deleteProgram` | DELETE | `/programs/{id}` | Delete Program (Admin only) |

## Enrollment Management Service
**Base URL:** `/enrollments`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getAllEnrollments` | GET | `/enrollments` | *(Custom endpoint, not in documentation)* |
| `getEnrollmentById` | GET | `/enrollments/{enrollmentId}` | Get Enrollment by ID |
| `getEnrollmentsByProgramId` | GET | `/enrollments/program/{programId}` | Get Enrollments by Program ID |
| `getEnrollmentsByAcademicYear` | GET | `/enrollments/year/{academicYear}` | Get Enrollments by Academic Year |
| `getEnrollmentsByProgramAndYear` | GET | `/enrollments/program/{programId}/year/{academicYear}` | Get Enrollments by Program ID and Academic Year |
| `getAvailableAcademicYears` | GET | `/enrollments/available-academic-years` | Get Available Academic Years |
| `updateEnrollmentStatus` | PATCH | `/enrollments/{id}/status` | *(Custom endpoint, not in documentation)* |
| `updateDocumentStatus` | PATCH | `/enrollments/{enrollmentId}/documents/{documentType}` | *(Custom endpoint, not in documentation)* |

## Enrollment Service
**Base URL:** `/enrollments`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getLatestEnrollment` | GET | `/enrollments/my-latest` | *(Custom endpoint, not in documentation)* |
| `getMyEnrollments` | GET | `/enrollments/my-enrollments` | Get My Enrollments |
| `submitEnrollmentForm` | POST | `/enrollments` | Create Enrollment |

## Statistics Service
**Base URL:** `/statistics`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getStatistics` | GET | `/statistics` | Get Statistics |

## Document Service
**Base URL:** `/images`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `uploadDocument` | POST | `/images/upload` | Upload Document |
| `getDocumentByName` | GET | `/images/{fileName}` | Get Document by Name |

## Notification Service
**Base URL:** `/notifications`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getNotifications` | GET | `/notifications` | *(Custom endpoint, not in documentation)* |
| `markAllAsRead` | POST | `/notifications/mark-all-as-read` | *(Custom endpoint, not in documentation)* |

## Payment Service
**Base URL:** `/payments`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `createCheckoutSession` | POST | `/payments/create-session` | Create Payment Session |
| `handleWebhook` | POST | `/payments/webhook` | Handle Stripe Webhook |

## Contact Service
**Base URL:** `/contact`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `submitContactForm` | POST | `/contact` | Submit Contact Form |

## Module Service
**Base URL:** `/modules`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `createModule` | POST | `/modules` | Create Module |
| `getModuleById` | GET | `/modules/{id}` | Get Module by ID |
| `getModulesByProgramId` | GET | `/modules/program/{programId}` | Get Modules by Program ID |
| `updateModule` | PUT | `/modules/{id}` | Update Module |
| `deleteModule` | DELETE | `/modules/{id}` | Delete Module |

## Notes

1. **Authentication Endpoints**: The userService.js implements several endpoints that are not explicitly documented in the API documentation. These appear to be custom endpoints that may need to be verified against the actual backend implementation.

2. **Enrollment Endpoints**: Some endpoints in enrollmentManagementService.js and enrollmentService.js use variations of the documented endpoints or custom endpoints that may need verification.

3. **Notification Endpoints**: The notification endpoints are custom and not documented in the API documentation.

4. **All services properly use the base API URL** (`http://localhost:9090/api/v1`) as configured in `api.js`.

5. **Error handling has been implemented** in all service functions with try/catch blocks that log errors to the console.