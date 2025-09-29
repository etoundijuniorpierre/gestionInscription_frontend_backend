package com.team48.inscriptionscolaire.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // On autorise tout pour le test
                registry.addMapping("/**") // Pour tous les endpoints
                        .allowedOrigins("*")   // Accepte les requêtes de n'importe quelle origine
                        .allowedMethods("*")   // Accepte toutes les méthodes HTTP (GET, POST, etc.)
                        .allowedHeaders("*");  // Accepte tous les en-têtes
            }
        };
    }
}
