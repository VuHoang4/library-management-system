package com.ou.LibraryManagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${momo.secure}")
    public boolean momoSecure;
}