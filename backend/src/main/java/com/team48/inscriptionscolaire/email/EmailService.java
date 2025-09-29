package com.team48.inscriptionscolaire.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String mailUsername;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {

        // 1. Préparation des données dynamiques
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activationCode", activationCode);

        // 2. Construction manuelle du contenu HTML de l'email
        String template = buildSimpleHtmlTemplate(properties);

        // 3. Configuration du message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );

        helper.setFrom(mailUsername);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(template, true);

        // 4. Envoi
        mailSender.send(mimeMessage);
    }

    // Méthode utilitaire pour générer le HTML
    private String buildSimpleHtmlTemplate(Map<String, Object> props) {
        String username = (String) props.get("username");
        String confirmationUrl = (String) props.get("confirmationUrl");
        String activationCode = (String) props.get("activationCode");

        return """
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                color: #333333;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                max-width: 600px;
                margin: auto;
            }
            h2 {
                color: #2a7ae2;
            }
            a.button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #2a7ae2;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            p.code {
                font-size: 18px;
                background: #eee;
                padding: 10px;
                border-radius: 5px;
                display: inline-block;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Bonjour %s,</h2>
            <p>Merci de vous être inscrit à Ignite Academy.</p>
            <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
            <a href="%s" class="button">Activer mon compte</a>
            <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p><a href="%s">%s</a></p>
            <p>Code d'activation :</p>
            <p class="code">%s</p>
            <hr>
            <p>Si vous n'êtes pas à l'origine de cette inscription, ignorez simplement ce message.</p>
            <p>Cordialement,<br>L'équipe de support</p>
        </div>
    </body>
    </html>
    """.formatted(username, confirmationUrl, confirmationUrl, confirmationUrl, activationCode);

    }
}