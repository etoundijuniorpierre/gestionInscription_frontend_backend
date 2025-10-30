package com.team48.inscriptionscolaire.auth;

import com.team48.inscriptionscolaire.email.EmailService;
import com.team48.inscriptionscolaire.email.EmailTemplateName;
import com.team48.inscriptionscolaire.role.Role;
import com.team48.inscriptionscolaire.role.RoleRepository;
import com.team48.inscriptionscolaire.security.JwtService;
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
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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
                .status(false) // status = false means inactive until activation
                .role(userRole)
                .dateOfBirth(LocalDate.now()) // Valeur par défaut, à mettre à jour plus tard
                .address("Tradex Emana") // Valeur par défaut
                .phoneNumber("+237 69910023") // Valeur par défaut
                .gender("FEMININ") // Valeur par défaut
                .nationality("Cameroonian") // Valeur par défaut
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
        String newToken = generateAndSaveActivationToken(user);
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
        Token token = Token.builder()
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
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));

        }

        return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Authenticate the user with Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Find the user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is enabled (active)
        if (!user.isEnabled()) {
            throw new DisabledException("User account is disabled. Please contact administrator.");
        }

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user);

        // Revoke all old user tokens
        revokeAllUserTokens(user);
        // Save the new token
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().getName())
                .build();
    }

    // AJOUT : Méthode pour sauvegarder un token
    private void saveUserToken(User user, String jwtToken) {
        try {
            // Créer un hash du token pour la recherche sécurisée
            String tokenHash = hashToken(jwtToken);

            Token token = Token.builder()
                    .user(user)
                    .token(jwtToken) // Token complet pour la validation
                    .tokenHash(tokenHash) // Hash pour la recherche rapide
                    .expired(false)
                    .revoked(false)
                    .build();
            tokenRepository.save(token);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save authentication token", e);
        }
    }

    private String hashToken(String token) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();

        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }

    // AJOUT : Méthode pour révoquer les tokens
    private void revokeAllUserTokens(User user) {
        java.util.List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    //@Transactional
    public void activateAccount(String token) throws MessagingException, NoSuchAlgorithmException {
        String tokenHash = hashToken(token);
        Token savedToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // Vérifier que le token correspond exactement (sécurité supplémentaire)
        if (!savedToken.getToken().equals(token)) {
            throw new RuntimeException("Token hash mismatch");
        }

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        User user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Set status to true to enable the user (status = true means enabled/active)
        user.setStatus(true);
        userRepository.save(user);
        //validate the token
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

    }

    public void initiatePasswordReset(String email) throws MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            sendValidationEmail(user);
        }
        // If the user doesn't exist, we do nothing to prevent user enumeration attacks.
    }

    public void resendActivationCode(String email) throws MessagingException {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Vérifier si le compte est déjà activé
            if (user.isStatus()) {
                throw new RuntimeException("Account is already activated");
            }

            // Révoquer tous les anciens tokens d'activation de l'utilisateur
            java.util.List<Token> oldTokens = tokenRepository.findAllValidTokenByUser(user.getId());
            oldTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(oldTokens);

            // Envoyer un nouveau code d'activation
            sendValidationEmail(user);
        }
        // Si l'utilisateur n'existe pas, ne rien faire pour éviter l’énumération des utilisateurs
    }

    public void logout(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return; // Pas de token, rien à faire
        }

        jwt = authHeader.substring(7);

        try {
            // Utiliser le hash du token pour la recherche
            String tokenHash = hashToken(jwt);
            Token storedToken = tokenRepository.findByTokenHash(tokenHash).orElse(null);

            if (storedToken != null) {
                // Vérifier que le token correspond exactement
                if (storedToken.getToken().equals(jwt)) {
                    storedToken.setExpired(true);
                    storedToken.setRevoked(true);
                    tokenRepository.save(storedToken);
                    SecurityContextHolder.clearContext(); // Nettoie le contexte de sécurité
                }
            }
        } catch (Exception e) {

        }
    }
}