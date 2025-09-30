package com.team48.inscriptionscolaire.auth;

import com.team48.inscriptionscolaire.email.EmailService;
import com.team48.inscriptionscolaire.email.EmailTemplateName;
import com.team48.inscriptionscolaire.role.Role;
import com.team48.inscriptionscolaire.role.RoleRepository;
import com.team48.inscriptionscolaire.security.JwtService;
import com.team48.inscriptionscolaire.student.MaritalStatus;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.user.Token;
import com.team48.inscriptionscolaire.user.TokenRepository;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegistrationRequest request) throws MessagingException {
        // Get the STUDENT role from the database
        Role userRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Role STUDENT not found"));

        User user;
        user = Student.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .role(userRole)
                .dateOfBirth(LocalDate.now()) // Valeur par défaut, à mettre à jour plus tard
                .address("Tradex Emana") // Valeur par défaut
                .phoneNumber("+237 69910023") // Valeur par défaut
                .gender("FEMININ") // Valeur par défaut
                .nationality("Cameroonian") // Valeur par défaut
                .maritalStatus(MaritalStatus.SINGLE) // Valeur par défaut
                .desiredAcademicYear(LocalDate.now().getYear()) // Valeur par défaut
                .intendedFieldOfStudy("Computer Science") // Valeur par défaut
                .build();

        userRepository.save(user);
        sendValidationEmail(user);
    }

    private String generateInternalCode() {
        // Implémentez une logique de génération de code interne
        return "ADM-" + new SecureRandom().nextInt(1000, 9999);
    }
    //it will generate a new token
    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        //send email
        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        //generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .revoked(false)
                .expired(false)
                .build();

        tokenRepository.save(token);
        return generatedToken;

    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++){
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));

        }

        return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(); // Assurez-vous que l'utilisateur est trouvé
        var jwtToken = jwtService.generateToken(user);

        // AJOUT : Révoquer tous les anciens tokens de l'utilisateur
        revokeAllUserTokens(user);
        // AJOUT : Sauvegarder le nouveau token
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().getName())
                .build();
    }

    // AJOUT : Méthode pour sauvegarder un token
    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    // AJOUT : Méthode pour révoquer les tokens
    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    //@Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken= tokenRepository.findByToken(token)
                //to do exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())){
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        //validate the token
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

    }

    // ===================================================================================
    // ================= NOUVELLE MÉTHODE POUR LE MOT DE PASSE OUBLIÉ ===================
    // ===================================================================================

    public void initiatePasswordReset(String email) throws MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Re-use the existing token and email sending logic
            sendValidationEmail(user);
        }
        // If the user doesn't exist, we do nothing to prevent user enumeration attacks.
    }

    // ===================================================================================
    // ================= MÉTHODE DE DÉCONNEXION AJOUTÉE ===================================
    // ===================================================================================

    /**
     * Gère la déconnexion en révoquant le token JWT fourni.
     * @param request La requête HTTP contenant l'en-tête d'autorisation.
     */
    public void logout(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return; // Pas de token, rien à faire
        }

        jwt = authHeader.substring(7);
        var storedToken = tokenRepository.findByToken(jwt).orElse(null);

        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            SecurityContextHolder.clearContext(); // Nettoie le contexte de sécurité
        }
    }
}