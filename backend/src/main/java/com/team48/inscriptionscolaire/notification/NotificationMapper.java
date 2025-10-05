package com.team48.inscriptionscolaire.notification;

import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    
    public Notification toEntity(NotificationDto dto) {
        if (dto == null) {
            return null;
        }
        
        return Notification.builder()
                .id(dto.getId())
                .content(dto.getContent())
                .isRead(dto.isRead())
                .createdDate(dto.getCreatedDate())
                .lastModifiedDate(dto.getLastModifiedDate())
                .build();
    }
    
    public NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }
        
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setContent(notification.getContent());
        dto.setRead(notification.isRead());
        dto.setCreatedDate(notification.getCreatedDate());
        dto.setLastModifiedDate(notification.getLastModifiedDate());
        
        return dto;
    }
}