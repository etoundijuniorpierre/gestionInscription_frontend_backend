# Admin Dashboard Services Mapping

This document verifies that all services used in the adminDashboard components match the API documentation and use proper service functions.

## Components and Their Service Dependencies

### AdminDashboardContent.jsx
- **Service Functions Used:**
  - [getStatistics](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\statisticsService.js#L8-L15) → GET `/statistics` ✓ (from statisticsService.js)

### UserManagement.jsx
- **Service Functions Used:**
  - [getAllUsers](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\userService.js#L74-L82) → GET `/auth/users` ✓ (from userService.js)

### StudentEnrollmentManagement.jsx
- **Service Functions Used:**
  - [getAllEnrollments](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\enrollmentManagementService.js#L6-L14) → GET `/enrollments` ✓ (from enrollmentManagementService.js)
  - [getAvailableAcademicYears](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\enrollmentManagementService.js#L93-L101) → GET `/enrollments/available-academic-years` ✓ (from enrollmentManagementService.js)

### ProgramManagement.jsx
- **Service Functions Used:**
  - [getAllPrograms](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\programService.js#L9-L17) → GET `/programs` ✓ (from programService.js)
  - [deleteProgram](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\programService.js#L78-L86) → DELETE `/programs/{id}` ✓ (from programService.js)

### ModuleManagement.jsx
- **Service Functions Used:**
  - [getModulesByProgramId](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\moduleService.js#L39-L47) → GET `/modules/program/{programId}` ✓ (from moduleService.js)
  - [createModule](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\moduleService.js#L7-L15) → POST `/modules` ✓ (from moduleService.js)
  - [updateModule](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\moduleService.js#L52-L60) → PUT `/modules/{id}` ✓ (from moduleService.js)
  - [deleteModule](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\moduleService.js#L65-L73) → DELETE `/modules/{id}` ✓ (from moduleService.js)
  - [addModuleToProgram](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\moduleService.js#L78-L86) → POST `/modules/program/{programId}` ✓ (from moduleService.js)
  - [getProgramById](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\programService.js#L22-L30) → GET `/programs/{id}` ✓ (from programService.js)

### StudentEnrollmentDetails.jsx
- **Service Functions Used:**
  - [getEnrollmentById](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\enrollmentManagementService.js#L19-L27) → GET `/enrollments/{id}` ✓ (from enrollmentManagementService.js)

### UserForm.jsx
- **Service Functions Used:**
  - [getUserById](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\frontReact\src\services\userService.js#L87-L95) → GET `/auth/users/{id}` ✓ (from userService.js)