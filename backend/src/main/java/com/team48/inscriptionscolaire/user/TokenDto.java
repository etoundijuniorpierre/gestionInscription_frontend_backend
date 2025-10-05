package com.team48.inscriptionscolaire.user;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TokenDto {
    private Integer id;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime validatedAt;
    private boolean revoked;
    private boolean expired;
    private Integer userId;
    
    // BaseEntity audit fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}