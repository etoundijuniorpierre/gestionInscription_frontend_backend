package com.team48.inscriptionscolaire.user;

import lombok.Data;

@Data
public class UserRequestDto {
    private String firstname;
    private String lastname;
    private String email;
    private boolean accountLocked;
    private boolean enabled;
}