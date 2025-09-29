package com.team48.inscriptionscolaire.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final JavaMailSender mailSender;
    private final String recipientEmail = "contact@igniteacademy.com"; // Your receiving email

    public void sendContactForm(ContactFormDTO dto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(dto.getEmail()); // The sender's email
        message.setTo(recipientEmail);
        message.setSubject(dto.getSubject());
        message.setText("Message from: " + dto.getName() + "\n" + dto.getMessage());
        mailSender.send(message);
    }
}