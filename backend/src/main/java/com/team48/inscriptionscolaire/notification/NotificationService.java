package com.team48.inscriptionscolaire.notification;

import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate, 
                              UserRepository userRepository,
                              NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    /*public void sendGlobalNotification() {
        Notification notification = new Notification("This is a global notification!");
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }*/

    /**
     * Envoie une notification privée à un utilisateur spécifique et la persiste en base de données.
     * @param userId L'identifiant de l'utilisateur (doit correspondre à son nom d'utilisateur de connexion)
     * @param message Le contenu du message à envoyer
     */
    @Transactional
    public void sendPrivateNotification(final String userId, final String message) {
        try {
            // Find the user by email/username
            Optional<User> userOptional = userRepository.findByEmail(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Create and persist the notification
                Notification notification = new Notification();
                notification.setContent(message);
                notification.setUser(user);
                notification.setRead(false);
                notification = notificationRepository.save(notification);
                
                // Send via WebSocket
                messagingTemplate.convertAndSendToUser(userId, "/topic/private-notifications", notification);
            }
        } catch (Exception e) {
            // Log the error but don't throw exception to avoid breaking the enrollment process
            e.printStackTrace();
        }
    }
    
    /**
     * Envoie une notification à tous les administrateurs et les persiste en base de données.
     * @param message Le contenu du message à envoyer
     */
    @Transactional
    public void sendNotificationToAdmins(final String message) {
        try {
            List<User> adminUsers = userRepository.findAdminUsers();
            
            for (User admin : adminUsers) {
                try {
                    // Create and persist the notification for each admin
                    Notification notification = new Notification();
                    notification.setContent(message);
                    notification.setUser(admin);
                    notification.setRead(false);
                    notification = notificationRepository.save(notification);
                    
                    // Send via WebSocket
                    messagingTemplate.convertAndSendToUser(admin.getUsername(), "/topic/private-notifications", notification);
                } catch (Exception e) {
                    // Log the error but continue with other admins
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            // Don't throw exception to avoid breaking the enrollment process
            e.printStackTrace();
        }
    }
    
    /**
     * Get all notifications for the current authenticated user
     */
    public List<Notification> getNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedDateDesc(currentUser.getId());
    }
    
    /**
     * Get a specific notification by ID
     */
    public Notification getNotificationById(Integer id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.orElse(null);
    }
    
    /**
     * Mark all notifications as read for the current user
     */
    @Transactional
    public void markAllAsReadForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(currentUser.getId());
        
        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        
        notificationRepository.saveAll(notifications);
    }
    
    /**
     * Delete a notification by ID
     */
    @Transactional
    public boolean deleteNotification(Integer id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        
        if (notification.isPresent()) {
            notificationRepository.deleteById(id);
            return true;
        }
        
        return false;
    }
    
    /**
     * Get count of unread notifications for the current user
     */
    public long getUnreadNotificationsCountForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId());
    }
    
    /**
     * Get the current authenticated user
     */
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}