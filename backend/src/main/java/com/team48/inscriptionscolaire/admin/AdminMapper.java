package com.team48.inscriptionscolaire.admin;

import com.team48.inscriptionscolaire.user.UserMapper;
import com.team48.inscriptionscolaire.user.UserResponseDto;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {
    
    private final UserMapper userMapper;
    
    public AdminMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    public AdminResponseDto toAdminResponseDto(Admin admin) {
        AdminResponseDto dto = new AdminResponseDto();
        
        // Map basic user fields using the existing UserMapper
        UserResponseDto userDto = userMapper.toUserResponseDto(admin);
        dto.setId(userDto.getId());
        dto.setFirstname(userDto.getFirstname());
        dto.setLastname(userDto.getLastname());
        dto.setEmail(userDto.getEmail());
        dto.setRoleName(userDto.getRoleName());
        dto.setCreatedDate(userDto.getCreatedDate());
        dto.setLastModifiedDate(userDto.getLastModifiedDate());
        
        // Map new fields added to User class
        dto.setDateOfBirth(userDto.getDateOfBirth());
        dto.setAddress(userDto.getAddress());
        dto.setPhoneNumber(userDto.getPhoneNumber());
        dto.setGender(userDto.getGender());
        dto.setNationality(userDto.getNationality());
        
        return dto;
    }
}