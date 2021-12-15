package com.hust.baseweb.applications.contentmanager.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import javax.validation.constraints.NotBlank;

@Getter
@AllArgsConstructor
@ConstructorBinding
@ConfigurationProperties(prefix = "spring.data.mongodb")
public class MongoConfigurationProperties {
    @NotBlank
    private String uri;

    @NotBlank
    private String database;
}
