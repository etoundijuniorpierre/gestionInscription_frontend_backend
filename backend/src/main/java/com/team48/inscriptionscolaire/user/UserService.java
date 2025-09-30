package com.team48.inscriptionscolaire.user;

import com.team48.inscriptionscolaire.student.Student;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponseDto> getAllUsers() {
        return userMapper.toUserResponseDtoList(userRepository.findAll());
    }

    public UserResponseDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toUserResponseDto(user);
    }

    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        // This would typically be used for admin creation of users
        // For simplicity, we're not implementing full creation logic here
        throw new UnsupportedOperationException("User creation should be done through the authentication service");
    }

    public UserResponseDto updateUser(Integer id, UserRequestDto userRequestDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        
        user.setFirstname(userRequestDto.getFirstname());
        user.setLastname(userRequestDto.getLastname());
        user.setEmail(userRequestDto.getEmail());
        user.setAccountLocked(userRequestDto.isAccountLocked());
        user.setEnabled(userRequestDto.isEnabled());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toUserResponseDto(updatedUser);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    // Admin can change password without knowing the old password
    public void changePassword(PasswordChangeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + request.getUserId()));
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Student can update their own password with verification of current password
    public void updatePassword(PasswordUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}