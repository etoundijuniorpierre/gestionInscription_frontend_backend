package com.team48.inscriptionscolaire.role;

import com.team48.inscriptionscolaire.user.User;

import java.util.List;
import java.util.stream.Collectors;

public class RoleMapper {
    
    public static Role toEntity(RoleDto dto) {
        if (dto == null) {
            return null;
        }
        
        return Role.builder()
                .id(dto.getId())
                .name(dto.getName())
                .build();
    }
    
    public static RoleDto toDto(Role role) {
        if (role == null) {
            return null;
        }
        
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        
        // Map user IDs if available
        if (role.getUser() != null) {
            List<Integer> userIds = role.getUser().stream()
                    .map(User::getId)
                    .collect(Collectors.toList());
            dto.setUserIds(userIds);
        }
        
        return dto;
    }
}