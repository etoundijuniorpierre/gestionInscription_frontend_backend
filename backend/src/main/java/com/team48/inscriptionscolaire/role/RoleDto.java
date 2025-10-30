package com.team48.inscriptionscolaire.role;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoleDto {
    private Integer id;
    private String name;
    private List<Integer> userIds;

    // BaseEntity audit fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}