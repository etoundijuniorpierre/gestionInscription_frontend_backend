package com.team48.inscriptionscolaire.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    /**
     * Send a custom email with HTML content
     * @param to recipient email
     * @param subject email subject
     * @param htmlContent HTML content of the email
     * @throws MessagingException if email sending fails
     */
    @Async
    public void sendCustomEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );

        helper.setFrom(mailUsername);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    /**
     * Send enrollment confirmation email to student
     * @param to recipient email
     * @param studentName name of the student
     * @param programName name of the program
     * @param startDate program start date
     * @param endDate program end date
     * @param courseDays days of the week when classes are held
     * @param startTime start time of classes
     * @param endTime end time of classes
     * @param modules list of program modules
     * @throws MessagingException if email sending fails
     */
    @Async
    public void sendEnrollmentConfirmationEmail(String to, String studentName, String programName, 
                                              LocalDate startDate, LocalDate endDate, 
                                              Set<String> courseDays, LocalTime startTime, LocalTime endTime,
                                              List<String> modules) throws MessagingException {
        String subject = "Confirmation d'inscription - " + programName;
        String htmlContent = buildEnrollmentConfirmationHtmlTemplate(studentName, programName, startDate, endDate, courseDays, startTime, endTime, modules);
        sendCustomEmail(to, subject, htmlContent);
    }

    /**
     * Send enrollment rejection email to student
     * @param to recipient email
     * @param studentName name of the student
     * @param programName name of the program
     * @param rejectionReason reason for rejection
     * @throws MessagingException if email sending fails
     */
    @Async
    public void sendEnrollmentRejectionEmail(String to, String studentName, String programName, String rejectionReason) throws MessagingException {
        String subject = "Votre inscription a été rejetée - " + programName;
        String htmlContent = buildEnrollmentRejectionHtmlTemplate(studentName, programName, rejectionReason);
        sendCustomEmail(to, subject, htmlContent);
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

    // Méthode utilitaire pour générer le HTML pour la confirmation d'inscription
    private String buildEnrollmentConfirmationHtmlTemplate(String studentName, String programName, 
                                                         LocalDate startDate, LocalDate endDate, 
                                                         Set<String> courseDays, LocalTime startTime, LocalTime endTime,
                                                         List<String> modules) {
        // Format course days
        String formattedDays = courseDays != null ? String.join(", ", courseDays) : "Non spécifié";
        
        // Build modules list HTML
        StringBuilder modulesHtml = new StringBuilder();
        if (modules != null && !modules.isEmpty()) {
            modulesHtml.append("<h4>Modules du programme :</h4><ul>");
            for (String module : modules) {
                modulesHtml.append("<li>").append(module).append("</li>");
            }
            modulesHtml.append("</ul>");
        } else {
            modulesHtml.append("<p>Aucun module spécifié pour ce programme.</p>");
        }
        
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
            .program-details {
                background-color: #e3f2fd;
                border-left: 4px solid #2a7ae2;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .detail-row {
                margin: 10px 0;
            }
            .detail-label {
                font-weight: bold;
                display: inline-block;
                width: 150px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Bonjour %s,</h2>
            
            <p>Félicitations ! Votre inscription au programme <strong>%s</strong> a été confirmée avec succès.</p>
            
            <div class="program-details">
                <h3>Détails du programme :</h3>
                <div class="detail-row">
                    <span class="detail-label">Date de début :</span>
                    <span>%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date de fin :</span>
                    <span>%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Jours de cours :</span>
                    <span>%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Heures de cours :</span>
                    <span>%s - %s</span>
                </div>
                %s
            </div>
            
            <p>Vous êtes maintenant officiellement inscrit à ce programme. Préparez-vous à commencer cette formation passionnante !</p>
            
            <p>Si vous avez des questions, n'hésitez pas à contacter notre service support.</p>
            
            <div class="footer">
                <p>Cordialement,<br>L'équipe pédagogique d'Ignite Academy</p>
            </div>
        </div>
    </body>
    </html>
    """.formatted(
            studentName, 
            programName, 
            startDate != null ? startDate.toString() : "Non spécifié",
            endDate != null ? endDate.toString() : "Non spécifié",
            formattedDays,
            startTime != null ? startTime.toString() : "Non spécifié",
            endTime != null ? endTime.toString() : "Non spécifié",
            modulesHtml.toString()
        );
    }

    // Méthode utilitaire pour générer le HTML pour le rejet d'inscription
    private String buildEnrollmentRejectionHtmlTemplate(String studentName, String programName, String rejectionReason) {
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
                color: #d32f2f;
            }
            .reason {
                background-color: #ffebee;
                border-left: 4px solid #d32f2f;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Bonjour %s,</h2>
            
            <p>Nous vous informons que votre demande d'inscription pour le programme <strong>%s</strong> a été rejetée.</p>
            
            <div class="reason">
                <h3>Raison du rejet :</h3>
                <p>%s</p>
            </div>
            
            <p>Vous pouvez consulter votre tableau de bord pour plus de détails et, si nécessaire, soumettre une nouvelle demande d'inscription.</p>
            
            <p>Si vous avez des questions, n'hésitez pas à contacter notre service support.</p>
            
            <div class="footer">
                <p>Cordialement,<br>L'équipe pédagogique d'Ignite Academy</p>
            </div>
        </div>
    </body>
    </html>
    """.formatted(studentName, programName, rejectionReason);
    }
}