package com.team48.inscriptionscolaire.user;

import java.time.LocalDateTime;

public class TokenMapper {
    
    public static Token toEntity(TokenDto dto) {
        if (dto == null) {
            return null;
        }
        
        return Token.builder()
                .id(dto.getId())
                .token(dto.getToken())
                .createdAt(dto.getCreatedAt())
                .expiresAt(dto.getExpiresAt())
                .validatedAt(dto.getValidatedAt())
                .revoked(dto.isRevoked())
                .expired(dto.isExpired())
                .build();
    }
    
    public static TokenDto toDto(Token token) {
        if (token == null) {
            return null;
        }
        
        TokenDto dto = new TokenDto();
        dto.setId(token.getId());
        dto.setToken(token.getToken());
        dto.setCreatedAt(token.getCreatedAt());
        dto.setExpiresAt(token.getExpiresAt());
        dto.setValidatedAt(token.getValidatedAt());
        dto.setRevoked(token.isRevoked());
        dto.setExpired(token.isExpired());
        
        // Set user ID if available
        if (token.getUser() != null) {
            dto.setUserId(token.getUser().getId());
        }
        
        return dto;
    }
}