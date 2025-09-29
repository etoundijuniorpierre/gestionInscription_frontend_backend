package com.team48.inscriptionscolaire;

import com.team48.inscriptionscolaire.role.Role;
import com.team48.inscriptionscolaire.role.RoleRepository;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Assert;

@SpringBootApplication
public class InscriptionScolaireApplication {

    public static void main(String[] args) {
        SpringApplication.run(InscriptionScolaireApplication.class, args);
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("STUDENT").isEmpty()) {
                roleRepository.save(Role.builder().name("STUDENT").build());
            }
            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(Role.builder().name("ADMIN").build());
            }
        };
    }

    // --- NOUVEAU BEAN POUR CRÉER L'ADMIN ---
    @Bean
    CommandLineRunner initAdminUser(
            UserRepository userRepository, 
            RoleRepository roleRepository, 
            PasswordEncoder passwordEncoder,
            @Value("${admin.email:teamkf48inscription@gmail.com}") String adminEmail,
            @Value("${admin.password:Teamkf48inscription@@}") String adminPassword) {
        return args -> {
            Assert.hasText(adminEmail, "Admin email must be set via ADMIN_EMAIL environment variable");
            Assert.hasText(adminPassword, "Admin password must be set via ADMIN_PASSWORD environment variable");

            // 1. Vérifier si l'admin existe déjà
            if (userRepository.findByEmail(adminEmail).isEmpty()) {

                // 2. Récupérer le rôle ADMIN (qui doit exister grâce au bean précédent)
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("Error: ADMIN role not found."));

                // 3. Créer le nouvel utilisateur administrateur
                User adminUser = User.builder()
                        .firstname("Admin")
                        .lastname("User")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(adminRole)
                        .enabled(true) // <-- ICI ON ACTIVE LE COMPTE DIRECTEMENT
                        .accountLocked(false)
                        .build();

                // 4. Sauvegarder l'admin dans la base de données
                userRepository.save(adminUser);
                System.out.println(">>> Administrateur par défaut créé et activé avec succès !");
            } else {
                System.out.println(">>> L'administrateur par défaut existe déjà.");
            }
        };
    }
}