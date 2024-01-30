package com.yugaplus.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.yugaplus.backend.UserInterceptor;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Value("${app.api.key:#{null}}")
    String appApiKey;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new UserInterceptor(appApiKey));
    }
}
