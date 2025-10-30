package com.team48.inscriptionscolaire.notification;

import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {


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