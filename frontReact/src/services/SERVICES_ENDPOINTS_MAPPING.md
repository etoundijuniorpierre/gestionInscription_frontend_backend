# Services Endpoints Mapping

This document maps all frontend services to their corresponding backend API endpoints as documented in API_ENDPOINTS_DOCUMENTATION.md.

## Authentication Service
**Base URL:** `/auth`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `registerUser` | POST | `/auth/signup` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L7-L27) |
| `loginUser` | POST | `/auth/login` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L30-L44) |
| `activateAccount` | GET | `/auth/activate-account` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L47-L53) |
| `forgotPassword` | POST | `/auth/forgot-password` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L56-L66) |
| `logoutUser` | POST | `/auth/logout` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L69-L75) |
| `getAllUsers` | GET | `/auth/users` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L159-L165) |
| `getUserById` | GET | `/auth/users/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L178-L184) |
| `createUser` | POST | `/auth/signup` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L7-L27) |
| `updateUser` | PUT | `/auth/users/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L187-L193) |
| `deleteUser` | DELETE | `/auth/users/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L196-L202) |
| `toggleUserStatus` | PATCH | `/auth/users/{id}/toggle-status` | Not documented |

## Program Service
**Base URL:** `/programs`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getAllPrograms` | GET | `/programs` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L154-L160) |
| `getProgramById` | GET | `/programs/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L163-L169) |
| `getProgramByCode` | GET | `/programs/code/{programCode}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L197-L203) |
| `createProgram` | POST | `/programs` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L82-L96) |
| `updateProgram` | PUT | `/programs/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L228-L234) |
| `deleteProgram` | DELETE | `/programs/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L263-L269) |

## Module Service
**Base URL:** `/modules`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `createModule` | POST | `/modules` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L685-L691) |
| `getModuleById` | GET | `/modules/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L717-L723) |
| `getModulesByProgramId` | GET | `/modules/program/{programId}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L766-L772) |
| `updateModule` | PUT | `/modules/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L798-L804) |
| `deleteModule` | DELETE | `/modules/{id}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L827-L833) |
| `addModuleToProgram` | POST | `/modules/program/{programId}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L836-L842) |

## Enrollment Management Service
**Base URL:** `/enrollments`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getAllEnrollments` | GET | `/enrollments` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L274-L280) |
| `getEnrollmentById` | GET | `/enrollments/{enrollmentId}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L335-L341) |
| `getEnrollmentsByProgramId` | GET | `/enrollments/program/{programId}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L450-L456) |
| `getEnrollmentsByAcademicYear` | GET | `/enrollments/year/{academicYear}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L509-L515) |
| `getEnrollmentsByProgramAndYear` | GET | `/enrollments/program/{programId}/year/{academicYear}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L567-L573) |
| `getAvailableAcademicYears` | GET | `/enrollments/available-academic-years` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L627-L633) |
| `updateEnrollmentStatus` | PATCH | `/enrollments/{id}/status` | Not documented |
| `updateDocumentStatus` | PATCH | `/enrollments/{enrollmentId}/documents/{documentType}` | Not documented |

## Document Service
**Base URL:** `/images`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `uploadDocument` | POST | `/images/upload` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L565-L571) |
| `getDocumentByName` | GET | `/images/{fileName}` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L574-L580) |

## Payment Service
**Base URL:** `/payments`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `createCheckoutSession` | POST | `/payments/create-session` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L638-L644) |
| `handleWebhook` | POST | `/payments/webhook` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L647-L653) |

## Contact Service
**Base URL:** `/contact`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `submitContactForm` | POST | `/contact` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L658-L664) |

## Statistics Service
**Base URL:** `/statistics`

| Service Function | HTTP Method | Endpoint | Documentation Reference |
|------------------|-------------|----------|-------------------------|
| `getStatistics` | GET | `/statistics` | [API Docs](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\API_ENDPOINTS_DOCUMENTATION.md#L669-L675) |