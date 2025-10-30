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
        // Direct mapping: true = enabled/active, false = disabled/inactive
        dto.setAccountLocked(!user.isEnabled()); // accountLocked is the inverse of enabled
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

            // Set student status
            dto.setStudentStatus(student.getStatus());
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
        // Direct mapping: true = enabled/active, false = disabled/inactive
        user.setStatus(userRequestDto.isEnabled());

        // New fields added to User class
        user.setDateOfBirth(userRequestDto.getDateOfBirth());
        user.setAddress(userRequestDto.getAddress());
        user.setPhoneNumber(userRequestDto.getPhoneNumber());
        user.setGender(userRequestDto.getGender());
        user.setNationality(userRequestDto.getNationality());
    }
}