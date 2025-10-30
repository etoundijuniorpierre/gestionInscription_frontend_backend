package com.team48.inscriptionscolaire.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "CRUD operations for users and password management")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponseDto> userDtos = users.stream()
                .map(userMapper::toUserResponseDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by ID. Accessible by admins and the user themselves.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        return ResponseEntity.ok(userDto);
    }

    @Operation(summary = "Update user", description = "Update user information. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable Integer id, @RequestBody @Valid UserRequestDto userRequestDto) {
        User user = userService.updateUser(id, userRequestDto);
        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        return ResponseEntity.ok(userDto);
    }

    @Operation(summary = "Delete user", description = "Delete a user. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle user status", description = "Enable or disable a user account. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User status toggled successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> toggleUserStatus(@PathVariable Integer id) {
        User user = userService.toggleUserStatus(id);
        UserResponseDto userDto = userMapper.toUserResponseDto(user);
        return ResponseEntity.ok(userDto);
    }

    @Operation(summary = "Change user password (Admin)", description = "Change a user's password without knowing the old password. Accessible only by admins.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changePassword(@RequestBody @Valid PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Update own password (Student)", description = "Update the authenticated user's password with verification of current password.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password updated successfully"),
            @ApiResponse(responseCode = "400", description = "Current password is incorrect"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/update-password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> updatePassword(@RequestBody @Valid PasswordUpdateRequest request) {
        userService.updatePassword(request);
        return ResponseEntity.ok().build();
    }
}