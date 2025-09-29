package com.team48.inscriptionscolaire.student;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
@Hidden
public class StudentController {

    @GetMapping("/")
    public String greet(){
        return "Welcome to our Online Enrollment platform";
    }

}
