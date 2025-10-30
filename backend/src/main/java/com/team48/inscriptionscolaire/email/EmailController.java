package com.team48.inscriptionscolaire.email;

import com.team48.inscriptionscolaire.student.StudentSummaryDto;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;
    private final UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentSummaryDto>> getStudents() {
        // Récupérer tous les utilisateurs et filtrer ceux qui sont des étudiants
        List<User> allUsers = userRepository.findAll();
        List<User> students = allUsers.stream()
                .filter(user -> user instanceof com.team48.inscriptionscolaire.student.Student)
                .collect(Collectors.toList());

        List<StudentSummaryDto> studentDtos = students.stream()
                .map(student -> new StudentSummaryDto(
                        student.getId(),
                        student.getFirstname(),
                        student.getLastname(),
                        student.getEmail(),
                        student.getFirstname() + " " + student.getLastname()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDtos);
    }

    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestDto emailRequest) {
        try {
            String htmlContent = buildEmailTemplate(emailRequest.getContent());
            emailService.sendCustomEmail(emailRequest.getRecipientEmail(), emailRequest.getSubject(), htmlContent);
            return ResponseEntity.ok("Email sent successfully");
        } catch (MessagingException e) {
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }

    private String buildEmailTemplate(String content) {
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
                            color: #101957;
                        }
                        .content {
                            margin-top: 20px;
                            line-height: 1.6;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 12px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Message de l'administration</h2>
                        <div class="content">
                            %s
                        </div>
                        <div class="footer">
                            <p>Cordialement,<br>L'équipe d'administration</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(content.replace("\n", "<br>"));
    }
}
