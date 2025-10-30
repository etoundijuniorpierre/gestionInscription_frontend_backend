package com.team48.inscriptionscolaire.notification;

import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
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

    public List<Notification> getNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedDateDesc(currentUser.getId());
    }

    public Notification getNotificationById(Integer id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.orElse(null);
    }

    @Transactional
    public void markAllAsReadForCurrentUser() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(currentUser.getId());

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public boolean deleteNotification(Integer id) {
        Optional<Notification> notification = notificationRepository.findById(id);

        if (notification.isPresent()) {
            notificationRepository.deleteById(id);
            return true;
        }

        return false;
    }

    public long getUnreadNotificationsCountForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}