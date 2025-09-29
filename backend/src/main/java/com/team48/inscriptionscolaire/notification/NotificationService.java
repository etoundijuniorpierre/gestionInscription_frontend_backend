package com.team48.inscriptionscolaire.notification;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
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
}
