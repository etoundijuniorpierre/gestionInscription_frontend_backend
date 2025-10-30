package com.team48.inscriptionscolaire;

import com.team48.inscriptionscolaire.role.Role;
import com.team48.inscriptionscolaire.role.RoleRepository;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Assert;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

@SpringBootApplication
public class InscriptionScolaireApplication implements CommandLineRunner  {

    public static void main(String[] args) {
        SpringApplication.run(InscriptionScolaireApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        startNgrok();
    }

    private void startNgrok() throws IOException, InterruptedException, java.io.IOException {
        System.out.println("🚀 Lancement automatique de Ngrok...");
        String ngrokPath = "src/main/resources/ngrok.exe";
        ProcessBuilder processBuilder = new ProcessBuilder(ngrokPath, "http", "9090");
        processBuilder.inheritIO();
        processBuilder.start();

        Thread.sleep(3000);

        String publicUrl = getNgrokPublicUrl();
        if (publicUrl != null) {
            System.out.println("✅ Ngrok en ligne : " + publicUrl);
            System.out.println("📡 Webhook Flutterwave : " + publicUrl + "/api/v1/payments/webhook");
        } else {
            System.out.println("❌ Impossible de récupérer l’URL ngrok. Vérifie qu’il est bien installé.");
        }
    }

    private String getNgrokPublicUrl() {
        try {
            URL url = new URL("http://127.0.0.1:4040/api/tunnels"); // ngrok API locale
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject json = new JSONObject(response.toString());
            JSONArray tunnels = json.getJSONArray("tunnels");
            if (tunnels.length() > 0) {
                return tunnels.getJSONObject(0).getString("public_url");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération de l’URL ngrok : " + e.getMessage());
        }
        return null;
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
                User adminUser = new User();
                adminUser.setFirstname("Admin");
                adminUser.setLastname("User");
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode(adminPassword));
                adminUser.setRole(adminRole);
                adminUser.setStatus(false); // false = not disabled (i.e., enabled)

                // 4. Sauvegarder l'admin dans la base de données
                userRepository.save(adminUser);
                System.out.println(">>> Administrateur par défaut créé et activé avec succès !");
            } else {
                System.out.println(">>> L'administrateur par défaut existe déjà.");
            }
        };
    }
}