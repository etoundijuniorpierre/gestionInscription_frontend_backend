package com.team48.inscriptionscolaire.document;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "application.upload")
@Getter
@Setter
public class FileUploadConfig {
    private List<String> allowedFileTypes;
    private List<String> allowedExtensions;
}