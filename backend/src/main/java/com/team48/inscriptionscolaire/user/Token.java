package com.team48.inscriptionscolaire.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Token {

    @Id
    @GeneratedValue
    private Integer id;
    @Column(length = 2048) // Increased length for JWT tokens
    private String token;

    @Column(length = 255, unique = true)
    private String tokenHash; // Hash du token pour la recherche rapide et sécurisée
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime validatedAt;

    // AJOUT : champs pour la révocation
    public boolean revoked;
    public boolean expired;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
}
