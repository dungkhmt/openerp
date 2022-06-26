package com.hust.baseweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Properties;

@EnableScheduling
@SpringBootApplication
public class BasewebApplication {

    public static void main(String[] args) {
//        SpringApplication.run(BasewebApplication.class, args);

        SpringApplication application = new SpringApplication(BasewebApplication.class);
        Properties properties = new Properties();

        properties.setProperty("spring.main.banner-mode", "off");
        properties.setProperty("logging.pattern.console", "");
        application.setDefaultProperties(properties);
        application.run(args);
    }
}
