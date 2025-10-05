# Frontend API Corrections - Résumé

## Services Corrigés ✅

### 1. paymentService.js
- **Correction**: Path changé de `/payments` à `/api/v1/payments`
- **Raison**: Le PaymentController utilise `@RequestMapping("/api/v1/payments")`

### 2. notificationService.jsx  
- **Correction**: Path changé de `/notifications` à `/api/v1/notifications`
- **Raison**: Le NotificationController utilise `@RequestMapping("/api/v1/notifications")`

### 3. userService.js
- **Correction**: `toggleUserStatus()` réécrit pour utiliser `updateUser()` au lieu d'un endpoint inexistant
- **Raison**: L'endpoint `/users/{id}/toggle-status` n'existe pas dans le backend

### 4. enrollmentService.js
- **Correction**: Documents envoyés avec `data.append('documents', doc)` au lieu de `data.append('documents[${index}]', doc)`
- **Raison**: Le backend attend un paramètre `documents` (List<MultipartFile>)

### 5. enrollmentManagementService.js
- **Corrections**: 
  - `updateEnrollmentStatus()` marqué comme déprécié (endpoint n'existe pas)
  - `updateDocumentStatus()` marqué comme déprécié (endpoint n'existe pas)
- **Raison**: Utiliser `approveEnrollment()`, `rejectEnrollment()`, ou `requestEnrollmentCorrections()` à la place

## Structures de Données à Vérifier dans les Composants

### EnrollmentDtoResponse (Backend)
```javascript
{
  id: number,
  academicYear: string,
  programId: number,
  studentId: number,
  programName: string,
  status: string, // IN_PROGRESS, PENDING, APPROVED, REJECTED, CORRECTIONS_REQUIRED
  createdDate: string,
  lastModifiedDate: string,
  submissionDate: string,
  validationDate: string,
  currentStep: number,
  rejectionReason: string,
  personalInfo: {
    firstName: string,
    lastName: string,
    nationality: string,
    gender: string,
    dateOfBirth: string
  },
  academicInfo: {
    lastInstitution: string,
    specialization: string,
    availableForInternship: boolean,
    startDate: string,
    endDate: string,
    diplomaObtained: string
  },
  contactDetails: {
    email: string,
    phoneNumber: string,
    countryCode: string,
    country: string,
    region: string,
    city: string,
    address: string,
    emergencyContacts: [{
      name: string,
      phone: string,
      countryCode: string,
      relationship: string
    }]
  },
  documents: [{
    id: number,
    name: string,
    contentType: string,
    uploadDate: string,
    validationStatus: string, // PENDING, APPROVED, REJECTED
    documentType: string,
    rejectionReason: string,
    createdDate: string,
    lastModifiedDate: string
  }]
}
```

**Champs manquants dans l'ancienne structure**:
- `programId` et `studentId` (au lieu d'objets complets)
- `programName` (ajouté pour faciliter l'affichage)
- `currentStep` (au lieu de `stepCompleted`)
- `createdDate` et `lastModifiedDate` (champs d'audit)

### ProgramResponseDTO (Backend)
```javascript
{
  id: number,
  programName: string,
  programCode: string,
  description: string,
  certificateName: string,
  careerProspects: string,
  registrationFee: number,
  maxCapacity: number,
  registrationStartDate: string,
  registrationEndDate: string,
  image: string,
  createdDate: string,
  lastModifiedDate: string,
  duration: number,
  price: number,
  startDate: string,
  endDate: string,
  enrollmentOpen: boolean,
  hoursPerDay: number,
  daysPerWeek: number,
  courseDays: string[], // Set<String> en Java
  startTime: string,
  endTime: string,
  learnModules: [{
    id: number,
    moduleName: string,
    moduleDescription: string,
    moduleOrder: number
  }]
}
```

**Champs importants**:
- `courseDays` est un tableau de strings (jours de la semaine)
- `enrollmentOpen` indique si les inscriptions sont ouvertes
- `endDate` est calculé automatiquement par le backend

### UserResponseDto (Backend)
```javascript
{
  id: number,
  firstname: string,
  lastname: string,
  email: string,
  accountLocked: boolean,
  enabled: boolean,
  roleName: string,
  createdDate: string,
  lastModifiedDate: string,
  dateOfBirth: string, // optional
  address: string, // optional
  phoneNumber: string, // optional
  gender: string, // optional
  nationality: string, // optional
  enrollmentIds: number[] // optional, only for students
}
```

**Champs supprimés de l'ancienne structure**:
- `maritalStatus` (n'existe plus dans le backend)
- `desiredAcademicYear` (n'existe plus dans le backend)
- `intendedFieldOfStudy` (n'existe plus dans le backend)

### DocumentDto (Backend)
```javascript
{
  id: number,
  name: string,
  contentType: string,
  uploadDate: string,
  validationStatus: string, // PENDING, APPROVED, REJECTED
  documentType: string,
  rejectionReason: string,
  createdDate: string,
  lastModifiedDate: string
}
```

**Note**: L'upload de document retourne maintenant juste une string (nom du fichier), pas un objet DocumentDto complet.

### StatisticsDto (Backend)
```javascript
{
  totalEnrollments: number,
  validatedEnrollments: number,
  pendingEnrollments: number,
  newAccountsLast24h: number,
  connectedAccounts: number,
  lastValidatedDocument: {
    id: number,
    name: string,
    documentType: string,
    validationDate: string,
    studentName: string,
    programName: string
  },
  lastEnrollment: {
    id: number,
    studentName: string,
    programName: string,
    submissionDate: string,
    status: string
  },
  lastPayment: {
    sessionId: string,
    amount: number,
    currency: string,
    paymentDate: string,
    studentName: string,
    enrollmentId: number
  }
}
```

## Composants à Vérifier/Corriger

### Priorité Haute
1. **StudentEnrollmentDetails.jsx** - Vérifier l'affichage des données d'enrollment
2. **StudentEnrollmentManagement.jsx** - Vérifier les appels à `updateEnrollmentStatus` et `updateDocumentStatus`
3. **ProgramForm.jsx** - Vérifier les champs du formulaire (courseDays, schedule)
4. **ProgramManagement.jsx** - Vérifier l'affichage des programmes
5. **UserManagement.jsx** - Vérifier l'affichage des utilisateurs et le toggle status
6. **AdminDashboardContent.jsx** - Vérifier l'affichage des statistiques

### Priorité Moyenne
7. **CourseCard.jsx** (sections) - Vérifier l'affichage des programmes
8. **CoursesSection.jsx** - Vérifier l'affichage de la liste des programmes
9. **EnrollmentCorrections.jsx** - Vérifier la gestion des corrections
10. **RealTimeStats.jsx** - Vérifier l'affichage des statistiques en temps réel

### Priorité Basse
11. Tous les composants de graphiques/charts - Vérifier les données utilisées

## Actions Recommandées

1. ✅ **Services corrigés** - Endpoints et structures de données alignés avec le backend
2. 🔄 **À faire**: Parcourir chaque composant prioritaire et:
   - Vérifier que les champs affichés existent dans les DTOs
   - Corriger les noms de champs (ex: `stepCompleted` → `currentStep`)
   - Supprimer les références aux champs supprimés
   - Ajouter les nouveaux champs si nécessaire
3. 🔄 **À faire**: Tester les formulaires pour s'assurer qu'ils envoient les bonnes données
4. 🔄 **À faire**: Vérifier la gestion des erreurs et les messages utilisateur

## Endpoints Supprimés/Inexistants

- ❌ `PATCH /enrollments/{id}/status` - Utiliser `/approve`, `/reject`, ou `/request-corrections`
- ❌ `PATCH /enrollments/{enrollmentId}/documents/{documentType}` - Utiliser `/request-corrections`
- ❌ `PATCH /users/{id}/toggle-status` - Utiliser `PUT /users/{id}` avec le champ `enabled`
- ❌ `GET /payments/my-payments` - Endpoint n'existe pas dans le backend
- ❌ Section "Student Endpoints" - Aucun controller correspondant

## Notes Importantes

- Le backend utilise `StatusSubmission` enum avec les valeurs: `IN_PROGRESS`, `PENDING`, `APPROVED`, `REJECTED`, `CORRECTIONS_REQUIRED`
- Le backend utilise `ValidationStatus` enum avec les valeurs: `PENDING`, `APPROVED`, `REJECTED`
- Les dates sont au format ISO 8601 (LocalDateTime, LocalDate)
- Les montants sont en BigDecimal (nombres)
- Le path complet `/api/v1` est configuré dans `application.properties` via `server.servlet.context-path`
