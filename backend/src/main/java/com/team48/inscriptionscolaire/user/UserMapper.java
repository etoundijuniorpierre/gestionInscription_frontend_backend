package com.team48.inscriptionscolaire.user;

import com.team48.inscriptionscolaire.student.Student;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponseDto toUserResponseDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        // accountLocked in DTO is the same as status in User entity (true = locked/disabled)
        // Since isEnabled() returns !status, we need to invert it to get the status value
        dto.setAccountLocked(!user.isEnabled());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedDate(user.getCreatedDate());
        dto.setLastModifiedDate(user.getLastModifiedDate());
        
        // New fields added to User class
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setAddress(user.getAddress());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setGender(user.getGender());
        dto.setNationality(user.getNationality());
        
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName());
        }
        
        // If the user is a student, populate student-specific fields
        if (user instanceof Student) {
            Student student = (Student) user;
            
            // Set enrollment IDs if enrollments exist
            if (student.getEnrollmentList() != null) {
                List<Integer> enrollmentIds = student.getEnrollmentList().stream()
                        .map(enrollment -> enrollment.getId())
                        .collect(Collectors.toList());
                dto.setEnrollmentIds(enrollmentIds);
            }
        }
        
        return dto;
    }
    
    public List<UserResponseDto> toUserResponseDtoList(List<User> users) {
        return users.stream()
                .map(this::toUserResponseDto)
                .collect(Collectors.toList());
    }
    
    public void updateUserFromDto(UserRequestDto userRequestDto, User user) {
        user.setFirstname(userRequestDto.getFirstname());
        user.setLastname(userRequestDto.getLastname());
        user.setEmail(userRequestDto.getEmail());
        // accountLocked in DTO is the same as status in User entity (true = locked/disabled)
        // Since accountLocked is the inverse of isEnabled(), we need to invert it
        user.setStatus(!userRequestDto.isAccountLocked());
        // The isEnabled() method in User returns the inverse of status (true = enabled)
        // This is handled by the UserDetails interface implementation
        
        // New fields added to User class
        user.setDateOfBirth(userRequestDto.getDateOfBirth());
        user.setAddress(userRequestDto.getAddress());
        user.setPhoneNumber(userRequestDto.getPhoneNumber());
        user.setGender(userRequestDto.getGender());
        user.setNationality(userRequestDto.getNationality());
    }
}