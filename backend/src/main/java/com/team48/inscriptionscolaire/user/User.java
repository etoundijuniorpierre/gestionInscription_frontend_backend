package com.team48.inscriptionscolaire.user;

import com.team48.inscriptionscolaire.common.BaseEntity;
import com.team48.inscriptionscolaire.notification.Notification;
import com.team48.inscriptionscolaire.role.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;


@Data
@NoArgsConstructor 
@AllArgsConstructor
@Entity
@SuperBuilder
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
@EntityListeners(AuditingEntityListener.class)
public class User extends BaseEntity implements UserDetails, Principal {

    private String firstname;
    private String lastname;

    @Column(unique = true)
    private String email;
    private String password;
    private boolean status;

    @ManyToOne(fetch = FetchType.EAGER)
    private Role role;

        private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;

    private String gender;

    private String nationality;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.getName()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !this.status; // status represents disabled status, so we return the inverse
    }

    @Override
    public String getName() {
        return this.email;
    }

    public String fullName(){
        return firstname + " " + lastname;
    }

}