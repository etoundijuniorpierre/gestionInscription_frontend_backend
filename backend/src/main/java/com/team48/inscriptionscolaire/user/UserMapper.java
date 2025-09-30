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
        dto.setAccountLocked(user.isAccountLocked());
        dto.setEnabled(user.isEnabled());
        
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName());
        }
        
        // If the user is a student, populate student-specific fields
        if (user instanceof Student) {
            Student student = (Student) user;
            dto.setDateOfBirth(student.getDateOfBirth());
            dto.setAddress(student.getAddress());
            dto.setPhoneNumber(student.getPhoneNumber());
            dto.setGender(student.getGender());
            dto.setNationality(student.getNationality());
            dto.setMaritalStatus(student.getMaritalStatus());
            dto.setDesiredAcademicYear(student.getDesiredAcademicYear());
            dto.setIntendedFieldOfStudy(student.getIntendedFieldOfStudy());
            
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
}