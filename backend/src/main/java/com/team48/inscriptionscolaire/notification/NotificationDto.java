package com.team48.inscriptionscolaire.notification;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Integer id;
    private String content;
    private boolean isRead;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}