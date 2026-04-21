package com.ou.LibraryManagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Áp dụng cho mọi API
                        .allowedOrigins("http://localhost:5173") // Cổng của React (Frontend)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Bắt buộc phải có POST và PUT
                        .allowedHeaders("*") // Cho phép mọi Header (quan trọng khi gửi kèm JWT Token)
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}