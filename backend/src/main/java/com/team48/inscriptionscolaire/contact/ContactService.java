package com.team48.inscriptionscolaire.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final JavaMailSender mailSender;
    private final String recipientEmail = "teamkf48inscription@gmail.com"; // Your receiving email

    public void sendContactForm(ContactFormDTO dto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(recipientEmail); // Utiliser l'adresse configurée comme expéditeur
        message.setReplyTo(dto.getEmail()); // Mais permettre les réponses à l'expéditeur
        message.setTo(recipientEmail);
        message.setSubject(dto.getSubject());
        message.setText(
                "Nouveau message de contact\n\n" +
                        "De: " + dto.getName() + "\n" +
                        "Email: " + dto.getEmail() + "\n" +
                        "Sujet: " + dto.getSubject() + "\n\n" +
                        "Message:\n" + dto.getMessage()
        );
        mailSender.send(message);
    }
}