package com.hust.baseweb.applications.sscm.wmsv2.management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity
public class WmsSecurityConfig {
//    @Bean
//    public Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
//        Jwt2AuthenticationConverter jwtConverter = new Jwt2AuthenticationConverter();
//
//        jwtConverter.setJwtGrantedAuthoritiesConverter(new Jwt2AuthoritiesConverter());
//        jwtConverter.setPrincipalClaimName("preferred_username");
//
//        return jwtConverter;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.oauth2ResourceServer().jwt().jwtAuthenticationConverter(jwtAuthenticationConverter());
//        // State-less session (state in access-token only)
//        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//        http.csrf().disable();
//        return http.build();
//    }

//    @Bean
//    public HttpSecurity httpSecurityBean() {
//        return new HttpSecurity(); // TODO: ?
//    }
}
