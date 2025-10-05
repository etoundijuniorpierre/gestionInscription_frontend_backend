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
     * Envoie une notification privée à un utilisateur spécifique.
     * @param userId L'identifiant de l'utilisateur (doit correspondre à son nom d'utilisateur de connexion)
     * @param message Le contenu du message à envoyer
     */
    public void sendPrivateNotification(final String userId, final String message) {
        Notification notification = new Notification(message);
        messagingTemplate.convertAndSendToUser(userId, "/topic/private-notifications", notification);
    }
    
    /**
     * Envoie une notification à tous les administrateurs.
     * @param message Le contenu du message à envoyer
     */
    public void sendNotificationToAdmins(final String message) {
        List<User> adminUsers = userRepository.findAdminUsers();
        Notification notification = new Notification(message);
        
        for (User admin : adminUsers) {
            messagingTemplate.convertAndSendToUser(admin.getUsername(), "/topic/private-notifications", notification);
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
     * Get the current authenticated user
     */
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}