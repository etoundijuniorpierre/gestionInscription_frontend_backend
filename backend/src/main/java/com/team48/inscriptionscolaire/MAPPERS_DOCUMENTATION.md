# Mappers Documentation

This document describes all the mappers created for entity-to-DTO conversion in the application.

## 1. AdminMapper

**Package:** `com.team48.inscriptionscolaire.admin`

**Purpose:** Converts [Admin](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\admin\Admin.java#L14-L26) entities to [AdminResponseDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\admin\AdminResponseDto.java#L6-L18) objects.

**Methods:**
- `toAdminResponseDto(Admin admin)`: Converts an Admin entity to AdminResponseDto

## 2. DocumentMapper

**Package:** `com.team48.inscriptionscolaire.document`

**Purpose:** Converts [Document](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\document\Document.java#L15-L35) entities to [DocumentDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\document\DocumentDto.java#L13-L25) objects and vice versa.

**Methods:**
- `toEntity(DocumentDto dto)`: Converts a DocumentDto to Document entity
- `toDto(Document document)`: Converts a Document entity to DocumentDto

## 3. EnrollmentMapper

**Package:** `com.team48.inscriptionscolaire.enrollment`

**Purpose:** Converts [Enrollment](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\enrollment\Enrollment.java#L13-L47) entities to [EnrollmentDtoResponse](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\enrollment\EnrollmentDtoResponse.java#L11-L35) objects and vice versa.

**Methods:**
- `toEntity(EnrollmentDtoResponse dto)`: Converts an EnrollmentDtoResponse to Enrollment entity
- `toDto(Enrollment enrollment)`: Converts an Enrollment entity to EnrollmentDtoResponse

## 4. NotificationMapper

**Package:** `com.team48.inscriptionscolaire.notification`

**Purpose:** Converts [Notification](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\notification\Notification.java#L15-L23) entities to [NotificationDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\notification\NotificationDto.java#L7-L11) objects and vice versa.

**Methods:**
- `toEntity(NotificationDto dto)`: Converts a NotificationDto to Notification entity
- `toDto(Notification notification)`: Converts a Notification entity to NotificationDto

## 5. PaymentMapper

**Package:** `com.team48.inscriptionscolaire.payment`

**Purpose:** Converts [Payment](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\payment\Payment.java#L14-L29) entities to [PaymentDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\payment\PaymentDto.java#L8-L15) objects and vice versa.

**Methods:**
- `toEntity(PaymentDto dto)`: Converts a PaymentDto to Payment entity
- `toDto(Payment payment)`: Converts a Payment entity to PaymentDto

## 6. RoleMapper

**Package:** `com.team48.inscriptionscolaire.role`

**Purpose:** Converts [Role](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\role\Role.java#L15-L38) entities to [RoleDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\role\RoleDto.java#L7-L10) objects and vice versa.

**Methods:**
- `toEntity(RoleDto dto)`: Converts a RoleDto to Role entity
- `toDto(Role role)`: Converts a Role entity to RoleDto

## 7. TokenMapper

**Package:** `com.team48.inscriptionscolaire.user`

**Purpose:** Converts [Token](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\user\Token.java#L11-L30) entities to [TokenDto](file:///c:\Users\etoun\Documents\pk48\inscription\soumettre\backend\src\main\java\com\team48\inscriptionscolaire\user\TokenDto.java#L7-L15) objects and vice versa.

**Methods:**
- `toEntity(TokenDto dto)`: Converts a TokenDto to Token entity
- `toDto(Token token)`: Converts a Token entity to TokenDto