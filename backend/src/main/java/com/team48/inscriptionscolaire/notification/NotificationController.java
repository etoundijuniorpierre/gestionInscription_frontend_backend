package com.team48.inscriptionscolaire.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private NotificationMapper notificationMapper;
    
    // WebSocket endpoint for real-time notifications (existing functionality)
    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    public Notification sendNotification(Notification notification) throws Exception {
        return new Notification("New notification: " + notification.getContent());
    }
    
    // REST endpoints for CRUD operations
    
    /**
     * Get all notifications for the current user
     */
    @GetMapping("/all")
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        List<Notification> notifications = notificationService.getNotificationsForCurrentUser();
        List<NotificationDto> dtos = notifications.stream()
                .map(notificationMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get a specific notification by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDto> getNotification(@PathVariable Integer id) {
        Notification notification = notificationService.getNotificationById(id);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        NotificationDto dto = notificationMapper.toDto(notification);
        return ResponseEntity.ok(dto);
    }
    
    /**
     * Mark all notifications as read
     */
    @PostMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsReadForCurrentUser();
        return ResponseEntity.ok().build();
    }
    
    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer id) {
        boolean deleted = notificationService.deleteNotification(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get count of unread notifications for the current user
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadNotificationsCount() {
        long count = notificationService.getUnreadNotificationsCountForCurrentUser();
        return ResponseEntity.ok(count);
    }
}