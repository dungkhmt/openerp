package com.hust.baseweb;

import com.hust.baseweb.applications.cache.UserCache;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BasewebApplication {

    public static void main(String[] args) {
        SpringApplication.run(BasewebApplication.class, args);
    }
}