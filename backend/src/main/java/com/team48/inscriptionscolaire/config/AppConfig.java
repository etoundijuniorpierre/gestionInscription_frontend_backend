package com.team48.inscriptionscolaire.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Assert;

@Configuration
public class AppConfig {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String databaseUsername;

    @Value("${application.security.jwt.secret-key}")
    private String jwtSecretKey;

    @PostConstruct
    public void validateProperties() {
        Assert.hasText(databaseUrl, "Database URL must be set via DB_URL environment variable");
        Assert.hasText(databaseUsername, "Database username must be set via DB_USERNAME environment variable");
        Assert.hasText(jwtSecretKey, "JWT secret key must be set via JWT_SECRET environment variable");
    }
}