# Plan de Corrections Frontend - Basé sur API_ENDPOINTS_DOCUMENTATION_CORRECTED.md

## Résumé
Ce document identifie les corrections nécessaires dans le frontend React pour aligner les endpoints, les structures de données (DTOs) et l'affichage avec la documentation API corrigée.

## État des Services

### ✅ Services Corrects (Aucune modification nécessaire)
1. **api.js** - Configuration de base correcte
2. **enrollmentService.js** - Endpoints corrects
3. **enrollmentManagementService.js** - Endpoints corrects
4. **programService.js** - Endpoints corrects
5. **userService.js** - Endpoints corrects
6. **documentService.js** - Endpoints corrects
7. **moduleService.js** - Endpoints corrects
8. **statisticsService.js** - Endpoints corrects

### ⚠️ Services Nécessitant des Corrections

#### paymentService.js
**Problème**: Endpoint incorrect pour initier le paiement d'une inscription
- **Actuel**: Utilise `/api/v1/payments/create-session`
- **Correct selon API**: `/enrollments/{enrollmentId}/initiate-payment` (POST)
- **Action**: Ajouter une fonction `initiateEnrollmentPayment(enrollmentId)`

## Corrections Nécessaires dans les Composants

### 1. StudentEnrollmentDetails.jsx

#### Problèmes Identifiés:
1. **Structure des documents incorrecte**
   - Actuel: Traite `documents` comme un objet avec des clés
   - Correct: `documents` est un **array** d'objets DocumentDto
   
2. **Champs manquants dans l'affichage**
   - Ne montre pas: `createdDate`, `lastModifiedDate` de l'enrollment
   - Documents: Ne montre pas `uploadDate`, `createdDate`, `lastModifiedDate`, `documentType`

3. **Structure EnrollmentDtoResponse**
   ```json
   {
     "id": integer,
     "academicYear": string,
     "programId": integer,
     "studentId": integer,
     "programName": string,
     "status": string (IN_PROGRESS, PENDING, APPROVED, REJECTED, CORRECTIONS_REQUIRED),
     "createdDate": string (date-time),
     "lastModifiedDate": string (date-time),
     "submissionDate": string (date-time),
     "validationDate": string (date-time),
     "currentStep": integer,
     "rejectionReason": string,
     "personalInfo": {
       "firstName": string,
       "lastName": string,
       "nationality": string,
       "gender": string,
       "dateOfBirth": string (date)
     },
     "academicInfo": {
       "lastInstitution": string,
       "specialization": string,
       "availableForInternship": boolean,
       "startDate": string (date),
       "endDate": string (date),
       "diplomaObtained": string
     },
     "contactDetails": {
       "email": string,
       "phoneNumber": string,
       "countryCode": string,
       "country": string,
       "region": string,
       "city": string,
       "address": string,
       "emergencyContacts": [
         {
           "name": string,
           "phone": string,
           "countryCode": string,
           "relationship": string
         }
       ]
     },
     "documents": [
       {
         "id": integer,
         "name": string,
         "contentType": string,
         "uploadDate": string (date-time),
         "validationStatus": string (PENDING, APPROVED, REJECTED),
         "documentType": string,
         "rejectionReason": string,
         "createdDate": string (date-time),
         "lastModifiedDate": string (date-time)
       }
     ]
   }
   ```

#### Actions Requises:
- Modifier la logique de traitement des documents (array au lieu d'objet)
- Ajouter l'affichage de tous les champs de DocumentDto
- Corriger les actions de validation/rejet de documents pour utiliser `requestEnrollmentCorrections`

### 2. StudentEnrollmentManagement.jsx

#### Problèmes Identifiés:
1. **Champs d'affichage manquants**
   - Ne montre pas: `createdDate`, `lastModifiedDate`
   - Devrait afficher le nom complet de l'étudiant depuis `personalInfo`

2. **Filtres**
   - Vérifier que les filtres utilisent les bonnes valeurs de statut API

#### Actions Requises:
- Ajouter colonnes pour `createdDate`, `lastModifiedDate`
- Extraire et afficher le nom de l'étudiant depuis `personalInfo.firstName` et `personalInfo.lastName`

### 3. Composants Student Dashboard

#### Step1PersonalInfo.jsx
**Champs PersonalInfo selon API**:
- firstName
- lastName
- nationality
- gender
- dateOfBirth

#### Step2Documents.jsx
**Structure DocumentDto**:
- Vérifier que les documents uploadés correspondent à la structure attendue
- Les documents sont envoyés via FormData dans `submitEnrollmentForm`

#### Step3AcademicInfo.jsx
**Champs AcademicInfo selon API**:
- lastInstitution
- specialization
- availableForInternship (boolean)
- startDate
- endDate
- diplomaObtained

#### Step4ContactInfo.jsx
**Champs ContactDetails selon API**:
- email
- phoneNumber
- countryCode
- country
- region
- city
- address
- emergencyContacts (array):
  - name
  - phone
  - countryCode
  - relationship

#### MyEnrollments.jsx
**Affichage EnrollmentDtoResponse**:
- Afficher tous les champs pertinents de l'enrollment
- Utiliser la structure correcte pour accéder aux données imbriquées

#### EnrollmentCorrections.jsx
**Corrections de documents**:
- Traiter `documents` comme un array
- Afficher les documents avec `validationStatus === 'REJECTED'`
- Permettre le re-upload via `submitEnrollmentForm`

### 4. ProgramForm.jsx et ProgramManagement.jsx

#### Structure ProgramResponseDTO:
```json
{
  "id": integer,
  "programName": string,
  "programCode": string,
  "description": string,
  "certificateName": string,
  "careerProspects": string,
  "registrationFee": number,
  "maxCapacity": integer,
  "registrationStartDate": string (date),
  "registrationEndDate": string (date),
  "image": string,
  "createdDate": string (date-time),
  "lastModifiedDate": string (date-time),
  "duration": integer (months),
  "price": number,
  "startDate": string (date),
  "endDate": string (date),
  "enrollmentOpen": boolean,
  "hoursPerDay": integer,
  "daysPerWeek": integer,
  "courseDays": array of strings,
  "startTime": string (time),
  "endTime": string (time),
  "learnModules": [
    {
      "id": integer,
      "moduleName": string,
      "moduleDescription": string,
      "moduleOrder": integer
    }
  ]
}
```

#### Actions Requises:
- Vérifier que tous les champs sont affichés/édités
- Ajouter les champs manquants: `createdDate`, `lastModifiedDate`, `endDate`, `enrollmentOpen`

### 5. UserManagement.jsx et UserForm.jsx

#### Structure UserResponseDto:
```json
{
  "id": integer,
  "firstname": string,
  "lastname": string,
  "email": string,
  "accountLocked": boolean,
  "enabled": boolean,
  "roleName": string,
  "createdDate": string (date-time),
  "lastModifiedDate": string (date-time),
  "dateOfBirth": string (date, optional),
  "address": string (optional),
  "phoneNumber": string (optional),
  "gender": string (optional),
  "nationality": string (optional),
  "enrollmentIds": array of integers (optional)
}
```

#### Actions Requises:
- Vérifier l'affichage de tous les champs
- Ajouter `enrollmentIds` dans l'affichage si pertinent

## Corrections Prioritaires

### Priorité 1 (Critique)
1. **StudentEnrollmentDetails.jsx** - Corriger la structure des documents (array vs objet)
2. **paymentService.js** - Ajouter `initiateEnrollmentPayment`
3. **EnrollmentCorrections.jsx** - Corriger le traitement des documents

### Priorité 2 (Important)
1. **StudentEnrollmentManagement.jsx** - Ajouter champs manquants
2. **Step4ContactInfo.jsx** - Vérifier structure emergencyContacts
3. **ProgramForm.jsx** - Ajouter champs manquants

### Priorité 3 (Amélioration)
1. Tous les composants - Afficher `createdDate` et `lastModifiedDate` où pertinent
2. Améliorer les messages d'erreur basés sur les réponses API
3. Ajouter validation côté client basée sur les types de données API

## Statuts d'Enrollment API

Les statuts retournés par l'API sont:
- `IN_PROGRESS` - Inscription en cours
- `PENDING` - En attente de validation
- `APPROVED` - Approuvée
- `REJECTED` - Rejetée
- `CORRECTIONS_REQUIRED` - Corrections requises

Vérifier que `enrollmentStatusUtils.js` mappe correctement ces valeurs.

## Statuts de Validation de Documents

Les statuts de validation des documents sont:
- `PENDING` - En attente
- `APPROVED` - Approuvé
- `REJECTED` - Rejeté

## Actions Admin sur Enrollments

1. **Approuver**: `PATCH /enrollments/{enrollmentId}/approve`
2. **Demander corrections**: `PATCH /enrollments/{enrollmentId}/request-corrections`
   - Body: Array de `{documentId: integer, reason: string}`
3. **Rejeter**: `PATCH /enrollments/{enrollmentId}/reject`
   - Body: `{rejectionReason: string}`

## Prochaines Étapes

1. Corriger `paymentService.js`
2. Corriger `StudentEnrollmentDetails.jsx` (structure documents)
3. Corriger `EnrollmentCorrections.jsx`
4. Mettre à jour tous les composants pour afficher les champs manquants
5. Tester l'intégration complète avec le backend
6. Créer des tests unitaires pour les services

## Notes Techniques

- Tous les endpoints utilisent le préfixe: `http://localhost:9090/api/v1`
- L'authentification utilise JWT Bearer tokens
- Les dates sont au format ISO 8601
- Les fichiers sont envoyés via `multipart/form-data`
- Les réponses JSON utilisent camelCase

---
**Date de création**: 2025-10-05
**Basé sur**: API_ENDPOINTS_DOCUMENTATION_CORRECTED.md
