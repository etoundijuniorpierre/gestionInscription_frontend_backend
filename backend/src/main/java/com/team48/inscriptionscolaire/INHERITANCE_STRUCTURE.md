# Inheritance Structure

## Overview
This document explains the inheritance structure of the user-related entities in the application.

## Class Hierarchy

```
BaseEntity (Abstract)
│
└── User (Entity)
    │
    ├── Student (Entity)
    │
    └── Admin (Entity)
```

## Detailed Structure

### BaseEntity (Abstract Class)
- **Package**: `com.team48.inscriptionscolaire.common`
- **Type**: `@MappedSuperclass`
- **Purpose**: Provides common audit fields for all entities
- **Fields**:
  - `id`: Integer (Primary key)
  - `createdDate`: LocalDateTime (Audit field)
  - `lastModifiedDate`: LocalDateTime (Audit field)

### User (Entity)
- **Package**: `com.team48.inscriptionscolaire.user`
- **Extends**: `BaseEntity`
- **Type**: `@Entity` with `@Inheritance(strategy = InheritanceType.JOINED)`
- **Purpose**: Base user entity with authentication and authorization functionality
- **Implements**: `UserDetails`, `Principal`
- **Fields**:
  - `firstname`: String
  - `lastname`: String
  - `email`: String (Unique)
  - `password`: String
  - `status`: boolean
  - `role`: Role (ManyToOne relationship)
  - Inherits audit fields from BaseEntity

### Student (Entity)
- **Package**: `com.team48.inscriptionscolaire.student`
- **Extends**: `User`
- **Type**: `@Entity` with `@DiscriminatorValue("STUDENT")`
- **Purpose**: Student-specific information
- **Fields**:
  - `dateOfBirth`: LocalDate
  - `address`: String
  - `phoneNumber`: String
  - `gender`: String
  - `nationality`: String
  - `enrollmentList`: List<Enrollment> (OneToMany relationship)
  - Inherits all fields from User and BaseEntity

### Admin (Entity)
- **Package**: `com.team48.inscriptionscolaire.admin`
- **Extends**: `User`
- **Type**: `@Entity` with `@DiscriminatorValue("ADMIN")`
- **Purpose**: Admin-specific information
- **Fields**:
  - Inherits all fields from User and BaseEntity

## Benefits of This Structure

1. **Code Reusability**: Common fields and functionality are defined once in the base classes
2. **Consistency**: All entities have the same audit fields
3. **Maintainability**: Changes to audit functionality only need to be made in one place
4. **Type Safety**: Proper inheritance ensures that Student and Admin objects can be treated as User objects when needed
5. **Database Normalization**: Using JOINED inheritance strategy creates properly normalized database tables

## Inheritance Strategy

The application uses `InheritanceType.JOINED` strategy which creates:
- A `users` table containing all User fields plus foreign key to `base_entity`
- A `students` table containing Student-specific fields plus foreign key to `users`
- An `admins` table containing Admin-specific fields plus foreign key to `users`
- A `base_entity` table containing the audit fields

This strategy provides the best balance of normalization and performance for this use case.