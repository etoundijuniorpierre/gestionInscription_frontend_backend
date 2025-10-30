package com.team48.inscriptionscolaire.auth;

import com.team48.inscriptionscolaire.user.PasswordUpdateRequest;
import com.team48.inscriptionscolaire.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {
    private final AuthenticationService service;
    private final UserService userService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();

    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ) {

        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException, NoSuchAlgorithmException {
        service.activateAccount(token);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid PasswordResetRequest request) throws MessagingException {
        service.initiatePasswordReset(request.getEmail());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/resend-activation-code")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<Void> resendActivationCode(@RequestBody @Valid ResendActivationCodeRequest request) throws MessagingException {
        service.resendActivationCode(request.getEmail());
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        service.logout(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/update-password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> updatePassword(@RequestBody @Valid PasswordUpdateRequest request) {
        userService.updatePassword(request);
        return ResponseEntity.ok().build();
    }
}