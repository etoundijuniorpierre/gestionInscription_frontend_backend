package com.team48.inscriptionscolaire.program;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProgramTest {

    @Test
    void testEnrollmentOpenWithinPeriod() {
        Program program = new Program();
        program.setRegistrationStartDate(LocalDate.now().minusDays(5));
        program.setRegistrationEndDate(LocalDate.now().plusDays(5));
        
        assertTrue(program.isEnrollmentOpen());
    }
    
    @Test
    void testEnrollmentClosedBeforePeriod() {
        Program program = new Program();
        program.setRegistrationStartDate(LocalDate.now().plusDays(5));
        program.setRegistrationEndDate(LocalDate.now().plusDays(10));
        
        assertFalse(program.isEnrollmentOpen());
    }
    
    @Test
    void testEnrollmentClosedAfterPeriod() {
        Program program = new Program();
        program.setRegistrationStartDate(LocalDate.now().minusDays(10));
        program.setRegistrationEndDate(LocalDate.now().minusDays(5));
        
        assertFalse(program.isEnrollmentOpen());
    }
    
    @Test
    void testEnrollmentClosedWithNullDates() {
        Program program = new Program();
        program.setRegistrationStartDate(null);
        program.setRegistrationEndDate(LocalDate.now().plusDays(5));
        
        assertFalse(program.isEnrollmentOpen());
        
        program.setRegistrationStartDate(LocalDate.now().minusDays(5));
        program.setRegistrationEndDate(null);
        
        assertFalse(program.isEnrollmentOpen());
    }
}