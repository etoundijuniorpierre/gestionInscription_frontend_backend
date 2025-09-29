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
    private String token;
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
