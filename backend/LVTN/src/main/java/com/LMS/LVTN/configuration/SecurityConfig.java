package com.LMS.LVTN.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {

    JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/auth/login",
            "/api/auth/introspect",
            "/api/auth/refresh",
            "/api/auth/logout",
            "/api/auth/forgot-password",
            "/api/auth/verify-otp-reset",
            "/api/upload",
            "/uploads/**",
            "/error",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.cors(org.springframework.security.config.Customizer.withDefaults());
        httpSecurity.authorizeHttpRequests(request -> request
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .anyRequest().authenticated());

        httpSecurity.sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        httpSecurity.exceptionHandling(exceptions -> 
                exceptions.authenticationEntryPoint(new JwtAuthenticationEntryPoint()));

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList("*")); 
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "x-academic-year"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
