package com.team48.inscriptionscolaire.enrollment;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AcademicInfoTest {

    @Test
    void testAcademicInfoWithDiplomaObtained() {
        AcademicInfo academicInfo = new AcademicInfo();
        academicInfo.setLastInstitution("University of Technology");
        academicInfo.setSpecialization("Computer Science");
        academicInfo.setAvailableForInternship(true);
        academicInfo.setStartDate(LocalDate.of(2020, 9, 1));
        academicInfo.setEndDate(LocalDate.of(2023, 6, 30));
        academicInfo.setDiplomaObtained("true");

        assertEquals("University of Technology", academicInfo.getLastInstitution());
        assertEquals("Computer Science", academicInfo.getSpecialization());
        assertTrue(academicInfo.getAvailableForInternship());
        assertEquals(LocalDate.of(2020, 9, 1), academicInfo.getStartDate());
        assertEquals(LocalDate.of(2023, 6, 30), academicInfo.getEndDate());
        assertEquals("true", academicInfo.getDiplomaObtained());
    }

    @Test
    void testAcademicInfoDtoWithDiplomaObtained() {
        AcademicInfoDto academicInfoDto = new AcademicInfoDto();
        academicInfoDto.setLastInstitution("University of Technology");
        academicInfoDto.setSpecialization("Computer Science");
        academicInfoDto.setAvailableForInternship(true);
        academicInfoDto.setStartDate(LocalDate.of(2020, 9, 1));
        academicInfoDto.setEndDate(LocalDate.of(2023, 6, 30));
        academicInfoDto.setDiplomaObtained("true");

        assertEquals("University of Technology", academicInfoDto.getLastInstitution());
        assertEquals("Computer Science", academicInfoDto.getSpecialization());
        assertTrue(academicInfoDto.getAvailableForInternship());
        assertEquals(LocalDate.of(2020, 9, 1), academicInfoDto.getStartDate());
        assertEquals(LocalDate.of(2023, 6, 30), academicInfoDto.getEndDate());
        assertEquals("true", academicInfoDto.getDiplomaObtained());
    }
}