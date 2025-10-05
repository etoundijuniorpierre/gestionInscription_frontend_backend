package com.team48.inscriptionscolaire.admin;

import com.team48.inscriptionscolaire.user.User;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "id")
@DiscriminatorValue("ADMIN")
public class Admin extends User {
}
