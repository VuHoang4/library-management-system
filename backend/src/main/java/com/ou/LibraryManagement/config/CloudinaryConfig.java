package com.ou.LibraryManagement.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dqp4lzmlz",
                "api_key", "457529543557797",
                "api_secret", "6jnZEM7Cc07vUDAOMOltWq3olmQ"
        ));
    }
}