package com.team48.inscriptionscolaire.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PasswordChangeRequest {
    @NotNull(message = "User ID is mandatory")
    private Integer userId;

    @NotBlank(message = "New password is mandatory")
    private String newPassword;
}